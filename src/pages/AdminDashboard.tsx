/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useRef, ChangeEvent, useEffect } from 'react';
import { 
  PlusSquare, 
  Edit3, 
  Trash2, 
  Image as ImageIcon,
  LogOut,
  Home,
  X,
  Plus,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  useData, 
  SiteSettings, 
  Member, 
  Alumni, 
  Publication,
  defaultMembers,
  defaultAlumni,
  defaultProfessor
} from '../context/DataContext';
import { compressImage, compressBase64 } from '../lib/imageUtils';
import { logout } from '../lib/firebase';
import { ResearchItem } from '../data/researchData';

export default function AdminDashboard() {
  const { 
    members, professor, alumni, research, gallery, publications, siteSettings, 
    setMembers, setProfessor, setAlumni, setResearch, setGallery, setPublications, setSiteSettings, 
    addGalleryPhoto, addGalleryPhotos, updateGalleryPhoto, deleteGalleryPhoto, 
    user, loading, isInitialLoadDone 
  } = useData();

  const [activeTab, setActiveTab] = useState<'research' | 'members' | 'photos' | 'publications' | 'settings'>('research');
  const [isSaving, setIsSaving] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; title: string; message: string }>({ isOpen: false, title: '', message: '' });
  
  // Local states for editing
  const [localProfessor, setLocalProfessor] = useState(professor);
  const [localResearch, setLocalResearch] = useState<ResearchItem[]>(research);
  const [localMembers, setLocalMembers] = useState(members);
  const [localAlumni, setLocalAlumni] = useState(alumni);
  const [localGallery, setLocalGallery] = useState(gallery);
  const [localPublications, setLocalPublications] = useState(publications);
  const [localSiteSettings, setLocalSiteSettings] = useState(siteSettings);
  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);
  const [newTagValue, setNewTagValue] = useState("");
  const [isDirty, setIsDirty] = useState({
    professor: false,
    research: false,
    members: false,
    alumni: false,
    publications: false,
    settings: false
  });

  // SCRUBBER: Detect and fix oversized images in local state
  useEffect(() => {
    const scrubData = async () => {
      let changed = false;
      const MAX_BASE64_LENGTH = 1000000; // ~750KB
      const SETTINGS_IMAGE_LIMIT = 200000; // ~150KB per image for settings specifically (4 images total = ~800KB)

      // Scrub Members
      const scrubbedMembers = await Promise.all(localMembers.map(async (m) => {
        if (m.img && m.img.startsWith('data:image') && m.img.length > MAX_BASE64_LENGTH) {
          const compressed = await compressBase64(m.img, 800, 800, 0.7);
          changed = true;
          return { ...m, img: compressed };
        }
        return m;
      }));

      // Scrub Alumni
      const scrubbedAlumni = await Promise.all(localAlumni.map(async (a) => {
        if (a.img && a.img.startsWith('data:image') && a.img.length > MAX_BASE64_LENGTH) {
          const compressed = await compressBase64(a.img, 800, 800, 0.7);
          changed = true;
          return { ...a, img: compressed };
        }
        return a;
      }));
      
      // Scrub Professor
      let scrubbedProfessor = localProfessor;
      if (localProfessor.img && localProfessor.img.startsWith('data:image') && localProfessor.img.length > MAX_BASE64_LENGTH) {
        const compressed = await compressBase64(localProfessor.img, 800, 800, 0.6);
        scrubbedProfessor = { ...localProfessor, img: compressed };
        changed = true;
      }

      // Scrub Research
      const scrubbedResearch = await Promise.all(localResearch.map(async (r) => {
        if (r.imageUrl && r.imageUrl.startsWith('data:image') && r.imageUrl.length > MAX_BASE64_LENGTH) {
          const compressed = await compressBase64(r.imageUrl, 800, 800, 0.6);
          changed = true;
          return { ...r, imageUrl: compressed };
        }
        return r;
      }));

      // Scrub Settings - CRITICAL for 1MB document limit
      let scrubbedSettings = localSiteSettings;
      const settingKeys: (keyof SiteSettings)[] = ['homeHeroImg', 'homeIntroImg', 'photosHeroImg', 'researchHeroImg'];
      for (const key of settingKeys) {
        if (localSiteSettings[key] && localSiteSettings[key].startsWith('data:image') && localSiteSettings[key].length > SETTINGS_IMAGE_LIMIT) {
          // Drastically reduce site settings images because they are bundled together
          const compressed = await compressBase64(localSiteSettings[key], 600, 600, 0.4);
          scrubbedSettings = { ...scrubbedSettings, [key]: compressed };
          changed = true;
        }
      }

      if (changed) {
        setLocalMembers(scrubbedMembers);
        setLocalAlumni(scrubbedAlumni);
        setLocalProfessor(scrubbedProfessor);
        setLocalResearch(scrubbedResearch);
        setLocalSiteSettings(scrubbedSettings);
        setIsDirty(prev => ({ ...prev, members: true, alumni: true, professor: true, research: true, settings: true }));
      }
    };

    if (isInitialLoadDone.members && isInitialLoadDone.alumni && isInitialLoadDone.professor) {
      scrubData();
    }
  }, [isInitialLoadDone.members, isInitialLoadDone.alumni, isInitialLoadDone.professor]);

  const hasSyncedRef = useRef({
    professor: false,
    research: false,
    members: false,
    alumni: false,
    publications: false,
    gallery: false,
    settings: false
  });

  // Sync local state when external data loads initially
  useEffect(() => {
    if (isInitialLoadDone.professor && professor && !hasSyncedRef.current.professor) {
      setLocalProfessor(professor);
      hasSyncedRef.current.professor = true;
    }
  }, [professor, isInitialLoadDone.professor]);

  useEffect(() => {
    if (isInitialLoadDone.publications && publications.length > 0 && !hasSyncedRef.current.publications) {
      setLocalPublications(publications);
      hasSyncedRef.current.publications = true;
    }
  }, [publications, isInitialLoadDone.publications]);

  useEffect(() => {
    if (isInitialLoadDone.research && research.length > 0 && !hasSyncedRef.current.research) {
      setLocalResearch(research);
      hasSyncedRef.current.research = true;
    }
  }, [research, isInitialLoadDone.research]);

  useEffect(() => {
    if (isInitialLoadDone.members && members && !hasSyncedRef.current.members) {
      setLocalMembers(members);
      hasSyncedRef.current.members = true;
    }
  }, [members, isInitialLoadDone.members]);

  useEffect(() => {
    if (isInitialLoadDone.alumni && alumni && !hasSyncedRef.current.alumni) {
      setLocalAlumni(alumni);
      hasSyncedRef.current.alumni = true;
    }
  }, [alumni, isInitialLoadDone.alumni]);

  useEffect(() => {
    if (isInitialLoadDone.gallery && gallery.length > 0 && !hasSyncedRef.current.gallery) {
      setLocalGallery(gallery);
      hasSyncedRef.current.gallery = true;
    }
  }, [gallery, isInitialLoadDone.gallery]);

  useEffect(() => {
    if (isInitialLoadDone.appearance && siteSettings && !hasSyncedRef.current.settings) {
      setLocalSiteSettings(siteSettings);
      hasSyncedRef.current.settings = true;
    }
  }, [siteSettings, isInitialLoadDone.appearance]);

  // Debounced Auto-save for Research
  useEffect(() => {
    if (!isInitialLoadDone.research || !isDirty.research) return;
    const timer = setTimeout(async () => {
      if (isSaving) return; // Prevent overlapping writes
      setIsSaving(true);
      try {
        await setResearch(localResearch);
        setIsDirty(prev => {
          if (!prev.research) return prev;
          return { ...prev, research: false };
        });
      } catch (error: any) {
        console.error("Auto-save research failed:", error);
      } finally {
        setIsSaving(false);
      }
    }, 4500);
    return () => clearTimeout(timer);
  }, [localResearch, isInitialLoadDone.research, isDirty.research, setResearch, isSaving]);

  // Debounced Auto-save for Professor
  useEffect(() => {
    if (!isInitialLoadDone.professor || !localProfessor || !isDirty.professor) return;
    const timer = setTimeout(async () => {
      if (isSaving) return;
      setIsSaving(true);
      try {
        await setProfessor(localProfessor);
        setIsDirty(prev => {
          if (!prev.professor) return prev;
          return { ...prev, professor: false };
        });
      } catch (error: any) {
        console.error("Auto-save professor failed:", error);
      } finally {
        setIsSaving(false);
      }
    }, 4500);
    return () => clearTimeout(timer);
  }, [localProfessor, isInitialLoadDone.professor, isDirty.professor, setProfessor, isSaving]);

  // Debounced Auto-save for Members/Alumni
  useEffect(() => {
    if (!isInitialLoadDone.members || !isInitialLoadDone.alumni || (!isDirty.members && !isDirty.alumni)) return;
    const currentMembers = localMembers;
    const currentAlumni = localAlumni;
    const timer = setTimeout(async () => {
      if (isSaving) return;
      setIsSaving(true);
      try {
        if (isDirty.members) {
          const updated = await setMembers(currentMembers);
          if (updated && updated.length > 0) {
            setLocalMembers(updated);
          }
          setIsDirty(prev => {
            if (!prev.members) return prev;
            return { ...prev, members: false };
          });
        }
        if (isDirty.alumni) {
          const updated = await setAlumni(currentAlumni);
          if (updated && updated.length > 0) {
            setLocalAlumni(updated);
          }
          setIsDirty(prev => {
            if (!prev.alumni) return prev;
            return { ...prev, alumni: false };
          });
        }
      } catch (error: any) {
        console.error("Auto-save members/alumni failed:", error);
      } finally {
        setIsSaving(false);
      }
    }, 4500);
    return () => clearTimeout(timer);
  }, [localMembers, localAlumni, isInitialLoadDone.members, isInitialLoadDone.alumni, isDirty.members, isDirty.alumni, setMembers, setAlumni, isSaving]);

  // Debounced Auto-save for Site Settings
  useEffect(() => {
    if (!isInitialLoadDone.appearance || !localSiteSettings || !isDirty.settings) return;
    const timer = setTimeout(async () => {
      if (isSaving) return;
      setIsSaving(true);
      try {
        await setSiteSettings(localSiteSettings);
        setIsDirty(prev => {
          if (!prev.settings) return prev;
          return { ...prev, settings: false };
        });
      } catch (error: any) {
        console.error("Auto-save settings failed:", error);
      } finally {
        setIsSaving(false);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [localSiteSettings, isInitialLoadDone.appearance, isDirty.settings, setSiteSettings, isSaving]);

  // Debounced Auto-save for Publications
  useEffect(() => {
    if (!isInitialLoadDone.publications || !isDirty.publications) return;
    
    // Capture the current state at the time the timer starts
    const publicationsToSave = [...localPublications];
    
    const timer = setTimeout(async () => {
      if (isSaving) return;
      setIsSaving(true);
      try {
        const updated = await setPublications(publicationsToSave);
        
        // After successful save, check if user made more changes in the meantime
        setIsDirty(prev => {
          return { ...prev, publications: false };
        });

        // Update local IDs with the real ones from DB
        setLocalPublications(prev => {
          return prev.map(p => {
            if (p.id.startsWith('pub_new_')) {
              const match = updated.find(u => u.title === p.title && u.authors === p.authors && u.year === p.year);
              return match ? { ...p, id: match.id } : p;
            }
            return p;
          });
        });
      } catch (error) {
        console.error("Failed to auto-save publications:", error);
      } finally {
        setIsSaving(false);
      }
    }, 5000); 

    return () => clearTimeout(timer);
  }, [localPublications, isInitialLoadDone.publications, isDirty.publications, setPublications, isSaving]);

  const [newItem, setNewItem] = useState({ type: '', title: '', subtitle: '', editIndex: null as number | null });
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: '', type: 'current' as 'current' | 'alumni', index: null as number | null });
  
  const navigate = useNavigate();
  const professorFileInputRef = useRef<HTMLInputElement>(null);
  const memberFileInputRef = useRef<HTMLInputElement>(null);
  const alumniFileInputRef = useRef<HTMLInputElement>(null);
  const researchFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const settingsHomeHeroRef = useRef<HTMLInputElement>(null);
  const settingsHomeIntroRef = useRef<HTMLInputElement>(null);
  const settingsPhotosHeroRef = useRef<HTMLInputElement>(null);
  const settingsResearchHeroRef = useRef<HTMLInputElement>(null);

  const [targetMemberIndex, setTargetMemberIndex] = useState<number | null>(null);
  const [targetAlumniIndex, setTargetAlumniIndex] = useState<number | null>(null);
  const [targetResearchIndex, setTargetResearchIndex] = useState<number | null>(null);
  const [itemToDeleteIndex, setItemToDeleteIndex] = useState<number | null>(null);
  const [memberToDeleteIndex, setMemberToDeleteIndex] = useState<number | null>(null);
  const [alumniToDeleteIndex, setAlumniToDeleteIndex] = useState<number | null>(null);
  const [photoToDeleteId, setPhotoToDeleteId] = useState<string | null>(null);
  const [pubToDeleteId, setPubToDeleteId] = useState<string | null>(null);
  const [tempGalleryFiles, setTempGalleryFiles] = useState<{ url: string; file: File }[]>([]);

  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [showEditPhotoModal, setShowEditPhotoModal] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await setSiteSettings(localSiteSettings);
      setIsDirty(prev => ({ ...prev, settings: false }));
      alert('설정이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert('설정 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNewResearch = () => {
    const nextIdNum = localResearch.length > 0 
      ? Math.max(...localResearch.map(r => {
          const match = r.id.match(/\d+/);
          return match ? parseInt(match[0]) : 0;
        })) + 1 
      : 1;
    
    const newItem: ResearchItem = {
      id: `research-${nextIdNum}-${Date.now()}`,
      title: 'New Research Project Title',
      subtitle: 'Subtitle or Phase',
      shortDescription: 'Enter a short description of the research here.',
      fullDescription: [],
      imageUrl: '',
      detailImageUrl: '',
      publications: []
    };
    
    setLocalResearch(prev => {
      const updated = [newItem, ...prev];
      setIsDirty(d => ({ ...d, research: true }));
      return updated;
    });
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin');
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-gold"></div>
    </div>;
  }

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsSaving(true);
        const compressed = await compressImage(file, 800, 800, 0.7);
        setLocalProfessor(prev => {
          setIsDirty(d => ({ ...d, professor: true }));
          return { ...prev, img: compressed };
        });
      } catch (error) {
        console.error("Image upload failed:", error);
        setErrorModal({ 
          isOpen: true, 
          title: "Image Error",
          message: "An error occurred during image processing." 
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleMemberImageUpload = async (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsSaving(true);
        // Increase resolution to 1000px and quality to 0.85 for better clarity
        const compressed = await compressImage(file, 1000, 1000, 0.85);
        const updatedMembers = [...localMembers];
        updatedMembers[index] = { ...updatedMembers[index], img: compressed };
        setLocalMembers(updatedMembers);
        setIsDirty(prev => ({ ...prev, members: true }));
      } catch (error) {
        console.error("Member image upload failed:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleAlumniImageUpload = async (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsSaving(true);
        // Increase resolution to 1000px and quality to 0.85 for better clarity
        const compressed = await compressImage(file, 1000, 1000, 0.85);
        const updatedAlumni = [...localAlumni];
        updatedAlumni[index] = { ...updatedAlumni[index], img: compressed };
        setLocalAlumni(updatedAlumni);
        setIsDirty(prev => ({ ...prev, alumni: true }));
      } catch (error) {
        console.error("Alumni image upload failed:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleResearchImageUpload = async (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsSaving(true);
        const compressed = await compressImage(file, 1000, 1000, 0.7);
        const updatedResearch = [...localResearch];
        updatedResearch[index] = { ...updatedResearch[index], imageUrl: compressed };
        setLocalResearch(updatedResearch);
        setIsDirty(prev => ({ ...prev, research: true }));
      } catch (error) {
        console.error("Research image upload failed:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleGalleryUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (!filesList) return;
    const files = Array.from(filesList) as File[];
    if (files.length === 0) return;

    setIsCompressing(true);
    try {
      const newTemps: { url: string; file: File }[] = [];
      
      for (const file of files) {
        // Prevent adding the same file multiple times in the same session
        if (tempGalleryFiles.some(t => t.file.name === file.name && t.file.size === file.size)) {
           continue;
        }

        try {
          const compressed = await compressImage(file, 1200, 1200, 0.7);
          newTemps.push({
            url: compressed,
            file: file
          });
        } catch (err) {
          console.error("Failed to compress gallery image:", err);
        }
      }

      if (newTemps.length > 0) {
        setTempGalleryFiles(prev => [...prev, ...newTemps]);
      }
    } finally {
      setIsCompressing(false);
    }
    
    // Clear input so same file can be picked again
    e.target.value = '';
  };

  const handleSettingsImageUpload = async (e: ChangeEvent<HTMLInputElement>, key: keyof typeof localSiteSettings) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsSaving(true);
        const compressed = await compressImage(file, 1920, 1080, 0.7);
        setLocalSiteSettings(prev => {
          setIsDirty(d => ({ ...d, settings: true }));
          return { ...prev, [key]: compressed };
        });
      } catch (error) {
        console.error("Settings image upload failed:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const confirmGalleryUpload = async () => {
    if (tempGalleryFiles.length === 0) return;
    
    setIsSaving(true);
    try {
      console.log(`Starting upload of ${tempGalleryFiles.length} photos...`);
      const photosToAdd = tempGalleryFiles.map(temp => ({
        url: temp.url,
        createdAt: new Date().toISOString()
      }));
      
      await addGalleryPhotos(photosToAdd);
      
      setTempGalleryFiles([]);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowAddPhotoModal(false);
      }, 1500);
      console.log('Upload completed successfully');
    } catch (error: any) {
      console.error("Gallery upload failed:", error);
      let message = "An error occurred while uploading photos.";
      let title = "Error";
      
      try {
        const parsed = JSON.parse(error.message);
        if (parsed.error) {
          message = parsed.error;
          if (message.includes('quota') || message.includes('exhausted') || message.includes('limit exceeded')) {
            title = "Usage Limit";
            message = "Daily upload limit (Firestore Quota) exceeded. Please try again tomorrow.";
          } else if (message.includes('permission')) {
            title = "Permission Denied";
            message = "You don't have permission to upload photos.";
          }
        }
      } catch (e) {
        message = error.message || message;
      }
      setErrorModal({ isOpen: true, title, message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditPhoto = (photo: any) => {
    setEditingPhotoId(photo.id);
    setShowEditPhotoModal(true);
  };

  const movePublication = (index: number, direction: 'up' | 'down') => {
    const newPublications = [...localPublications];
    if (direction === 'up' && index > 0) {
      [newPublications[index], newPublications[index - 1]] = [newPublications[index - 1], newPublications[index]];
    } else if (direction === 'down' && index < newPublications.length - 1) {
      [newPublications[index], newPublications[index + 1]] = [newPublications[index + 1], newPublications[index]];
    } else {
      return;
    }
    setLocalPublications(newPublications);
    setIsDirty(prev => ({ ...prev, publications: true }));
  };

  const saveEditedPhoto = async () => {
    if (!editingPhotoId) return;
    setIsSaving(true);
    try {
      // Nothing to actually edit now that year/month are gone
      setShowEditPhotoModal(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMember = async (e: FormEvent) => {
    e.preventDefault();
    if (newMember.name && newMember.role) {
      if (newMember.index !== null) {
        if (newMember.type === 'current') {
          const updated = [...localMembers];
          updated[newMember.index] = { ...updated[newMember.index], name: newMember.name, role: newMember.role };
          setLocalMembers(updated);
          setIsDirty(prev => ({ ...prev, members: true }));
        } else {
          const updated = [...localAlumni];
          updated[newMember.index] = { ...updated[newMember.index], name: newMember.name, company: newMember.role };
          setLocalAlumni(updated);
          setIsDirty(prev => ({ ...prev, alumni: true }));
        }
      } else {
        if (newMember.type === 'current') {
          setLocalMembers([...localMembers, { name: newMember.name, role: newMember.role }]);
          setIsDirty(prev => ({ ...prev, members: true }));
        } else {
          setLocalAlumni([...localAlumni, { name: newMember.name, company: newMember.role }]);
          setIsDirty(prev => ({ ...prev, alumni: true }));
        }
      }
      setNewMember({ name: '', role: '', type: 'current', index: null });
      setShowAddMember(false);
    }
  };

  const handleAddItem = async (e: FormEvent) => {
    e.preventDefault();
    if (newItem.title) {
      if (newItem.type === 'degree') {
        const updated = [...localProfessor.degrees];
        if (newItem.editIndex !== null) {
          updated[newItem.editIndex] = newItem.title;
        } else {
          updated.push(newItem.title);
        }
        setLocalProfessor({ ...localProfessor, degrees: updated });
        setIsDirty(prev => ({ ...prev, professor: true }));
      }
      if (newItem.type === 'career') {
        const updated = [...localProfessor.career];
        if (newItem.editIndex !== null) {
          updated[newItem.editIndex] = newItem.title;
        } else {
          updated.push(newItem.title);
        }
        setLocalProfessor({ ...localProfessor, career: updated });
        setIsDirty(prev => ({ ...prev, professor: true }));
      }
      if (newItem.type === 'award') {
        const itemData = { title: newItem.title, subtitle: newItem.subtitle };
        const updated = [...localProfessor.awards];
        if (newItem.editIndex !== null) {
          updated[newItem.editIndex] = itemData;
        } else {
          updated.push(itemData);
        }
        setLocalProfessor({ ...localProfessor, awards: updated });
        setIsDirty(prev => ({ ...prev, professor: true }));
      }
      setNewItem({ type: '', title: '', subtitle: '', editIndex: null });
      setShowAddItemModal(false);
    }
  };

  if (false) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-white font-sans text-brand-ink">
      {/* ... (Sidebar remains same) ... */}
      <aside className="w-72 bg-[#dfdfdf] flex flex-col pt-12">
        <Link to="/" className="text-2xl font-serif px-12 mb-20 tracking-widest uppercase">CMML</Link>
        <nav className="flex-1">
          <button 
            onClick={() => setActiveTab('research')}
            className={`w-full text-left px-12 py-6 text-lg font-serif transition-colors ${activeTab === 'research' ? 'bg-white font-bold' : 'hover:bg-white/50'}`}
          >
            Research
          </button>
          <button 
            onClick={() => setActiveTab('members')}
            className={`w-full text-left px-12 py-6 text-lg font-serif transition-colors ${activeTab === 'members' ? 'bg-white font-bold' : 'hover:bg-white/50'}`}
          >
            Members
          </button>
          <button 
            onClick={() => setActiveTab('photos')}
            className={`w-full text-left px-12 py-6 text-lg font-serif transition-colors ${activeTab === 'photos' ? 'bg-white font-bold' : 'hover:bg-white/50'}`}
          >
            Photos
          </button>
          <button 
            onClick={() => setActiveTab('publications')}
            className={`w-full text-left px-12 py-6 text-lg font-serif transition-colors ${activeTab === 'publications' ? 'bg-white font-bold' : 'hover:bg-white/50'}`}
          >
            Publications
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-12 py-6 text-lg font-serif transition-colors ${activeTab === 'settings' ? 'bg-white font-bold' : 'hover:bg-white/50'}`}
          >
            Site Settings
          </button>
        </nav>
        <div className="mt-auto">
          <Link 
            to="/" 
            className="px-12 py-4 flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity"
          >
            <Home className="w-4 h-4" />
            <span className="text-xs font-bold tracking-widest uppercase">Home</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="px-12 py-8 flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-bold tracking-widest uppercase">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-16 overflow-y-auto">
        <header className="mb-16 relative">
          <h1 className="text-2xl font-bold tracking-tight mb-2 uppercase">
            ADMIN DASHBOARD | <span className="font-light">
              {activeTab === 'research' ? 'Research' : activeTab === 'members' ? 'Members' : activeTab === 'photos' ? 'Photos' : activeTab === 'publications' ? 'Publications' : 'Site Settings'}
            </span>
          </h1>
          <p className="text-[12px] text-brand-muted opacity-60">Control every element of the CMML site in real-time.</p>
          
          {isSaving && (
            <div className="absolute top-0 right-0 flex items-center gap-3 bg-brand-paper px-4 py-2 rounded-full border border-brand-ink/5 shadow-sm">
              <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-brand-gold"></div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-brand-gold">Saving...</span>
            </div>
          )}
        </header>

        {activeTab === 'research' ? (
          <div className="max-w-5xl space-y-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-serif font-bold tracking-tight">
                RESEARCH PROJECTS
                <span className="text-[12px] text-gray-400 font-sans ml-3 font-normal">(*Please upload image files under 500KB.)</span>
              </h2>
              <div 
                onClick={handleAddNewResearch}
                className="flex items-center gap-2 bg-brand-ink text-white px-4 py-2 rounded-full cursor-pointer hover:bg-brand-gold transition-colors group"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Add New Research</span>
                <PlusSquare className="w-4 h-4 group-active:scale-95 transition-transform" />
              </div>
            </div>
            <input 
              type="file" 
              ref={researchFileInputRef} 
              onChange={(e) => {
                if (targetResearchIndex !== null) {
                  handleResearchImageUpload(e, targetResearchIndex);
                }
              }} 
              className="hidden" 
              accept="image/*"
            />

            <div className="space-y-12">
               <AnimatePresence initial={false} mode="popLayout">
                 {localResearch.map((item, i) => (
                   <motion.div 
                     key={item.id} 
                     layout
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                     className="flex gap-12 group"
                   >
                     <div 
                       onClick={() => {
                         setTargetResearchIndex(i);
                         researchFileInputRef.current?.click();
                       }}
                       className="w-[448px] aspect-video bg-white flex items-center justify-center rounded-2xl cursor-pointer overflow-hidden relative border border-brand-ink/5 shrink-0"
                     >
                        {item.imageUrl ? (
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-contain" 
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const fallback = document.createElement('div');
                                fallback.className = "w-full h-full flex items-center justify-center";
                                fallback.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image text-gray-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        )}
                        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Plus className="w-10 h-10 text-white" />
                        </div>
                     </div>
                     <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 grid grid-cols-[150px_1fr] gap-y-4 gap-x-7 text-[13px] font-light">
                            <span className="text-brand-muted opacity-40 font-bold uppercase tracking-widest text-[13px]">Title</span>
                            <input 
                              type="text" 
                              value={item.title} 
                              onChange={e => {
                                const updated = [...localResearch];
                                updated[i] = { ...item, title: e.target.value };
                                setLocalResearch(updated);
                                setIsDirty(prev => ({ ...prev, research: true }));
                              }}
                              className="font-medium outline-none bg-transparent border-b border-brand-ink/5 focus:border-brand-gold text-[15px]"
                            />
                             <span className="text-brand-muted opacity-40 font-bold uppercase tracking-widest text-[13px]">Subtitle</span>
                            <input 
                              type="text" 
                              value={item.subtitle} 
                              onChange={e => {
                                 const updated = [...localResearch];
                                 updated[i] = { ...item, subtitle: e.target.value };
                                 setLocalResearch(updated);
                                 setIsDirty(prev => ({ ...prev, research: true }));
                              }}
                              className="font-medium outline-none bg-transparent border-b border-brand-ink/5 focus:border-brand-gold text-[15px]"
                            />
                            <span className="text-brand-muted opacity-40 font-bold uppercase tracking-widest text-[13px]">Short Description</span>
                            <textarea 
                              value={item.shortDescription} 
                              onChange={e => {
                                 const updated = [...localResearch];
                                 updated[i] = { ...item, shortDescription: e.target.value };
                                 setLocalResearch(updated);
                                 setIsDirty(prev => ({ ...prev, research: true }));
                              }}
                              className="font-medium outline-none bg-transparent border-b border-brand-ink/5 focus:border-brand-gold h-20 w-full resize-none text-[15px]"
                            />
                            <span className="text-brand-muted opacity-40 font-bold uppercase tracking-widest text-[13px]">Full Description</span>
                            <textarea 
                              value={item.fullDescription?.join('\n\n')} 
                              onChange={e => {
                                 const updated = [...localResearch];
                                 updated[i] = { ...item, fullDescription: e.target.value.split('\n\n').filter(p => p.trim() !== '') };
                                 setLocalResearch(updated);
                                 setIsDirty(prev => ({ ...prev, research: true }));
                              }}
                              className="font-medium outline-none bg-transparent border-b border-brand-ink/5 focus:border-brand-gold h-40 w-full resize-none text-[15px]"
                              placeholder="Enter full description (separate paragraphs with double line breaks)"
                            />
                            <span className="text-brand-muted opacity-40 font-bold uppercase tracking-widest text-[13px]">Research Highlights</span>
                            <textarea 
                              value={item.references?.join('\n')} 
                              onChange={e => {
                                 const updated = [...localResearch];
                                 updated[i] = { ...item, references: e.target.value.split('\n').filter(p => p.trim() !== '') };
                                 setLocalResearch(updated);
                                 setIsDirty(prev => ({ ...prev, research: true }));
                              }}
                              className="font-medium outline-none bg-transparent border-b border-brand-ink/5 focus:border-brand-gold h-24 w-full resize-none text-[15px]"
                              placeholder="Enter research highlights (separate with line breaks)"
                            />
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            {itemToDeleteIndex === i ? (
                               <div className="flex flex-col gap-2 bg-red-50 p-3 rounded-2xl border border-red-100 shadow-sm animate-in fade-in zoom-in duration-200">
                                 <p className="text-[10px] font-bold text-red-600 uppercase tracking-tighter">Are you sure you want to delete this?</p>
                                 <div className="flex gap-2">
                                   <button 
                                     onClick={() => {
                                       setLocalResearch(prev => prev.filter((_, idx) => idx !== i));
                                       setIsDirty(prev => ({ ...prev, research: true }));
                                       setItemToDeleteIndex(null);
                                     }}
                                     className="flex-1 bg-red-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-red-600 transition-colors"
                                   >
                                     Delete
                                   </button>
                                   <button 
                                     onClick={() => setItemToDeleteIndex(null)}
                                     className="flex-1 bg-white text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:text-gray-600 transition-colors"
                                   >
                                     Cancel
                                   </button>
                                 </div>
                               </div>
                             ) : (
                              <Trash2 
                                onClick={() => setItemToDeleteIndex(i)}
                                className="w-5 h-5 opacity-60 cursor-pointer hover:opacity-100 hover:text-red-500 transition-all shrink-0 mt-2" 
                                title="Delete Project"
                              />
                             )}
                          </div>
                        </div>
                     </div>
                   </motion.div>
                 ))}
               </AnimatePresence>
            </div>
          </div>
        ) : activeTab === 'members' ? (
          <div className="max-w-6xl space-y-24">
            {/* Professor */}
            <section>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-serif font-bold tracking-tight">
                  PROFESSOR PROFILE
                  <span className="text-[12px] text-gray-400 font-sans tracking-widest ml-4 font-normal uppercase opacity-60">Principal Investigator</span>
                </h2>
              </div>

              <div className="flex gap-12 bg-[#f9f9f9] p-10 rounded-3xl border border-brand-ink/5">
                <div 
                  onClick={() => professorFileInputRef.current?.click()}
                  className="w-[448px] aspect-[16/9] bg-white flex items-center justify-center rounded-2xl shrink-0 cursor-pointer overflow-hidden relative group border border-brand-ink/5"
                >
                  {localProfessor.img ? (
                    <img 
                      src={localProfessor.img} 
                      alt={localProfessor.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = "w-full h-full flex items-center justify-center";
                          fallback.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus text-gray-400"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <Plus className="w-10 h-10 text-gray-400" />
                  )}

                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Plus className="w-10 h-10 text-white" />
                  </div>

                  <input 
                    type="file" 
                    ref={professorFileInputRef} 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
                <div className="flex-1 space-y-10">
                   <div className="grid grid-cols-[100px_1fr] gap-x-12 gap-y-4 text-[13px] font-light">
                      <span className="opacity-40 font-bold uppercase tracking-widest text-[10px] pt-1">Name</span>
                      <input 
                        type="text" 
                        value={localProfessor.name} 
                        onChange={e => {
                          setLocalProfessor({ ...localProfessor, name: e.target.value });
                          setIsDirty(prev => ({ ...prev, professor: true }));
                        }}
                        className="font-medium text-[15px] border-b border-brand-ink/10 focus:border-brand-gold outline-none bg-transparent py-0.5"
                      />
                      <span className="opacity-40 font-bold uppercase tracking-widest text-[10px] pt-1">Affiliation</span>
                      <input 
                        type="text" 
                        value={localProfessor.affiliation} 
                        onChange={e => {
                          setLocalProfessor({ ...localProfessor, affiliation: e.target.value });
                          setIsDirty(prev => ({ ...prev, professor: true }));
                        }}
                        className="font-medium border-b border-brand-ink/10 focus:border-brand-gold outline-none bg-transparent py-0.5"
                      />
                      <span className="opacity-40 font-bold uppercase tracking-widest text-[10px] pt-1">Email</span>
                      <input 
                        type="email" 
                        value={localProfessor.email} 
                        onChange={e => {
                          setLocalProfessor({ ...localProfessor, email: e.target.value });
                          setIsDirty(prev => ({ ...prev, professor: true }));
                        }}
                        className="font-medium border-b border-brand-ink/10 focus:border-brand-gold outline-none bg-transparent py-0.5"
                      />
                    </div>

                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-4 border-b border-brand-ink/10 pb-2">
                          <h3 className="text-[12px] font-bold tracking-[0.2em] uppercase opacity-40">Academic Degrees</h3>
                        </div>
                        <ul className="space-y-2 mb-4">
                          <AnimatePresence initial={false}>
                            {localProfessor.degrees.map((d, i) => (
                              <motion.li 
                                key={`degree-${i}`}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="text-sm font-light flex justify-between group items-center"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-brand-ink">{d}</p>
                                </div>
                                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => { setNewItem({ type: 'degree', title: d, subtitle: '', editIndex: i }); setShowAddItemModal(true); }} 
                                    className="text-brand-ink/40 hover:text-brand-ink"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                  <button onClick={() => {
                                    setLocalProfessor(prev => ({ ...prev, degrees: prev.degrees.filter((_, idx) => idx !== i) }));
                                    setIsDirty(prev => ({ ...prev, professor: true }));
                                  }} className="text-red-400/60 hover:text-red-500">
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </motion.li>
                            ))}
                          </AnimatePresence>
                        </ul>
                        <button 
                           onClick={() => { setNewItem({ type: 'degree', title: '', subtitle: '', editIndex: null }); setShowAddItemModal(true); }}
                           className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-gold hover:text-brand-ink transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Degree</span>
                        </button>
                      </div>

                      {/* Academic Career */}
                      <div>
                        <div className="flex justify-between items-center mb-4 border-b border-brand-ink/10 pb-2">
                          <h3 className="text-[12px] font-bold tracking-[0.2em] uppercase opacity-40">Academic Career</h3>
                        </div>
                        <ul className="space-y-2 mb-4">
                          <AnimatePresence initial={false}>
                            {localProfessor.career.map((c, i) => (
                              <motion.li 
                                key={`career-${i}`}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="text-sm font-light flex justify-between group items-center"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-brand-ink">{c}</p>
                                </div>
                                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => { setNewItem({ type: 'career', title: c, subtitle: '', editIndex: i }); setShowAddItemModal(true); }} 
                                    className="text-brand-ink/40 hover:text-brand-ink"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                  <button onClick={() => {
                                    setLocalProfessor(prev => ({ ...prev, career: prev.career.filter((_, idx) => idx !== i) }));
                                    setIsDirty(prev => ({ ...prev, professor: true }));
                                  }} className="text-red-400/60 hover:text-red-500">
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </motion.li>
                            ))}
                          </AnimatePresence>
                        </ul>
                        <button 
                           onClick={() => { setNewItem({ type: 'career', title: '', subtitle: '', editIndex: null }); setShowAddItemModal(true); }}
                           className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-gold hover:text-brand-ink transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Career</span>
                        </button>
                      </div>

                      {/* Fellowships, Honors & Awards */}
                      <div>
                        <div className="flex justify-between items-center mb-4 border-b border-brand-ink/10 pb-2">
                          <h3 className="text-[12px] font-bold tracking-[0.2em] uppercase opacity-40">Fellowships, Honors & Awards</h3>
                        </div>
                        <ul className="space-y-4 mb-4">
                          <AnimatePresence initial={false}>
                            {localProfessor.awards.map((a, i) => (
                              <motion.li 
                                key={`award-${i}`}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="text-sm font-light flex justify-between group items-start"
                              >
                                <div className="space-y-0.5">
                                  <p className="font-medium text-brand-ink">{a.title}</p>
                                  <p className="text-[12px] opacity-40">{a.subtitle}</p>
                                </div>
                                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                                  <button 
                                    onClick={() => { setNewItem({ type: 'award', title: a.title, subtitle: a.subtitle, editIndex: i }); setShowAddItemModal(true); }} 
                                    className="text-brand-ink/40 hover:text-brand-ink"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                  <button onClick={() => {
                                    setLocalProfessor(prev => ({ ...prev, awards: prev.awards.filter((_, idx) => idx !== i) }));
                                    setIsDirty(prev => ({ ...prev, professor: true }));
                                  }} className="text-red-400/60 hover:text-red-500">
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </motion.li>
                            ))}
                          </AnimatePresence>
                        </ul>
                        <button 
                           onClick={() => { setNewItem({ type: 'award', title: '', subtitle: '', editIndex: null }); setShowAddItemModal(true); }}
                           className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-gold hover:text-brand-ink transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Award</span>
                        </button>
                      </div>
                    </div>
                </div>
              </div>
            </section>

            {/* Current Members */}
            <section>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-serif">
                  Current Members
                  <span className="text-[12px] text-gray-400 font-sans ml-3 font-normal">(*Please upload image files under 500KB.)</span>
                </h2>
                <div className="flex gap-4">
                  <div 
                    className="flex items-center gap-2 bg-brand-ink text-white px-4 py-2 rounded-full cursor-pointer hover:bg-brand-gold transition-colors group"
                    onClick={() => setShowAddMember(true)}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Add New Member</span>
                    <PlusSquare className="w-4 h-4 group-active:scale-95 transition-transform" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-8">
                <input 
                  type="file" 
                  ref={memberFileInputRef} 
                  onChange={(e) => {
                    if (targetMemberIndex !== null) {
                      handleMemberImageUpload(e, targetMemberIndex);
                    }
                  }} 
                  className="hidden" 
                  accept="image/*"
                />
                <AnimatePresence mode="popLayout" initial={false}>
                  {localMembers.map((m, i) => (
                    <motion.div 
                      key={m.id || `member-${m.name}-${i}`} 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      className="space-y-4 group relative"
                    >
                      <div 
                        onClick={() => {
                          setTargetMemberIndex(i);
                          memberFileInputRef.current?.click();
                        }}
                        className="aspect-square bg-white rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden relative border border-brand-ink/5"
                      >
                         {m.img ? (
                           <img 
                            src={m.img} 
                            alt={m.name} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer" 
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const fallback = document.createElement('div');
                                fallback.className = "w-full h-full flex items-center justify-center";
                                fallback.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image text-gray-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                         ) : (
                           <ImageIcon className="w-8 h-8 text-gray-400" />
                         )}
                         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <Plus className="w-8 h-8 text-white" />
                         </div>
                      </div>
                      <div className="grid grid-cols-2 text-[12px] gap-y-2 relative">
                         <span className="opacity-40">Name</span>
                         <span className="text-right font-medium">{m.name}</span>
                         <span className="opacity-40">Role</span>
                         <span className="text-right font-medium">{m.role}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-auto">
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setNewMember({ name: m.name, role: m.role, type: 'current', index: i });
                            setShowAddMember(true);
                          }}
                          className="bg-brand-ink text-white p-2.5 rounded-full hover:bg-brand-gold transition-colors shadow-lg"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Are you sure you want to delete ${m.name}?`)) {
                              setLocalMembers(prev => prev.filter((_, idx) => idx !== i));
                              setIsDirty(prev => ({ ...prev, members: true }));
                            }
                          }}
                          className="bg-red-500 text-white p-2.5 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>

             {/* Alumni */}
             <section>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-serif">
                  Alumni Management
                  <span className="text-[12px] text-gray-400 font-sans ml-3 font-normal">(*Please upload image files under 500KB.)</span>
                </h2>
                <div className="flex gap-4">
                  <div 
                    className="flex items-center gap-2 bg-brand-ink text-white px-4 py-2 rounded-full cursor-pointer hover:bg-brand-gold transition-colors group"
                    onClick={() => { setNewMember({ ...newMember, type: 'alumni' }); setShowAddMember(true); }}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Add New Alumni</span>
                    <PlusSquare className="w-4 h-4 group-active:scale-95 transition-transform" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-8">
                <input 
                  type="file" 
                  ref={alumniFileInputRef} 
                  onChange={(e) => {
                    if (targetAlumniIndex !== null) {
                      handleAlumniImageUpload(e, targetAlumniIndex);
                    }
                  }} 
                  className="hidden" 
                  accept="image/*"
                />
                <AnimatePresence mode="popLayout" initial={false}>
                  {localAlumni.map((m, i) => (
                    <motion.div 
                      key={m.id || `alumni-${m.name}-${i}`} 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      className="space-y-4 group relative"
                    >
                      <div 
                        onClick={() => {
                          setTargetAlumniIndex(i);
                          alumniFileInputRef.current?.click();
                        }}
                        className="aspect-square bg-white rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden relative border border-brand-ink/5"
                      >
                         {m.img ? (
                           <img 
                            src={m.img} 
                            alt={m.name} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer" 
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const fallback = document.createElement('div');
                                fallback.className = "w-full h-full flex items-center justify-center";
                                fallback.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image text-gray-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                         ) : (
                           <ImageIcon className="w-8 h-8 text-gray-400" />
                         )}
                         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <Plus className="w-8 h-8 text-white" />
                         </div>
                      </div>
                      <div className="text-right space-y-1 relative">
                         <p className="text-[13px] font-medium">{m.name}</p>
                         <p className="text-[12px] opacity-40">{m.company}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-auto">
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setNewMember({ name: m.name, role: m.company || '', type: 'alumni', index: i });
                            setShowAddMember(true);
                          }}
                          className="bg-brand-ink text-white p-2.5 rounded-full hover:bg-brand-gold transition-colors shadow-lg"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Are you sure you want to delete alumni ${m.name}?`)) {
                              setLocalAlumni(prev => prev.filter((_, idx) => idx !== i));
                              setIsDirty(prev => ({ ...prev, alumni: true }));
                            }
                          }}
                          className="bg-red-500 text-white p-2.5 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          </div>
        ) : activeTab === 'photos' ? (
          <div className="max-w-6xl">
            <header className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-xl font-serif font-bold tracking-tight mb-2">PHOTOS GALLERY</h2>
                <p className="text-[12px] text-brand-muted opacity-60">Manage lab activities and photo albums.</p>
              </div>
              
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setShowAddPhotoModal(true)}
                  className="bg-brand-ink text-white px-8 py-3 rounded-full flex items-center justify-center gap-3 hover:bg-brand-gold transition-colors shadow-lg shadow-brand-ink/10 group"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Add Photos</span>
                  <Plus className="w-5 h-5 group-active:scale-90 transition-transform" />
                </button>
              </div>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <AnimatePresence mode="popLayout" initial={false}>
                {gallery.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-32 border-2 border-dashed border-brand-ink/5 rounded-[40px] flex flex-col items-center justify-center text-brand-muted opacity-30"
                  >
                    <ImageIcon className="w-12 h-12 mb-4" />
                    <p className="font-serif italic font-medium">No photos uploaded yet.</p>
                  </motion.div>
                ) : (
                  gallery.map((photo, i) => (
                    <motion.div 
                      key={photo.id || i}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                      className="group relative aspect-square bg-[#f9f9f9] rounded-3xl overflow-hidden border border-brand-ink/5 shadow-sm hover:shadow-xl transition-all duration-500"
                    >
                      <img 
                        src={photo.url} 
                        alt={`Lab photo ${photo.year}-${photo.month}`} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="absolute bottom-4 left-4 right-4 flex justify-end gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button 
                          onClick={() => handleEditPhoto(photo)}
                          className="w-8 h-8 bg-white text-brand-ink rounded-xl flex items-center justify-center hover:bg-brand-gold hover:text-white transition-colors shadow-lg"
                          title="Edit Info"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (photo.id) setPhotoToDeleteId(photo.id);
                          }}
                          className="w-8 h-8 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : activeTab === 'publications' ? (
          <div className="max-w-6xl space-y-12">
            <header className="flex justify-between items-end mb-12">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-xl font-serif font-bold tracking-tight uppercase">PUBLICATIONS</h2>
                </div>
                <p className="text-[12px] text-brand-muted opacity-60 uppercase tracking-widest font-bold font-sans">Manage lab research output and published papers.</p>
              </div>
              
              <button 
                onClick={() => {
                  const maxNumericId = Math.max(...localPublications.map(p => p.numericId || 0), 0);
                  const newPub = {
                    id: `pub_new_${Date.now()}`,
                    title: '',
                    authors: '',
                    journal: '',
                    year: new Date().getFullYear(),
                    details: '',
                    tags: [],
                    numericId: maxNumericId + 1
                  };
                  setLocalPublications(prev => [newPub, ...prev]);
                  setIsDirty(prev => ({ ...prev, publications: true }));
                }}
                className="bg-brand-ink text-white px-8 py-3 rounded-full flex items-center justify-center gap-3 hover:bg-brand-gold transition-colors shadow-lg shadow-brand-ink/10 group"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Add Publication</span>
                <Plus className="w-5 h-5 group-active:scale-90 transition-transform" />
              </button>
            </header>

            <div className="space-y-6">
              <AnimatePresence initial={false} mode="popLayout">
                {localPublications.map((pub, index) => (
                  <motion.div 
                    key={pub.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    className="bg-brand-paper p-8 rounded-3xl border border-brand-ink/5 hover:border-brand-gold/30 transition-all group relative"
                  >
                    <div className="grid grid-cols-[1fr_auto] gap-8">
                      <div className="space-y-4">
                        <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">Title</span>
                            <input 
                              type="text" 
                              value={pub.title}
                              placeholder="Enter paper title..."
                              onChange={e => {
                                const updated = [...localPublications];
                                updated[index] = { ...pub, title: e.target.value };
                                setLocalPublications(updated);
                                setIsDirty(prev => ({ ...prev, publications: true }));
                              }}
                              className="font-serif text-lg bg-transparent border-b border-brand-ink/5 focus:border-brand-gold outline-none py-1 w-full"
                            />
                          </div>
                          <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">Authors</span>
                            <input 
                              type="text" 
                              value={pub.authors}
                              placeholder="Enter authors (e.g., Gildong Hong, Chulsoo Kim...)"
                              onChange={e => {
                                const updated = [...localPublications];
                                updated[index] = { ...pub, authors: e.target.value };
                                setLocalPublications(updated);
                                setIsDirty(prev => ({ ...prev, publications: true }));
                              }}
                              className="text-sm italic font-medium bg-transparent border-b border-brand-ink/5 focus:border-brand-gold outline-none py-1 w-full"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-8">
                            <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                              <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">Journal</span>
                              <input 
                                type="text" 
                                value={pub.journal}
                                placeholder="Journal Title"
                                onChange={e => {
                                  const updated = [...localPublications];
                                  updated[index] = { ...pub, journal: e.target.value };
                                  setLocalPublications(updated);
                                  setIsDirty(prev => ({ ...prev, publications: true }));
                                }}
                                className="text-sm bg-transparent border-b border-brand-ink/5 focus:border-brand-gold outline-none py-1 w-full"
                              />
                            </div>
                          <div className="grid grid-cols-[60px_1fr] gap-4 items-center">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">Year</span>
                            <input 
                              type="number" 
                              value={pub.year}
                              onChange={e => {
                                const updated = [...localPublications];
                                updated[index] = { ...pub, year: parseInt(e.target.value) || new Date().getFullYear() };
                                setLocalPublications(updated);
                                setIsDirty(prev => ({ ...prev, publications: true }));
                              }}
                              className="text-sm bg-transparent border-b border-brand-ink/5 focus:border-brand-gold outline-none py-1 w-full"
                            />
                          </div>
                          <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">Details</span>
                            <input 
                              type="text" 
                              value={pub.details}
                              onChange={e => {
                                const updated = [...localPublications];
                                updated[index] = { ...pub, details: e.target.value };
                                setLocalPublications(updated);
                                setIsDirty(prev => ({ ...prev, publications: true }));
                              }}
                              className="text-sm bg-transparent border-b border-brand-ink/5 focus:border-brand-gold outline-none py-1 w-full"
                              placeholder="e.g., 47, e70308"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">Tags</span>
                          <div className="flex flex-wrap gap-2">
                            {pub.tags?.map((tag, tagIndex) => (
                              <div key={tagIndex} className="bg-brand-ink/5 px-2 py-1 rounded flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest">{tag}</span>
                                <X 
                                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                                  onClick={() => {
                                    const updatedTags = pub.tags?.filter((_, ti) => ti !== tagIndex);
                                    const updated = [...localPublications];
                                    updated[index] = { ...pub, tags: updatedTags };
                                    setLocalPublications(updated);
                                    setIsDirty(prev => ({ ...prev, publications: true }));
                                  }}
                                />
                              </div>
                            ))}

                            {editingTagIndex === index ? (
                              <input
                                autoFocus
                                type="text"
                                value={newTagValue}
                                placeholder="New tag..."
                                onChange={(e) => setNewTagValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (newTagValue.trim()) {
                                      const updatedTags = [...(pub.tags || []), newTagValue.trim()];
                                      const updated = [...localPublications];
                                      updated[index] = { ...pub, tags: updatedTags };
                                      setLocalPublications(updated);
                                      setIsDirty(prev => ({ ...prev, publications: true }));
                                      setNewTagValue("");
                                      setEditingTagIndex(null);
                                    } else {
                                      setEditingTagIndex(null);
                                    }
                                  } else if (e.key === 'Escape') {
                                    setEditingTagIndex(null);
                                    setNewTagValue("");
                                  }
                                }}
                                onBlur={() => {
                                  // Optional: Save on blur or just cancel
                                  if (!newTagValue.trim()) {
                                    setEditingTagIndex(null);
                                  }
                                }}
                                className="text-[10px] font-bold uppercase tracking-widest bg-brand-ink/5 border-b border-brand-gold outline-none px-2 py-1 rounded"
                              />
                            ) : (
                              <button 
                                onClick={() => {
                                  setEditingTagIndex(index);
                                  setNewTagValue("");
                                }}
                                className="text-[10px] font-bold uppercase tracking-widest text-brand-gold hover:underline"
                              >
                                + Add Tag
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <div className="flex flex-col gap-1 mb-2">
                          <button 
                            onClick={() => movePublication(index, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:bg-brand-gold/10 rounded text-brand-muted disabled:opacity-20 transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => movePublication(index, 'down')}
                            disabled={index === localPublications.length - 1}
                            className="p-1 hover:bg-brand-gold/10 rounded text-brand-muted disabled:opacity-20 transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this publication?')) {
                              setLocalPublications(prev => prev.filter(p => p.id !== pub.id));
                              setIsDirty(prev => ({ ...prev, publications: true }));
                            }
                          }}
                          className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl transition-all cursor-pointer group"
                          title="Delete Publication"
                        >
                          <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl space-y-12">
            <header className="mb-12">
              <h2 className="text-xl font-serif font-bold tracking-tight mb-2">SITE SETTINGS</h2>
              <p className="text-[12px] text-brand-muted opacity-60 uppercase tracking-widest font-bold">Manage main background images for the homepage and each menu.</p>
            </header>

              <div className="grid grid-cols-1 gap-12">
                <div className="bg-brand-paper p-8 rounded-3xl border border-brand-gold/20 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold tracking-widest uppercase text-brand-gold mb-2">Data Recovery</h3>
                    <p className="text-[12px] opacity-60">If site data is corrupted or accidentally deleted (e.g. member photos missing), you can restore the laboratory's default starting data here.</p>
                  </div>
                  <button 
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to restore all initial data? This will overwrite members, research, and professor profiles with defaults.')) {
                        setIsSaving(true);
                        try {
                          await setProfessor(defaultProfessor);
                          const restoredMembers = await setMembers(defaultMembers);
                          const restoredAlumni = await setAlumni(defaultAlumni);
                          
                          setLocalProfessor(defaultProfessor);
                          setLocalMembers(restoredMembers);
                          setLocalAlumni(restoredAlumni);
                          
                          alert('Data restored successfully.');
                        } catch (err) {
                          console.error("Restoration failed", err);
                          alert('Restoration failed. Please try again.');
                        } finally {
                          setIsSaving(false);
                        }
                      }
                    }}
                    className="bg-brand-gold text-white px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-brand-ink transition-colors"
                  >
                    Restore Initial Data
                  </button>
                </div>

                {/* Home Hero Image */}
                <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-widest uppercase opacity-40">Home Hero Background</h3>
                <div 
                  onClick={() => settingsHomeHeroRef.current?.click()}
                  className="aspect-[21/9] bg-[#f9f9f9] rounded-3xl overflow-hidden border border-brand-ink/5 cursor-pointer relative group flex items-center justify-center"
                >
                  <img src={localSiteSettings.homeHeroImg} alt="Home Hero" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Plus className="w-12 h-12 text-white" />
                  </div>
                  <input 
                    type="file" 
                    ref={settingsHomeHeroRef} 
                    onChange={(e) => handleSettingsImageUpload(e, 'homeHeroImg')} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
              </div>

              {/* Home Intro Image */}
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold tracking-widest uppercase opacity-40">Home Intro Image</h3>
                  <div 
                    onClick={() => settingsHomeIntroRef.current?.click()}
                    className="aspect-square bg-[#f9f9f9] rounded-3xl overflow-hidden border border-brand-ink/5 cursor-pointer relative group flex items-center justify-center p-4"
                  >
                    <img 
                      src={localSiteSettings.homeIntroImg} 
                      alt="Home Intro" 
                      className="w-full h-full object-contain" 
                      style={{ imageRendering: 'auto' }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Plus className="w-12 h-12 text-white" />
                    </div>
                    <input 
                      type="file" 
                      ref={settingsHomeIntroRef} 
                      onChange={(e) => handleSettingsImageUpload(e, 'homeIntroImg')} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold tracking-widest uppercase opacity-40">Photos Hero Background</h3>
                  <div 
                    onClick={() => settingsPhotosHeroRef.current?.click()}
                    className="aspect-video bg-[#f9f9f9] rounded-3xl overflow-hidden border border-brand-ink/5 cursor-pointer relative group flex items-center justify-center"
                  >
                    <img src={localSiteSettings.photosHeroImg} alt="Photos Hero" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Plus className="w-12 h-12 text-white" />
                    </div>
                    <input 
                      type="file" 
                      ref={settingsPhotosHeroRef} 
                      onChange={(e) => handleSettingsImageUpload(e, 'photosHeroImg')} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold tracking-widest uppercase opacity-40">Research Hero Background</h3>
                  <div 
                    onClick={() => settingsResearchHeroRef.current?.click()}
                    className="aspect-video bg-[#f9f9f9] rounded-3xl overflow-hidden border border-brand-ink/5 cursor-pointer relative group flex items-center justify-center"
                  >
                    <img src={localSiteSettings.researchHeroImg} alt="Research Hero" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Plus className="w-12 h-12 text-white" />
                    </div>
                    <input 
                      type="file" 
                      ref={settingsResearchHeroRef} 
                      onChange={(e) => handleSettingsImageUpload(e, 'researchHeroImg')} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-brand-paper p-8 rounded-3xl border border-brand-ink/5">
               <p className="text-[11px] text-brand-muted leading-relaxed italic">
                 * Changes to background images are reflected in real-time. High-resolution images are recommended, under 500KB.
               </p>
            </div>

            <div className="flex justify-end pt-12">
               <button 
                 onClick={handleSaveSettings}
                 className="bg-brand-ink text-white px-12 py-4 rounded-full font-bold tracking-widest uppercase text-xs hover:bg-brand-gold transition-colors shadow-2xl shadow-brand-ink/20"
               >
                 Save Settings
               </button>
            </div>
          </div>
        )}
      </main>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white w-full max-w-md rounded-3xl p-10 relative shadow-2xl">
            <button 
              onClick={() => {
                setShowAddMember(false);
                setNewMember({ name: '', role: '', type: 'current', index: null });
              }}
              className="absolute top-8 right-8 opacity-40 hover:opacity-100 transition-opacity"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-serif mb-10 tracking-tight">{newMember.index !== null ? 'Edit Information' : 'Add New Member'}</h2>
            
            <form onSubmit={handleAddMember} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Member Type</label>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    disabled={newMember.index !== null}
                    onClick={() => setNewMember({ ...newMember, type: 'current' })}
                    className={`flex-1 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${newMember.type === 'current' ? 'bg-brand-ink text-white border-brand-ink' : 'border-brand-ink/20 text-brand-ink/40'} ${newMember.index !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Current Lab Member
                  </button>
                  <button 
                    type="button"
                    disabled={newMember.index !== null}
                    onClick={() => setNewMember({ ...newMember, type: 'alumni' })}
                    className={`flex-1 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${newMember.type === 'alumni' ? 'bg-brand-ink text-white border-brand-ink' : 'border-brand-ink/20 text-brand-ink/40'} ${newMember.index !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Alumni
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Name</label>
                <input 
                  type="text"
                  required
                  value={newMember.name}
                  onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full border-b border-brand-ink/20 py-2 focus:border-brand-gold outline-none transition-colors"
                  placeholder="Enter name (e.g., Gildong Hong)"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                  {newMember.type === 'current' ? 'Role / Program' : 'Affiliation / Company'}
                </label>
                <input 
                  type="text"
                  required
                  value={newMember.role}
                  onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full border-b border-brand-ink/20 py-2 focus:border-brand-gold outline-none transition-colors"
                  placeholder={newMember.type === 'current' ? "e.g., Integrated MS-PhD / Postdoc" : "e.g., Samsung Electronics / Assistant Professor"}
                />
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  className="w-full bg-brand-ink text-white py-4 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-brand-gold transition-colors shadow-lg shadow-brand-ink/10"
                >
                  {newMember.index !== null ? 'Save Changes' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal (Degrees, Career, Awards) */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white w-full max-w-md rounded-3xl p-10 relative shadow-2xl">
            <button 
              onClick={() => setShowAddItemModal(false)}
              className="absolute top-8 right-8 opacity-40 hover:opacity-100 transition-opacity"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-serif mb-10 tracking-tight capitalize">
              {newItem.editIndex !== null ? 'Edit Information' : 'Add New Entry'}
            </h2>
            
            <form onSubmit={handleAddItem} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                  {newItem.type === 'award' ? 'Award Title / Project' : 'Details'}
                </label>
                <input 
                  type="text"
                  required
                  value={newItem.title}
                  onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full border-b border-brand-ink/10 py-2 focus:border-brand-gold outline-none transition-colors text-sm font-light"
                  placeholder={newItem.type === 'award' ? "Enter award title..." : "Enter degree or career details..."}
                />
              </div>

              {newItem.type === 'award' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                    Subtitle / Year (Optional)
                  </label>
                  <input 
                    type="text"
                    value={newItem.subtitle}
                    onChange={e => setNewItem({ ...newItem, subtitle: e.target.value })}
                    className="w-full border-b border-brand-ink/10 py-2 focus:border-brand-gold outline-none transition-colors text-sm font-light"
                    placeholder="e.g., 2024 Science & Tech Fund"
                  />
                </div>
              )}

              <div className="pt-6">
                <button 
                  type="submit"
                  className="w-full bg-brand-ink text-white py-4 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-brand-gold transition-colors shadow-lg shadow-brand-ink/10"
                >
                  {newItem.editIndex !== null ? 'Apply Changes' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white w-full max-w-2xl rounded-[40px] p-12 relative shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <button 
              onClick={() => {
                setShowAddPhotoModal(false);
                setTempGalleryFiles([]);
              }}
              className="absolute top-10 right-10 opacity-40 hover:opacity-100 transition-opacity z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="mb-10">
              <h2 className="text-2xl font-serif font-bold tracking-tight mb-2">Gallery Photo Upload</h2>
              <p className="text-[12px] text-brand-muted opacity-60 uppercase tracking-widest font-bold">Please select photos of research activities and lab life.</p>
            </div>


            <div className="flex-1 overflow-y-auto min-h-[200px] mb-10">
              {tempGalleryFiles.length === 0 ? (
                <div 
                  onClick={() => galleryFileInputRef.current?.click()}
                  className="w-full h-full border-2 border-dashed border-brand-ink/10 rounded-[32px] flex flex-col items-center justify-center cursor-pointer hover:bg-brand-paper transition-colors group"
                >
                  <div className="w-16 h-16 bg-brand-paper rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Plus className="w-8 h-8 text-brand-gold" />
                  </div>
                  <p className="font-serif italic text-brand-muted mb-2 font-medium">Click to select photo files</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">Maximum 500KB per file</p>
                  <input 
                    type="file" 
                    ref={galleryFileInputRef} 
                    onChange={handleGalleryUpload} 
                    className="hidden" 
                    accept="image/*"
                    multiple
                  />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {tempGalleryFiles.map((temp, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border border-brand-ink/5">
                      <img src={temp.url} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setTempGalleryFiles(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setTempGalleryFiles([])}
                    className="aspect-square border border-red-100 bg-red-50/30 rounded-2xl flex flex-col items-center justify-center hover:bg-red-50 transition-colors group"
                    title="Clear All"
                  >
                    <Trash2 className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[8px] font-bold text-red-400 uppercase mt-1">Clear</span>
                  </button>
                  <button 
                    onClick={() => galleryFileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-brand-ink/10 rounded-2xl flex flex-col items-center justify-center hover:bg-brand-paper transition-colors group"
                  >
                    <Plus className="w-6 h-6 text-brand-gold group-hover:scale-125 transition-transform" />
                  </button>
                  <input 
                    type="file" 
                    ref={galleryFileInputRef} 
                    onChange={handleGalleryUpload} 
                    className="hidden" 
                    accept="image/*"
                    multiple
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => {
                  setShowAddPhotoModal(false);
                  setTempGalleryFiles([]);
                }}
                className="flex-1 py-5 rounded-2xl font-bold tracking-[0.2em] uppercase text-[11px] border border-brand-ink/10 hover:bg-brand-paper transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmGalleryUpload}
                disabled={tempGalleryFiles.length === 0 || isSaving || isCompressing}
                className={`flex-[2] py-5 rounded-2xl font-bold tracking-[0.2em] uppercase text-[11px] transition-all shadow-xl ${
                  showSuccess 
                    ? 'bg-green-500 text-white shadow-green-200' 
                    : 'bg-brand-ink text-white hover:bg-brand-gold shadow-brand-ink/10'
                } disabled:opacity-20`}
              >
                {showSuccess 
                  ? 'Success!' 
                  : isSaving 
                    ? 'Uploading...' 
                    : isCompressing 
                      ? 'Processing photos...' 
                      : `Confirm Upload ${tempGalleryFiles.length > 0 ? `(${tempGalleryFiles.length} photos)` : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Photo Modal */}
      {showEditPhotoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-12 relative shadow-2xl overflow-hidden flex flex-col">
            <button 
              onClick={() => setShowEditPhotoModal(false)}
              className="absolute top-10 right-10 opacity-40 hover:opacity-100 transition-opacity z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="mb-10">
              <h2 className="text-2xl font-serif font-bold tracking-tight mb-2">Photo Information Details</h2>
              <p className="text-[12px] text-brand-muted opacity-60 uppercase tracking-widest font-bold font-sans">View image information.</p>
            </div>
            
            <p className="text-center py-10 opacity-40 font-medium">No editable metadata available currently.</p>


            <button 
              onClick={saveEditedPhoto}
              className="w-full bg-brand-ink text-white py-5 rounded-2xl font-bold tracking-[0.2em] uppercase text-[11px] hover:bg-brand-gold transition-all shadow-xl shadow-brand-ink/10"
            >
              Close & Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Photo Delete Confirmation Modal */}
      {photoToDeleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-10 shadow-2xl border border-brand-ink/5 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-serif font-bold mb-4 tracking-tight">Delete Photo</h3>
            <p className="text-brand-muted font-light leading-relaxed mb-10 whitespace-pre-wrap text-sm">
              Are you sure you want to delete this photo?
            </p>
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setPhotoToDeleteId(null)}
                className="flex-1 py-4 border border-brand-ink/10 rounded-2xl font-bold tracking-[0.2em] uppercase text-[11px] hover:bg-brand-paper transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  if (photoToDeleteId) {
                    setIsSaving(true);
                    try {
                      await deleteGalleryPhoto(photoToDeleteId);
                      setPhotoToDeleteId(null);
                    } catch (error) {
                      console.error("Delete failed", error);
                    } finally {
                      setIsSaving(false);
                    }
                  }
                }}
                className="flex-[1.5] bg-red-500 text-white py-4 rounded-2xl font-bold tracking-[0.2em] uppercase text-[11px] hover:bg-red-600 transition-all shadow-xl shadow-red-500/10 active:scale-[0.98]"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-10 shadow-2xl border border-brand-ink/5 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-serif font-bold mb-4 tracking-tight">{errorModal.title || "Notification"}</h3>
            <p className="text-brand-muted font-light leading-relaxed mb-10 whitespace-pre-wrap text-sm">
              {errorModal.message}
            </p>
            <button 
              onClick={() => setErrorModal({ isOpen: false, title: '', message: '' })}
              className="w-full bg-brand-ink text-white py-4 rounded-2xl font-bold tracking-[0.2em] uppercase text-[11px] hover:bg-brand-gold transition-all shadow-xl shadow-brand-ink/10 active:scale-[0.98]"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
