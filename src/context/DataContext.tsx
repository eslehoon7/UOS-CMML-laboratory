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
  deleteDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

import { RESEARCH_DATA, ResearchItem } from '../data/researchData';

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
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
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
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface Member {
  id?: string;
  name: string;
  role: string;
  img?: string;
  order?: number;
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
  year: number;
  month: number;
  createdAt: string;
}

export interface DataContextType {
  members: Member[];
  professor: ProfessorData;
  alumni: Alumni[];
  research: ResearchItem[];
  gallery: GalleryImage[];
  user: User | null;
  loading: boolean;
  setMembers: (members: Member[] | ((prev: Member[]) => Member[])) => Promise<void>;
  setProfessor: (professor: ProfessorData | ((prev: ProfessorData) => ProfessorData)) => Promise<void>;
  setAlumni: (alumni: Alumni[] | ((prev: Alumni[]) => Alumni[])) => Promise<void>;
  setResearch: (research: ResearchItem[]) => Promise<void>;
  setGallery: (gallery: GalleryImage[]) => Promise<void>;
  addGalleryPhoto: (photo: Omit<GalleryImage, 'id'>) => Promise<void>;
  updateGalleryPhoto: (id: string, photo: Partial<Omit<GalleryImage, 'id'>>) => Promise<void>;
  deleteGalleryPhoto: (id: string) => Promise<void>;
}

const defaultAlumni: Alumni[] = [
  { name: 'Ilgeun Park (2009)', company: 'Doosan Electronics', img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
  { name: 'Yongkyu Kwak (2009)', company: 'SK', img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
  { name: 'Eonji Lee (2013)', company: 'BioSensor Lab.', img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" },
  { name: 'Jumin Lee (2014)', company: 'Molcube', img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
  { name: 'Joonseong Lee (2015)', company: 'HITS', img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" },
  { name: 'Seonghoon Kim (2015)', company: 'Molcube', img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" },
  { name: 'Yongbin Kim (2015)', company: 'Postdoc', img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
  { name: 'Hyunwook Kim (2016)', company: 'Cosmax', img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
  { name: 'Seonghan Kim (2016)', company: 'PhD, Lehigh University', img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" },
  { name: 'Jeongmin Lee (2017)', company: 'Chong Kun Dang', img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" },
  { name: 'Wontae Kim (2017)', company: '', img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
  { name: 'Junyeol Lee (2018)', company: 'Dongjin Semichem', img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
  { name: 'Yunju Cho (2018)', company: 'LT Material', img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" },
  { name: 'Donghyuk Lee (2018)', company: 'KISTEP', img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" },
  { name: 'Yunjae Park (2019)', company: 'UNIST', img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
  { name: 'Sohyun Kim (2019)', company: 'Navy', img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" },
  { name: 'Jihye Na (2020)', company: 'Samsung Electronics', img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" },
  { name: 'Seungmin Yoon (2021)', company: '(PhD in USA)', img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
  { name: 'Youhyun Nam', company: '(PhD in USA)', img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" },
  { name: 'Jiyeon Hyun', company: '(Samsung)', img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" },
  { name: 'Minjun Jung', company: 'Molecube', img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=400" },
  { name: 'Chan Young Joe', company: 'EHR&C', img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400" }
];

const defaultMembers: Member[] = [
  { name: 'Janghee Hong', role: 'PhD Student', img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
  { name: 'Yubin Song', role: 'MS student', img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" },
  { name: 'Jinho Jeong', role: 'MS student', img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
  { name: 'Hyensu Sim', role: 'MS student', img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" },
  { name: 'Unho Park', role: 'Undergraduate', img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" },
  { name: 'Sangheum Park', role: 'Undergraduate', img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" }
];

const defaultProfessor: ProfessorData = {
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

export function DataProvider({ children }: { children: ReactNode }) {
  const [members, setMembersLocal] = useState<Member[]>([]);
  const [professor, setProfessorLocal] = useState<ProfessorData>(defaultProfessor);
  const [alumni, setAlumniLocal] = useState<Alumni[]>([]);
  const [research, setResearchLocal] = useState<ResearchItem[]>([]);
  const [gallery, setGalleryLocal] = useState<GalleryImage[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth Listener
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  // Professor Listener
  useEffect(() => {
    const profRef = doc(db, 'settings', 'lab');
    const unsub = onSnapshot(profRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfessorLocal(docSnap.data() as ProfessorData);
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'settings/lab'));
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
    }, (err) => handleFirestoreError(err, OperationType.GET, 'members'));
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
    }, (err) => handleFirestoreError(err, OperationType.GET, 'alumni'));
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
      } else {
        // Fallback to static if nothing in Firestore yet
        setResearchLocal(RESEARCH_DATA.map((r, i) => ({ ...r, order: i })));
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, 'research'));
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
    }, (err) => handleFirestoreError(err, OperationType.GET, 'gallery'));
    return unsub;
  }, []);

  const setProfessor = async (prof: ProfessorData | ((prev: ProfessorData) => ProfessorData)) => {
    try {
      const newData = typeof prof === 'function' ? prof(professor) : prof;
      await setDoc(doc(db, 'settings', 'lab'), newData);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/lab');
    }
  };

  const setMembers = async (newMembers: Member[] | ((prev: Member[]) => Member[])) => {
    try {
      const targetMembers = typeof newMembers === 'function' ? newMembers(members) : newMembers;
      const batch = writeBatch(db);
      
      // Cleanup existing that are not in next
      const nextIds = targetMembers.map(m => m.id).filter(Boolean);
      members.forEach(m => {
        if (m.id && !nextIds.includes(m.id)) {
          batch.delete(doc(db, 'members', m.id));
        }
      });

      targetMembers.forEach((m, index) => {
        const docRef = m.id ? doc(db, 'members', m.id) : doc(collection(db, 'members'));
        batch.set(docRef, {
          name: m.name,
          role: m.role,
          img: m.img || null,
          order: index
        });
      });

      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'members');
    }
  };

  const setAlumni = async (newAlumni: Alumni[] | ((prev: Alumni[]) => Alumni[])) => {
    try {
      const targetAlumni = typeof newAlumni === 'function' ? newAlumni(alumni) : newAlumni;
      const batch = writeBatch(db);
      
      const nextIds = targetAlumni.map(ta => ta.id).filter(Boolean);
      alumni.forEach(a => {
        if (a.id && !nextIds.includes(a.id)) {
          batch.delete(doc(db, 'alumni', a.id));
        }
      });

      targetAlumni.forEach((a, index) => {
        const docRef = a.id ? doc(db, 'alumni', a.id) : doc(collection(db, 'alumni'));
        batch.set(docRef, {
          name: a.name,
          company: a.company,
          img: a.img || null,
          order: index
        });
      });

      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'alumni');
    }
  };

  const setResearch = async (newResearch: ResearchItem[]) => {
    try {
      const batch = writeBatch(db);
      
      // Get current Firestore items to handle deletions
      const q = query(collection(db, 'research'));
      const snap = await getDocs(q);
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
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'research');
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

      newGallery.forEach((g) => {
        const docRef = g.id ? doc(db, 'gallery', g.id) : doc(collection(db, 'gallery'));
        batch.set(docRef, {
          url: g.url,
          year: g.year,
          month: g.month,
          createdAt: g.createdAt || new Date().toISOString()
        });
      });

      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'gallery');
    }
  };

  const addGalleryPhoto = async (photo: Omit<GalleryImage, 'id'>) => {
    try {
      const docRef = doc(collection(db, 'gallery'));
      await setDoc(docRef, {
        ...photo,
        createdAt: photo.createdAt || new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'gallery');
    }
  };

  const deleteGalleryPhoto = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'gallery');
    }
  };

  const updateGalleryPhoto = async (id: string, photo: Partial<Omit<GalleryImage, 'id'>>) => {
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
      user, 
      loading,
      setMembers, 
      setProfessor, 
      setAlumni,
      setResearch,
      setGallery,
      addGalleryPhoto,
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
