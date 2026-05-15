/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  query, 
  orderBy, 
  limit,
  writeBatch,
  getDocs,
  getDoc,
  getDocFromServer,
  deleteDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

import { publications as defaultPublications } from '../data/publications';
import { ResearchItem, RESEARCH_DATA } from '../data/researchData';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const isQuotaError = errorMessage.toLowerCase().includes('quota') || 
                       errorMessage.toLowerCase().includes('limit exceeded') ||
                       errorMessage.toLowerCase().includes('resource-exhausted');

  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  
  if (isQuotaError) {
    console.warn('Firestore Resource Exhausted or Quota Exceeded. This may happen if images are too large or daily limits are hit.', JSON.stringify(errInfo));
    // We don't throw for quota errors to allow the app to stay functional with static/cached data for reads
    if (operationType === OperationType.GET || operationType === OperationType.LIST) {
      return;
    }
  }

  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helper to safely set localStorage items to avoid QuotaExceededError
const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`LocalStorage quota exceeded for key: ${key}. Data not cached.`);
  }
};

export interface Member {
  id?: string;
  name: string;
  role: string;
  img?: string;
  order?: number;
}

export interface SiteSettings {
  homeHeroImg: string;
  homeIntroImg: string;
  photosHeroImg: string;
  researchHeroImg: string;
}

export interface InfoItem {
  title: string;
  subtitle: string;
}

export interface ProfessorData {
  name: string;
  affiliation: string;
  email: string;
  img?: string;
  degrees: string[];
  career: string[];
  awards: InfoItem[];
}

export interface Alumni {
  id?: string;
  name: string;
  company: string;
  img?: string;
  order?: number;
}

export interface GalleryImage {
  id?: string;
  url: string;
  year?: number;
  month?: number;
  createdAt: string;
}

export interface Publication {
  id: string; // Changed to string for Firestore
  authors: string;
  title: string;
  journal: string;
  year: number;
  details?: string;
  tags?: string[];
  numericId?: number; // Keep the original numeric ID for sorting if needed
}

export interface DataContextType {
  members: Member[];
  professor: ProfessorData;
  alumni: Alumni[];
  research: ResearchItem[];
  gallery: GalleryImage[];
  publications: Publication[];
  siteSettings: SiteSettings;
  isInitialLoadDone: {
    professor: boolean;
    members: boolean;
    alumni: boolean;
    research: boolean;
    gallery: boolean;
    publications: boolean;
    appearance: boolean;
  };
  user: User | null;
  loading: boolean;
  setMembers: (members: Member[] | ((prev: Member[]) => Member[])) => Promise<Member[]>;
  setProfessor: (professor: ProfessorData | ((prev: ProfessorData) => ProfessorData)) => Promise<void>;
  setAlumni: (alumni: Alumni[] | ((prev: Alumni[]) => Alumni[])) => Promise<Alumni[]>;
  setResearch: (research: ResearchItem[]) => Promise<ResearchItem[]>;
  setGallery: (gallery: GalleryImage[]) => Promise<void>;
  setPublications: (publications: Publication[]) => Promise<Publication[]>;
  setSiteSettings: (settings: SiteSettings) => Promise<void>;
  addGalleryPhoto: (photo: Omit<GalleryImage, 'id'>) => Promise<void>;
  addGalleryPhotos: (photos: Omit<GalleryImage, 'id'>[]) => Promise<void>;
  updateGalleryPhoto: (id: string, photo: Partial<Omit<GalleryImage, 'id'>>) => Promise<void>;
  deleteGalleryPhoto: (id: string) => Promise<void>;
}

export const defaultAlumni: Alumni[] = [
  { name: 'Ilgeun Park (2009)', company: 'Doosan Electronics', img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
  { name: 'Yongkyu Kwak (2009)', company: 'SK', img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
  { name: 'Eonji Lee (2013)', company: 'BioSensor Lab.', img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" },
  { name: 'Jumin Lee (2014)', company: 'Molcube', img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
  { name: 'Joonseong Lee (2015)', company: 'HITS', img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" },
  { name: 'Seonghoon Kim (2015)', company: 'Molcube', img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" },
  { name: 'Yongbin Kim (2015)', company: 'Postdoc', img: "https://images.unsplash.com/photo-1492288991661-058aa541ff43?auto=format&fit=crop&q=80&w=400" },
  { name: 'Hyunwook Kim (2016)', company: 'Cosmax', img: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&q=80&w=400" },
  { name: 'Seonghan Kim (2016)', company: 'PhD, Lehigh University', img: "https://images.unsplash.com/photo-1520341280432-4749d4fd01ff?auto=format&fit=crop&q=80&w=400" },
  { name: 'Jeongmin Lee (2017)', company: 'Chong Kun Dang', img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400" },
  { name: 'Wontae Kim (2017)', company: '', img: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=400" },
  { name: 'Junyeol Lee (2018)', company: 'Dongjin Semichem', img: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&q=80&w=400" },
  { name: 'Yunju Cho (2018)', company: 'LT Material', img: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=400" },
  { name: 'Donghyuk Lee (2018)', company: 'KISTEP', img: "https://images.unsplash.com/photo-1552058544-1e70ede94421?auto=format&fit=crop&q=80&w=400" },
  { name: 'Yunjae Park (2019)', company: 'UNIST', img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" },
  { name: 'Sohyun Kim (2019)', company: 'Navy', img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400" },
  { name: 'Jihye Na (2020)', company: 'Samsung Electronics', img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" },
  { name: 'Seungmin Yoon (2021)', company: '(PhD in USA)', img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400" },
  { name: 'Youhyun Nam', company: '(PhD in USA)', img: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=400" },
  { name: 'Jiyeon Hyun', company: '(Samsung)', img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" },
  { name: 'Minjun Jung', company: 'Molecube', img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=400" },
  { name: 'Chan Young Joe', company: 'EHR&C', img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400" }
];

export const defaultMembers: Member[] = [
  { name: 'Janghee Hong', role: 'PhD Student', img: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=400" },
  { name: 'Yubin Song', role: 'MS student', img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" },
  { name: 'Jinho Jeong', role: 'MS student', img: "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?auto=format&fit=crop&q=80&w=400" },
  { name: 'Hyensu Sim', role: 'MS student', img: "https://images.unsplash.com/photo-1541577141970-eebc83ebe30e?auto=format&fit=crop&q=80&w=400" },
  { name: 'Unho Park', role: 'Undergraduate', img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400" },
  { name: 'Sangheum Park', role: 'Undergraduate', img: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=400" }
];

export const defaultProfessor: ProfessorData = {
  name: 'Prof. Rakwoo Chang',
  affiliation: 'Department of Applied Chemistry · University of Seoul',
  email: 'rchang90@uos.ac.kr',
  img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
  degrees: [
    'B.S. Chemistry — Seoul National University, 1990.3 - 1994.2',
    'M.S. Chemistry — Seoul National University, 1994.3 - 1996.2',
    'Ph.D. Chemistry — University of Wisconsin-Madison, 1998.9 - 2003.8'
  ],
  career: [
    'Postdoc — University of Utah, 2003–2005',
    'Asst./Assoc./Full Professor — Kwangwoon University, 2005–2021',
    'Professor — University of Seoul, 2021–Present'
  ],
  awards: [
    { title: 'Frank J. Padden Jr. Award', subtitle: 'APS, 2003' },
    { title: 'Best Teacher Award', subtitle: 'Kwangwoon University, 2006, 2015, 2022' }
  ]
};

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultSiteSettings: SiteSettings = {
  homeHeroImg: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=2670",
  homeIntroImg: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1000",
  photosHeroImg: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=2670",
  researchHeroImg: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=2670"
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [members, setMembersLocal] = useState<Member[]>([]);
  const [professor, setProfessorLocal] = useState<ProfessorData>(defaultProfessor);
  const [alumni, setAlumniLocal] = useState<Alumni[]>([]);
  const [research, setResearchLocal] = useState<ResearchItem[]>([]);
  const [gallery, setGalleryLocal] = useState<GalleryImage[]>([]);
  const [publications, setPublicationsLocal] = useState<Publication[]>([]);
  const [siteSettings, setSiteSettingsLocal] = useState<SiteSettings>(defaultSiteSettings);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth Listener
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  // Initial data loading state to prevent auto-save loops
  const [isInitialLoadDone, setIsInitialLoadDone] = useState({
    professor: false,
    members: false,
    alumni: false,
    research: false,
    gallery: false,
    publications: false,
    appearance: false
  });

  // Professor Listener
  useEffect(() => {
    const profRef = doc(db, 'settings', 'lab');
    const unsub = onSnapshot(profRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as ProfessorData;
        setProfessorLocal(data);
        safeSetItem('lab_professor', JSON.stringify(data));
      }
      setIsInitialLoadDone(prev => ({ ...prev, professor: true }));
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'settings/lab');
      setProfessorLocal(prev => {
        const saved = localStorage.getItem('lab_professor');
        return saved ? JSON.parse(saved) : (prev || defaultProfessor);
      });
      setIsInitialLoadDone(prev => ({ ...prev, professor: true }));
    });
    return unsub;
  }, []);

  // Members Listener
  useEffect(() => {
    const q = query(collection(db, 'members'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items: Member[] = [];
      snapshot.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as Member);
      });
      setMembersLocal(items);
      if (items.length > 0) {
        safeSetItem('lab_members', JSON.stringify(items));
      }
      setIsInitialLoadDone(prev => ({ ...prev, members: true }));
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'members');
      setMembersLocal(prev => {
        if (prev.length > 0) return prev;
        const saved = localStorage.getItem('lab_members');
        return saved ? JSON.parse(saved) : (prev.length > 0 ? prev : defaultMembers);
      });
      setIsInitialLoadDone(prev => ({ ...prev, members: true }));
    });
    return unsub;
  }, []);

  // Alumni Listener
  useEffect(() => {
    const q = query(collection(db, 'alumni'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items: Alumni[] = [];
      snapshot.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as Alumni);
      });
      setAlumniLocal(items);
      if (items.length > 0) {
        safeSetItem('lab_alumni', JSON.stringify(items));
      }
      setIsInitialLoadDone(prev => ({ ...prev, alumni: true }));
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'alumni');
      setAlumniLocal(prev => {
        if (prev.length > 0) return prev;
        const saved = localStorage.getItem('lab_alumni');
        return saved ? JSON.parse(saved) : (prev.length > 0 ? prev : defaultAlumni);
      });
      setIsInitialLoadDone(prev => ({ ...prev, alumni: true }));
    });
    return unsub;
  }, []);

  // Research Listener
  useEffect(() => {
    const q = query(collection(db, 'research'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items: ResearchItem[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        items.push({ ...data, id: d.id } as ResearchItem);
      });
      
      if (items.length > 0) {
        setResearchLocal(items);
        safeSetItem('lab_research', JSON.stringify(items));
      } else {
        // Fallback if collection is truly empty
        setResearchLocal(prev => {
           if (prev.length > 0) return prev;
           const saved = localStorage.getItem('lab_research');
           return saved ? JSON.parse(saved) : (prev.length > 0 ? prev : RESEARCH_DATA.map((r, i) => ({ ...r, order: i })));
        });
      }
      setIsInitialLoadDone(prev => ({ ...prev, research: true }));
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'research');
      setResearchLocal(prev => {
        if (prev.length > 0) return prev;
        const saved = localStorage.getItem('lab_research');
        return saved ? JSON.parse(saved) : (prev.length > 0 ? prev : RESEARCH_DATA.map((r, i) => ({ ...r, order: i })));
      });
      setIsInitialLoadDone(prev => ({ ...prev, research: true }));
    });
    return unsub;
  }, []);

  // Gallery Listener
  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items: GalleryImage[] = [];
      snapshot.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as GalleryImage);
      });
      setGalleryLocal(items);
      if (items.length > 0) {
        safeSetItem('lab_gallery', JSON.stringify(items));
      }
      setIsInitialLoadDone(prev => ({ ...prev, gallery: true }));
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'gallery');
      setGalleryLocal(prev => {
        if (prev.length > 0) return prev;
        const saved = localStorage.getItem('lab_gallery');
        return saved ? JSON.parse(saved) : prev;
      });
      setIsInitialLoadDone(prev => ({ ...prev, gallery: true }));
    });
    return unsub;
  }, []);

  // Publications Listener
  useEffect(() => {
    const q = query(collection(db, 'publications'), orderBy('year', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items: Publication[] = [];
      snapshot.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as Publication);
      });
      
      // Sort within years by numericId if it exists, otherwise by Firestore ID
      items.sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        if (b.numericId !== undefined && a.numericId !== undefined) {
           return b.numericId - a.numericId;
        }
        return b.id.localeCompare(a.id);
      });

      setPublicationsLocal(items);
      if (items.length > 0) {
        safeSetItem('lab_publications', JSON.stringify(items));
      }
      setIsInitialLoadDone(prev => ({ ...prev, publications: true }));
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'publications');
      setPublicationsLocal(prev => {
        if (prev.length > 0) return prev;
        const saved = localStorage.getItem('lab_publications');
        const fallback = defaultPublications.map(p => ({ ...p, id: String(p.id), numericId: p.id }));
        return saved ? JSON.parse(saved) : fallback;
      });
      setIsInitialLoadDone(prev => ({ ...prev, publications: true }));
    });
    return unsub;
  }, []);
  useEffect(() => {
    const settingsRef = doc(db, 'settings', 'appearance');
    const unsub = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as SiteSettings;
        setSiteSettingsLocal(data);
        safeSetItem('site_appearance', JSON.stringify(data));
      }
      setIsInitialLoadDone(prev => ({ ...prev, appearance: true }));
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'settings/appearance');
      setSiteSettingsLocal(prev => {
         if (prev && prev !== defaultSiteSettings) return prev;
         const saved = localStorage.getItem('site_appearance');
         return saved ? JSON.parse(saved) : (prev || defaultSiteSettings);
      });
      setIsInitialLoadDone(prev => ({ ...prev, appearance: true }));
    });
    return unsub;
  }, []);

  const setProfessor = async (prof: ProfessorData | ((prev: ProfessorData) => ProfessorData)) => {
    try {
      const newData = typeof prof === 'function' ? prof(professor) : prof;
      // Deep equal check to avoid redundant writes
      if (JSON.stringify(newData) === JSON.stringify(professor)) return;
      
      await setDoc(doc(db, 'settings', 'lab'), newData);
      // Optimistic update
      setProfessorLocal(newData);
      safeSetItem('lab_professor', JSON.stringify(newData));
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/lab');
    }
  };

  const setMembers = async (newMembers: Member[] | ((prev: Member[]) => Member[])) => {
    try {
      let targetMembers = typeof newMembers === 'function' ? newMembers(members) : newMembers;
      
      // Deduplicate by name to prevent multiple entries for the same person
      const seen = new Set();
      targetMembers = targetMembers.filter(m => {
        const key = m.name?.toLowerCase().trim();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      const batch = writeBatch(db);
      
      // Cleanup existing that are not in next
      const nextIds = targetMembers.map(m => m.id).filter(Boolean);
      members.forEach(m => {
        if (m.id && !nextIds.includes(m.id)) {
          batch.delete(doc(db, 'members', m.id));
        }
      });

      const updatedWithIds = targetMembers.map((m, index) => {
        const docRef = m.id ? doc(db, 'members', m.id) : doc(collection(db, 'members'));
        const memberData = {
          name: m.name,
          role: m.role,
          img: m.img || null,
          order: index
        };
        batch.set(docRef, memberData);
        return { ...memberData, id: docRef.id };
      });

      await batch.commit();
      // Optimistic update
      setMembersLocal(updatedWithIds);
      safeSetItem('lab_members', JSON.stringify(updatedWithIds));
      return updatedWithIds;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'members');
      return [];
    }
  };

  const setAlumni = async (newAlumni: Alumni[] | ((prev: Alumni[]) => Alumni[])) => {
    try {
      let targetAlumni = typeof newAlumni === 'function' ? newAlumni(alumni) : newAlumni;
      
      // Deduplicate
      const seen = new Set();
      targetAlumni = targetAlumni.filter(m => {
        const key = m.name?.toLowerCase().trim();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      const batch = writeBatch(db);
      
      const nextIds = targetAlumni.map(ta => ta.id).filter(Boolean);
      alumni.forEach(a => {
        if (a.id && !nextIds.includes(a.id)) {
          batch.delete(doc(db, 'alumni', a.id));
        }
      });

      const updatedWithIds = targetAlumni.map((a, index) => {
        const docRef = a.id ? doc(db, 'alumni', a.id) : doc(collection(db, 'alumni'));
        const alumniData = {
          name: a.name,
          company: a.company || null,
          img: a.img || null,
          order: index
        };
        batch.set(docRef, alumniData);
        return { ...alumniData, id: docRef.id };
      });

      await batch.commit();
      // Optimistic update
      setAlumniLocal(updatedWithIds);
      safeSetItem('lab_alumni', JSON.stringify(updatedWithIds));
      return updatedWithIds;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'alumni');
      return [];
    }
  };

  const setResearch = async (newResearch: ResearchItem[]) => {
    // Optimistic update
    setResearchLocal(newResearch);
    safeSetItem('lab_research', JSON.stringify(newResearch));

    try {
      const batch = writeBatch(db);
      
      // Get current Firestore items to handle deletions
      const snap = await getDocs(query(collection(db, 'research'), limit(500)));
      const currentIds = snap.docs.map(d => d.id);
      const nextIds = newResearch.map(r => r.id).filter(Boolean);

      currentIds.forEach(id => {
        if (!nextIds.includes(id)) {
          batch.delete(doc(db, 'research', id));
        }
      });

      newResearch.forEach((r, index) => {
        const docRef = doc(db, 'research', r.id); 
        batch.set(docRef, {
          title: r.title,
          subtitle: r.subtitle,
          shortDescription: r.shortDescription,
          fullDescription: r.fullDescription || [],
          imageUrl: r.imageUrl || '',
          detailImageUrl: r.detailImageUrl || '',
          publications: r.publications || [],
          references: r.references || [],
          order: index
        });
      });

      await batch.commit();
      return newResearch;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'research');
      return newResearch;
    }
  };

  const setGallery = async (newGallery: GalleryImage[]) => {
    try {
      const batch = writeBatch(db);
      
      // Get current Firestore items to handle deletions
      const q = query(collection(db, 'gallery'));
      const snap = await getDocs(q);
      const currentIds = snap.docs.map(d => d.id);
      const nextIds = newGallery.map(g => g.id).filter(Boolean);

      currentIds.forEach(id => {
        if (!nextIds.includes(id)) {
          batch.delete(doc(db, 'gallery', id));
        }
      });

      const updatedWithIds = newGallery.map((g) => {
        const docRef = g.id ? doc(db, 'gallery', g.id) : doc(collection(db, 'gallery'));
        const photoData: any = {
          url: g.url,
          createdAt: g.createdAt || new Date().toISOString()
        };
        if (g.year) photoData.year = g.year;
        if (g.month) photoData.month = g.month;
        
        batch.set(docRef, photoData);
        return { ...photoData, id: docRef.id };
      });

      await batch.commit();
      // Optimistic update
      setGalleryLocal(updatedWithIds);
      safeSetItem('lab_gallery', JSON.stringify(updatedWithIds));
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'gallery');
    }
  };

  const setPublications = async (newPubs: Publication[]) => {
    // Optimistic update
    setPublicationsLocal(newPubs);
    safeSetItem('lab_publications', JSON.stringify(newPubs));

    try {
      const batch = writeBatch(db);
      
      // Get current Firestore items to handle deletions
      const snap = await getDocs(query(collection(db, 'publications'), limit(1000)));
      const currentIds = snap.docs.map(d => d.id);
      
      const updatedWithIds = [...newPubs];
      const nextIds: string[] = [];

      updatedWithIds.forEach((p, index) => {
        let docRef;
        if (p.id && !p.id.startsWith('temp_') && !p.id.startsWith('pub_new_')) {
          docRef = doc(db, 'publications', p.id);
        } else {
          docRef = doc(collection(db, 'publications'));
          updatedWithIds[index] = { ...p, id: docRef.id };
        }
        
        nextIds.push(docRef.id);
        
        batch.set(docRef, {
          authors: p.authors || '',
          title: p.title || '',
          journal: p.journal || '',
          year: p.year || new Date().getFullYear(),
          details: p.details || '',
          tags: p.tags || [],
          numericId: p.numericId || 0
        });
      });

      // Delete items no longer in the list
      currentIds.forEach(id => {
        if (!nextIds.includes(id)) {
          batch.delete(doc(db, 'publications', id));
        }
      });

      await batch.commit();
      
      // Update local state with real IDs to prevent duplicates on next auto-save
      setPublicationsLocal(updatedWithIds);
      safeSetItem('lab_publications', JSON.stringify(updatedWithIds));
      return updatedWithIds;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'publications');
      return newPubs;
    }
  };

  const setSiteSettings = async (settings: SiteSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'appearance'), settings);
      // Optimistic update
      setSiteSettingsLocal(settings);
      safeSetItem('site_appearance', JSON.stringify(settings));
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/appearance');
    }
  };

  const addGalleryPhoto = async (photo: Omit<GalleryImage, 'id'>) => {
    const docRef = doc(collection(db, 'gallery'));
    const newPhoto = {
      ...photo,
      id: docRef.id,
      createdAt: photo.createdAt || new Date().toISOString()
    };
    
    // Optimistic update
    setGalleryLocal(prev => [newPhoto, ...prev]);
    const currentCached = localStorage.getItem('lab_gallery');
    const galleryList = currentCached ? JSON.parse(currentCached) : [];
    safeSetItem('lab_gallery', JSON.stringify([newPhoto, ...galleryList]));

    try {
      const photoData: any = {
        url: photo.url,
        createdAt: newPhoto.createdAt
      };
      if (photo.year) photoData.year = photo.year;
      if (photo.month) photoData.month = photo.month;

      await setDoc(docRef, photoData);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'gallery');
    }
  };

  const addGalleryPhotos = async (photos: Omit<GalleryImage, 'id'>[]) => {
    if (photos.length === 0) return;
    
    const batch = writeBatch(db);
    const newPhotos: GalleryImage[] = [];
    
    photos.forEach(photo => {
      const docRef = doc(collection(db, 'gallery'));
      const newPhoto = {
        ...photo,
        id: docRef.id,
        createdAt: photo.createdAt || new Date().toISOString()
      };
      
      const photoData: any = {
        url: photo.url,
        createdAt: newPhoto.createdAt
      };
      if (photo.year) photoData.year = photo.year;
      if (photo.month) photoData.month = photo.month;
      
      batch.set(docRef, photoData);
      newPhotos.push(newPhoto);
    });
    
    if (newPhotos.length === 0) return;
    
    // Optimistic update
    setGalleryLocal(prev => [...newPhotos, ...prev]);
    
    try {
      await batch.commit();
    } catch (err) {
      // Rollback optimistic update on error
      setGalleryLocal(prev => prev.filter(p => !newPhotos.some(np => np.id === p.id)));
      handleFirestoreError(err, OperationType.WRITE, 'gallery');
    }
  };

  const deleteGalleryPhoto = async (id: string) => {
    // Optimistic update
    setGalleryLocal(prev => prev.filter(p => p.id !== id));
    const currentCached = localStorage.getItem('lab_gallery');
    if (currentCached) {
      const galleryList = JSON.parse(currentCached).filter((p: any) => p.id !== id);
      safeSetItem('lab_gallery', JSON.stringify(galleryList));
    }

    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'gallery');
    }
  };

  const updateGalleryPhoto = async (id: string, photo: Partial<Omit<GalleryImage, 'id'>>) => {
    // Optimistic update
    setGalleryLocal(prev => prev.map(p => p.id === id ? { ...p, ...photo } : p));
    const currentCached = localStorage.getItem('lab_gallery');
    if (currentCached) {
      const galleryList = JSON.parse(currentCached).map((p: any) => p.id === id ? { ...p, ...photo } : p);
      safeSetItem('lab_gallery', JSON.stringify(galleryList));
    }

    try {
      await setDoc(doc(db, 'gallery', id), photo, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'gallery');
    }
  };

  // Initial Seed check
  useEffect(() => {
    const seed = async () => {
      if (!user) return;

      try {
        // 1. Check Professor Data
        const profRef = doc(db, 'settings', 'lab');
        const profSnap = await getDoc(profRef);
        if (!profSnap.exists()) {
          await setProfessor(defaultProfessor);
        }

        // 2. Check Members
        const mSnap = await getDocs(query(collection(db, 'members'), limit(1)));
        if (mSnap.empty) {
          await setMembers(defaultMembers);
        }

        // 3. Check Alumni
        const aSnap = await getDocs(query(collection(db, 'alumni'), limit(1)));
        if (aSnap.empty) {
          await setAlumni(defaultAlumni);
        }

        // 4. Check Research
        const rSnap = await getDocs(query(collection(db, 'research'), limit(1)));
        if (rSnap.empty) {
          await setResearch(RESEARCH_DATA);
        }

        // 5. Check Gallery
        const gSnapshot = await getDocs(query(collection(db, 'gallery'), limit(1)));
        if (gSnapshot.empty) {
          await addGalleryPhoto({
            url: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=1200",
            createdAt: new Date().toISOString()
          });
        }

        // 6. Check Publications
        const pubSnap = await getDocs(query(collection(db, 'publications'), limit(1)));
        if (pubSnap.empty) {
          const pubsToSeed = defaultPublications.map(p => ({ 
            ...p, 
            id: String(p.id),
            numericId: p.id 
          }));
          await setPublications(pubsToSeed);
        }

        // 7. Check Site Settings
        const settingsRef = doc(db, 'settings', 'appearance');
        const settingsSnap = await getDoc(settingsRef);
        if (!settingsSnap.exists()) {
          await setSiteSettings(defaultSiteSettings);
        }
      } catch (err) {
        console.warn('Initial seed check error:', err);
      }
    };
    
    if (!loading && user) {
      seed();
    }
  }, [user, loading]);

  return (
    <DataContext.Provider value={{ 
      members, 
      professor, 
      alumni, 
      research,
      gallery,
      publications,
      siteSettings,
      isInitialLoadDone,
      user, 
      loading,
      setMembers, 
      setProfessor, 
      setAlumni,
      setResearch,
      setGallery,
      setPublications,
      setSiteSettings,
      addGalleryPhoto,
      addGalleryPhotos,
      updateGalleryPhoto,
      deleteGalleryPhoto
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
