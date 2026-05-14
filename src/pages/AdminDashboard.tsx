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
  Plus
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { logout } from '../lib/firebase';
import { ResearchItem } from '../data/researchData';

export default function AdminDashboard() {
  const { members, professor, alumni, research, gallery, setMembers, setProfessor, setAlumni, setResearch, addGalleryPhoto, updateGalleryPhoto, deleteGalleryPhoto, user, loading } = useData();
  const [activeTab, setActiveTab] = useState<'research' | 'members' | 'photos'>('research');
  const [isSaving, setIsSaving] = useState(false);
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });
  
  // Local states for editing
  const [localProfessor, setLocalProfessor] = useState(professor);
  const [localResearch, setLocalResearch] = useState<ResearchItem[]>(research);
  const [localMembers, setLocalMembers] = useState(members);
  const [localAlumni, setLocalAlumni] = useState(alumni);
  const [localGallery, setLocalGallery] = useState(gallery);

  // Sync local state when external data loads or changes (initially)
  useEffect(() => {
    if (professor) setLocalProfessor(professor);
  }, [professor]);

  useEffect(() => {
    if (research.length > 0) setLocalResearch(research);
  }, [research]);

  useEffect(() => {
    if (members.length > 0) setLocalMembers(members);
  }, [members]);

  useEffect(() => {
    if (alumni.length > 0) setLocalAlumni(alumni);
  }, [alumni]);

  useEffect(() => {
    if (gallery.length > 0) setLocalGallery(gallery);
  }, [gallery]);

  // Debounced Auto-save for Research
  useEffect(() => {
    // We allow saving empty arrays now to support deleting all items
    const timer = setTimeout(async () => {
      if (JSON.stringify(localResearch) !== JSON.stringify(research)) {
        setIsSaving(true);
        try {
          await setResearch(localResearch);
        } finally {
          setIsSaving(false);
        }
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [localResearch, research, setResearch]);

  // Debounced Auto-save for Professor
  useEffect(() => {
    if (!localProfessor || !professor) return;
    const timer = setTimeout(async () => {
      if (JSON.stringify(localProfessor) !== JSON.stringify(professor)) {
        setIsSaving(true);
        try {
          await setProfessor(localProfessor);
        } finally {
          setIsSaving(false);
        }
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [localProfessor, professor, setProfessor]);

  // Debounced Auto-save for Members/Alumni
  useEffect(() => {
    if (localMembers.length === 0 && localAlumni.length === 0) return;
    const timer = setTimeout(async () => {
      const membersChanged = JSON.stringify(localMembers) !== JSON.stringify(members);
      const alumniChanged = JSON.stringify(localAlumni) !== JSON.stringify(alumni);
      
      if (membersChanged || alumniChanged) {
        setIsSaving(true);
        try {
          if (membersChanged) await setMembers(localMembers);
          if (alumniChanged) await setAlumni(localAlumni);
        } finally {
          setIsSaving(false);
        }
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [localMembers, localAlumni, members, alumni, setMembers, setAlumni]);

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

  const [targetMemberIndex, setTargetMemberIndex] = useState<number | null>(null);
  const [targetAlumniIndex, setTargetAlumniIndex] = useState<number | null>(null);
  const [targetResearchIndex, setTargetResearchIndex] = useState<number | null>(null);
  const [itemToDeleteIndex, setItemToDeleteIndex] = useState<number | null>(null);
  const [photoToDeleteId, setPhotoToDeleteId] = useState<string | null>(null);

  const [newPhotoYear, setNewPhotoYear] = useState(new Date().getFullYear());
  const [newPhotoMonth, setNewPhotoMonth] = useState(new Date().getMonth() + 1);
  const [tempGalleryFiles, setTempGalleryFiles] = useState<{ url: string; file: File }[]>([]);

  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editPhotoYear, setEditPhotoYear] = useState(new Date().getFullYear());
  const [editPhotoMonth, setEditPhotoMonth] = useState(new Date().getMonth() + 1);
  const [showEditPhotoModal, setShowEditPhotoModal] = useState(false);

  const handleAddNewResearch = () => {
    const nextIdNum = localResearch.length > 0 
      ? Math.max(...localResearch.map(r => {
          const match = r.id.match(/\d+/);
          return match ? parseInt(match[0]) : 0;
        })) + 1 
      : 1;
    
    const newItem: ResearchItem = {
      id: `research-${nextIdNum}-${Date.now()}`,
      title: '새로운 연구 프로젝트 제목',
      subtitle: '서브타이틀 또는 진행 단계',
      shortDescription: '이곳에 연구에 대한 간략한 설명을 입력하세요.',
      fullDescription: [],
      imageUrl: '',
      detailImageUrl: '',
      publications: []
    };
    
    setLocalResearch([newItem, ...localResearch]);
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

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        setErrorModal({ 
          isOpen: true, 
          message: "500KB 이상의 파일은 불러올 수 없습니다.\n확인 버튼을 누르면 원래 화면으로 돌아갑니다." 
        });
        return;
      }
      setIsSaving(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalProfessor(prev => ({ ...prev, img: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMemberImageUpload = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        setErrorModal({ 
          isOpen: true, 
          message: "500KB 이상의 파일은 불러올 수 없습니다.\n확인 버튼을 누르면 원래 화면으로 돌아갑니다." 
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedMembers = [...localMembers];
        updatedMembers[index] = { ...updatedMembers[index], img: reader.result as string };
        setLocalMembers(updatedMembers);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAlumniImageUpload = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        setErrorModal({ 
          isOpen: true, 
          message: "500KB 이상의 파일은 불러올 수 없습니다.\n확인 버튼을 누르면 원래 화면으로 돌아갑니다." 
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedAlumni = [...localAlumni];
        updatedAlumni[index] = { ...updatedAlumni[index], img: reader.result as string };
        setLocalAlumni(updatedAlumni);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResearchImageUpload = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        setErrorModal({ 
          isOpen: true, 
          message: "500KB 이상의 파일은 불러올 수 없습니다.\n확인 버튼을 누르면 원래 화면으로 돌아갑니다." 
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedResearch = [...localResearch];
        updatedResearch[index] = { ...updatedResearch[index], imageUrl: reader.result as string };
        setLocalResearch(updatedResearch);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (!filesList) return;
    const files = Array.from(filesList);
    if (files.length === 0) return;

    let hasError = false;
    const newTemps: { url: string; file: File }[] = [];
    let processedCount = 0;

    files.forEach((file: File) => {
      if (file.size > 500 * 1024) {
        hasError = true;
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newTemps.push({
          url: reader.result as string,
          file: file
        });
        processedCount++;
        if (processedCount === files.length - (hasError ? (files as File[]).filter((f: File) => f.size > 500 * 1024).length : 0)) {
          setTempGalleryFiles(prev => [...prev, ...newTemps]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (hasError) {
      setErrorModal({ 
        isOpen: true, 
        message: "500KB 이상의 파일은 불러올 수 없습니다.\n일부 파일이 제외되었습니다." 
      });
    }
    
    // Clear input so same file can be picked again
    e.target.value = '';
  };

  const confirmGalleryUpload = async () => {
    if (tempGalleryFiles.length === 0) return;
    
    setIsSaving(true);
    try {
      for (const temp of tempGalleryFiles) {
        await addGalleryPhoto({
          url: temp.url,
          year: newPhotoYear,
          month: newPhotoMonth,
          createdAt: new Date().toISOString()
        });
      }
      setTempGalleryFiles([]);
      setShowAddPhotoModal(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditPhoto = (photo: any) => {
    setEditingPhotoId(photo.id);
    setEditPhotoYear(photo.year);
    setEditPhotoMonth(photo.month);
    setShowEditPhotoModal(true);
  };

  const saveEditedPhoto = async () => {
    if (!editingPhotoId) return;
    setIsSaving(true);
    try {
      await updateGalleryPhoto(editingPhotoId, {
        year: editPhotoYear,
        month: editPhotoMonth
      });
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
        } else {
          const updated = [...localAlumni];
          updated[newMember.index] = { ...updated[newMember.index], name: newMember.name, company: newMember.role };
          setLocalAlumni(updated);
        }
      } else {
        if (newMember.type === 'current') {
          setLocalMembers([...localMembers, { name: newMember.name, role: newMember.role }]);
        } else {
          setLocalAlumni([...localAlumni, { name: newMember.name, company: newMember.role }]);
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
      }
      if (newItem.type === 'career') {
        const updated = [...localProfessor.career];
        if (newItem.editIndex !== null) {
          updated[newItem.editIndex] = newItem.title;
        } else {
          updated.push(newItem.title);
        }
        setLocalProfessor({ ...localProfessor, career: updated });
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
              {activeTab === 'research' ? 'Research' : activeTab === 'members' ? 'Members' : 'Photos'}
            </span>
          </h1>
          <p className="text-[12px] text-brand-muted opacity-60">CMML 사이트의 모든 요소를 실시간으로 제어합니다.</p>
          
          {isSaving && (
            <div className="absolute top-0 right-0 flex items-center gap-3 bg-brand-paper px-4 py-2 rounded-full border border-brand-ink/5 shadow-sm">
              <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-brand-gold"></div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-brand-gold">저장 중...</span>
            </div>
          )}
        </header>

        {activeTab === 'research' ? (
          <div className="max-w-5xl space-y-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-serif font-bold tracking-tight">
                RESEARCH PROJECTS
                <span className="text-[12px] text-gray-400 font-sans ml-3 font-normal">(*이미지파일 용량 500KB 이하 파일만 업로드 해주시길 바랍니다.)</span>
              </h2>
              <PlusSquare 
                onClick={handleAddNewResearch}
                className="w-5 h-5 opacity-60 cursor-pointer hover:opacity-100" 
              />
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
               {localResearch.map((item, i) => (
                 <div key={item.id} className="flex gap-12 group">
                   <div 
                     onClick={() => {
                       setTargetResearchIndex(i);
                       researchFileInputRef.current?.click();
                     }}
                     className="w-[20.8rem] h-[17rem] bg-white flex items-center justify-center rounded-2xl cursor-pointer overflow-hidden relative border border-brand-ink/5"
                   >
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-contain" />
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
                          <span className="text-brand-muted opacity-40 font-bold uppercase tracking-widest text-[13px]">제목</span>
                          <input 
                            type="text" 
                            value={item.title} 
                            onChange={e => {
                              const updated = [...localResearch];
                              updated[i] = { ...item, title: e.target.value };
                              setLocalResearch(updated);
                            }}
                            className="font-medium outline-none bg-transparent border-b border-brand-ink/5 focus:border-brand-gold text-[15px]"
                          />
                           <span className="text-brand-muted opacity-40 font-bold uppercase tracking-widest text-[13px]">부제</span>
                          <input 
                            type="text" 
                            value={item.subtitle} 
                            onChange={e => {
                              const updated = [...localResearch];
                              updated[i] = { ...item, subtitle: e.target.value };
                              setLocalResearch(updated);
                            }}
                            className="font-medium outline-none bg-transparent border-b border-brand-ink/5 focus:border-brand-gold text-[15px]"
                          />
                          <span className="text-brand-muted opacity-40 font-bold uppercase tracking-widest text-[13px]">간략 설명</span>
                          <textarea 
                            value={item.shortDescription} 
                            onChange={e => {
                              const updated = [...localResearch];
                              updated[i] = { ...item, shortDescription: e.target.value };
                              setLocalResearch(updated);
                            }}
                            className="font-medium outline-none bg-transparent border-b border-brand-ink/5 focus:border-brand-gold h-20 w-full resize-none text-[15px]"
                          />
                          <span className="text-brand-muted opacity-40 font-bold uppercase tracking-widest text-[13px]">상세 설명</span>
                          <textarea 
                            value={item.fullDescription?.join('\n\n')} 
                            onChange={e => {
                              const updated = [...localResearch];
                              updated[i] = { ...item, fullDescription: e.target.value.split('\n\n').filter(p => p.trim() !== '') };
                              setLocalResearch(updated);
                            }}
                            className="font-medium outline-none bg-transparent border-b border-brand-ink/5 focus:border-brand-gold h-40 w-full resize-none text-[15px]"
                            placeholder="상세 내용을 입력하세요 (문단은 두 번의 줄바꿈으로 구분)"
                          />
                          <span className="text-brand-muted opacity-40 font-bold uppercase tracking-widest text-[13px]">RESEARCH HIGHLIGHTS</span>
                          <textarea 
                            value={item.references?.join('\n')} 
                            onChange={e => {
                              const updated = [...localResearch];
                              updated[i] = { ...item, references: e.target.value.split('\n').filter(p => p.trim() !== '') };
                              setLocalResearch(updated);
                            }}
                            className="font-medium outline-none bg-transparent border-b border-brand-ink/5 focus:border-brand-gold h-24 w-full resize-none text-[15px]"
                            placeholder="하이라이트 내용을 입력하세요 (줄바꿈으로 구분)"
                          />
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          {itemToDeleteIndex === i ? (
                             <div className="flex flex-col gap-2 bg-red-50 p-3 rounded-2xl border border-red-100 shadow-sm animate-in fade-in zoom-in duration-200">
                               <p className="text-[10px] font-bold text-red-600 uppercase tracking-tighter">정말로 삭제하시겠습니까?</p>
                               <div className="flex gap-2">
                                 <button 
                                   onClick={() => {
                                     const updated = localResearch.filter((_, idx) => idx !== i);
                                     setLocalResearch(updated);
                                     setItemToDeleteIndex(null);
                                   }}
                                   className="flex-1 bg-red-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-red-600 transition-colors"
                                 >
                                   삭제
                                 </button>
                                 <button 
                                   onClick={() => setItemToDeleteIndex(null)}
                                   className="flex-1 bg-white text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:text-gray-600 transition-colors"
                                 >
                                   취소
                                 </button>
                               </div>
                             </div>
                           ) : (
                            <Trash2 
                              onClick={() => setItemToDeleteIndex(i)}
                              className="w-5 h-5 opacity-60 cursor-pointer hover:opacity-100 hover:text-red-500 transition-all shrink-0 mt-2" 
                              title="프로젝트 삭제"
                            />
                           )}
                        </div>
                      </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        ) : activeTab === 'members' ? (
          <div className="max-w-6xl space-y-24">
            {/* Professor */}
            <section>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-serif font-bold tracking-tight">
                  PROFESSOR PROFILE
                  <span className="text-[12px] text-gray-400 font-sans ml-3 font-normal">(*이미지파일 용량 500KB 이하 파일만 업로드 해주시길 바랍니다.)</span>
                </h2>
              </div>
              <div className="flex gap-12 bg-[#f9f9f9] p-10 rounded-3xl border border-brand-ink/5">
                <div 
                  onClick={() => professorFileInputRef.current?.click()}
                  className="w-[448px] aspect-[16/9] bg-white flex items-center justify-center rounded-2xl shrink-0 cursor-pointer overflow-hidden relative group border border-brand-ink/5"
                >
                  {localProfessor.img ? (
                    <img src={localProfessor.img} alt={localProfessor.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-gray-400" />
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
                      <span className="opacity-40 font-bold uppercase tracking-widest text-[10px] pt-1">성명</span>
                      <input 
                        type="text" 
                        value={localProfessor.name} 
                        onChange={e => setLocalProfessor({ ...localProfessor, name: e.target.value })}
                        className="font-medium text-[15px] border-b border-brand-ink/10 focus:border-brand-gold outline-none bg-transparent py-0.5"
                      />
                      <span className="opacity-40 font-bold uppercase tracking-widest text-[10px] pt-1">소속</span>
                      <input 
                        type="text" 
                        value={localProfessor.affiliation} 
                        onChange={e => setLocalProfessor({ ...localProfessor, affiliation: e.target.value })}
                        className="font-medium border-b border-brand-ink/10 focus:border-brand-gold outline-none bg-transparent py-0.5"
                      />
                      <span className="opacity-40 font-bold uppercase tracking-widest text-[10px] pt-1">이메일</span>
                      <input 
                        type="email" 
                        value={localProfessor.email} 
                        onChange={e => setLocalProfessor({ ...localProfessor, email: e.target.value })}
                        className="font-medium border-b border-brand-ink/10 focus:border-brand-gold outline-none bg-transparent py-0.5"
                      />
                   </div>
                   
                   <div className="space-y-12">
                      {/* Academic Degrees */}
                      <div>
                        <div className="flex justify-between items-center mb-4 border-b border-brand-ink/10 pb-2">
                          <h3 className="text-[12px] font-bold tracking-[0.2em] uppercase opacity-40">Academic Degrees</h3>
                        </div>
                        <ul className="space-y-2 mb-4">
                          {localProfessor.degrees.map((d, i) => (
                            <li key={i} className="text-sm font-light flex justify-between group items-center">
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
                                <button onClick={() => setLocalProfessor({ ...localProfessor, degrees: localProfessor.degrees.filter((_, idx) => idx !== i) })} className="text-red-400/60 hover:text-red-500">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </li>
                          ))}
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
                          {localProfessor.career.map((c, i) => (
                            <li key={i} className="text-sm font-light flex justify-between group items-center">
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
                                <button onClick={() => setLocalProfessor({ ...localProfessor, career: localProfessor.career.filter((_, idx) => idx !== i) })} className="text-red-400/60 hover:text-red-500">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <button 
                           onClick={() => { setNewItem({ type: 'career', title: '', subtitle: '', editIndex: null }); setShowAddItemModal(true); }}
                           className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-gold hover:text-brand-ink transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Career Row</span>
                        </button>
                      </div>

                      {/* Fellowships, Honors & Awards */}
                      <div>
                        <div className="flex justify-between items-center mb-4 border-b border-brand-ink/10 pb-2">
                          <h3 className="text-[12px] font-bold tracking-[0.2em] uppercase opacity-40">Fellowships, Honors & Awards</h3>
                        </div>
                        <ul className="space-y-4 mb-4">
                          {localProfessor.awards.map((a, i) => (
                            <li key={i} className="text-sm font-light flex justify-between group items-start">
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
                                <button onClick={() => setLocalProfessor({ ...localProfessor, awards: localProfessor.awards.filter((_, idx) => idx !== i) })} className="text-red-400/60 hover:text-red-500">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </li>
                          ))}
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
                  <span className="text-[12px] text-gray-400 font-sans ml-3 font-normal">(*이미지파일 용량 500KB 이하 파일만 업로드 해주시길 바랍니다.)</span>
                </h2>
                <div className="flex gap-4">
                  <PlusSquare 
                    className="w-5 h-5 opacity-60 cursor-pointer hover:opacity-100" 
                    onClick={() => setShowAddMember(true)}
                  />
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
                {localMembers.map((m, i) => (
                  <div key={i} className="space-y-4">
                    <div 
                      onClick={() => {
                        setTargetMemberIndex(i);
                        memberFileInputRef.current?.click();
                      }}
                      className="aspect-[3/4] bg-white rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden relative group border border-brand-ink/5"
                    >
                       {m.img ? (
                         <img src={m.img} alt={m.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                       ) : (
                         <ImageIcon className="w-8 h-8 text-gray-400" />
                       )}
                       <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <Plus className="w-8 h-8 text-white" />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 text-[12px] gap-y-2 relative group">
                       <span className="opacity-40">성명</span>
                       <span className="text-right font-medium">{m.name}</span>
                       <span className="opacity-40">역할</span>
                       <span className="text-right font-medium">{m.role}</span>
                       <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             setNewMember({ name: m.name, role: m.role, type: 'current', index: i });
                             setShowAddMember(true);
                           }}
                           className="bg-brand-ink text-white p-1 rounded-full hover:bg-brand-gold transition-colors"
                         >
                           <Edit3 className="w-3 h-3" />
                         </button>
                         <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocalMembers(localMembers.filter((_, idx) => idx !== i));
                          }}
                          className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                         >
                           <Trash2 className="w-3 h-3" />
                         </button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

             {/* Alumni */}
             <section>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-serif">
                  Alumni
                  <span className="text-[12px] text-gray-400 font-sans ml-3 font-normal">(*이미지파일 용량 500KB 이하 파일만 업로드 해주시길 바랍니다.)</span>
                </h2>
                <div className="flex gap-4">
                  <PlusSquare 
                    className="w-5 h-5 opacity-60 cursor-pointer hover:opacity-100"
                    onClick={() => { setNewMember({ ...newMember, type: 'alumni' }); setShowAddMember(true); }}
                  />
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
                {localAlumni.map((m, i) => (
                  <div key={i} className="space-y-4">
                    <div 
                      onClick={() => {
                        setTargetAlumniIndex(i);
                        alumniFileInputRef.current?.click();
                      }}
                      className="aspect-square bg-white rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden relative group border border-brand-ink/5"
                    >
                       {m.img ? (
                         <img src={m.img} alt={m.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                       ) : (
                         <ImageIcon className="w-8 h-8 text-gray-400" />
                       )}
                       <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <Plus className="w-8 h-8 text-white" />
                       </div>
                    </div>
                    <div className="text-right space-y-1 relative group">
                       <p className="text-[13px] font-medium">{m.name}</p>
                       <p className="text-[12px] opacity-40">{m.company}</p>
                       <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             setNewMember({ name: m.name, role: m.company, type: 'alumni', index: i });
                             setShowAddMember(true);
                           }}
                           className="bg-brand-ink text-white p-1 rounded-full hover:bg-brand-gold transition-colors shadow-sm"
                         >
                           <Edit3 className="w-3 h-3" />
                         </button>
                         <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocalAlumni(localAlumni.filter((_, idx) => idx !== i));
                          }}
                          className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-sm"
                         >
                           <Trash2 className="w-3 h-3" />
                         </button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="max-w-6xl">
            <header className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-xl font-serif font-bold tracking-tight mb-2">PHOTOS GALLERY</h2>
                <p className="text-[12px] text-brand-muted opacity-60">연구실 활동 및 사진첩을 관리합니다.</p>
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
              {localGallery.length === 0 ? (
                <div className="col-span-full py-32 border-2 border-dashed border-brand-ink/5 rounded-[40px] flex flex-col items-center justify-center text-brand-muted opacity-30">
                  <ImageIcon className="w-12 h-12 mb-4" />
                  <p className="font-serif italic">No photos uploaded yet.</p>
                </div>
              ) : (
                localGallery.map((photo, i) => (
                  <div key={photo.id || i} className="group relative aspect-square bg-[#f9f9f9] rounded-3xl overflow-hidden border border-brand-ink/5 shadow-sm hover:shadow-xl transition-all duration-500">
                    <img 
                      src={photo.url} 
                      alt={`Lab photo ${photo.year}-${photo.month}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Date Badge - Always Visible */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white shadow-sm z-10 transition-transform duration-500 group-hover:scale-110">
                      <p className="text-[9px] font-bold tracking-widest text-brand-ink opacity-40 uppercase leading-none mb-0.5">{photo.year}</p>
                      <p className="text-[11px] font-serif font-bold text-brand-ink leading-none">{photo.month}월</p>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="absolute bottom-4 left-4 right-4 flex justify-end gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <button 
                        onClick={() => handleEditPhoto(photo)}
                        className="w-8 h-8 bg-white text-brand-ink rounded-xl flex items-center justify-center hover:bg-brand-gold hover:text-white transition-colors shadow-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (photo.id) {
                            setIsSaving(true);
                            try {
                              await deleteGalleryPhoto(photo.id);
                            } finally {
                              setIsSaving(false);
                            }
                          } else {
                            setLocalGallery(localGallery.filter((_, idx) => idx !== i));
                          }
                        }}
                        className="w-8 h-8 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
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
            
            <h2 className="text-2xl font-serif mb-10 tracking-tight">{newMember.index !== null ? 'Edit Member' : 'Add New Member'}</h2>
            
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
                    Current Member
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
                  placeholder="Full Name (e.g. John Doe)"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                  {newMember.type === 'current' ? 'Role' : 'Current Affiliation / Company'}
                </label>
                <input 
                  type="text"
                  required
                  value={newMember.role}
                  onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full border-b border-brand-ink/20 py-2 focus:border-brand-gold outline-none transition-colors"
                  placeholder={newMember.type === 'current' ? "e.g. PhD Student" : "e.g. Samsung / Postdoc"}
                />
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  className="w-full bg-brand-ink text-white py-4 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-brand-gold transition-colors shadow-lg shadow-brand-ink/10"
                >
                  {newMember.index !== null ? 'Update & Save' : 'Confirm & Add'}
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
              {newItem.editIndex !== null ? 'Edit' : 'Add New'} {newItem.type}
            </h2>
            
            <form onSubmit={handleAddItem} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                  {newItem.type === 'award' ? 'Award Name / Project' : 'Content'}
                </label>
                <input 
                  type="text"
                  required
                  value={newItem.title}
                  onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full border-b border-brand-ink/10 py-2 focus:border-brand-gold outline-none transition-colors text-sm font-light"
                  placeholder={newItem.type === 'award' ? "Enter Award/Project name..." : "Enter degree or career info..."}
                />
              </div>

              {newItem.type === 'award' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                    Affiliation / Year
                  </label>
                  <input 
                    type="text"
                    required
                    value={newItem.subtitle}
                    onChange={e => setNewItem({ ...newItem, subtitle: e.target.value })}
                    className="w-full border-b border-brand-ink/10 py-2 focus:border-brand-gold outline-none transition-colors text-sm font-light"
                    placeholder="Enter sub-info..."
                  />
                </div>
              )}

              <div className="pt-6">
                <button 
                  type="submit"
                  className="w-full bg-brand-ink text-white py-4 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-brand-gold transition-colors shadow-lg shadow-brand-ink/10"
                >
                  {newItem.editIndex !== null ? 'Confirm & Update' : 'Confirm & Add'}
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
              <h2 className="text-2xl font-serif font-bold tracking-tight mb-2">Upload Lab Photos</h2>
              <p className="text-[12px] text-brand-muted opacity-60 uppercase tracking-widest font-bold">사진의 시기와 이미지를 선택해주세요.</p>
            </div>

            <div className="flex gap-8 mb-10">
              <div className="flex-1 space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Year</label>
                <div className="bg-[#f5f5f5] rounded-2xl p-4 border border-brand-ink/5">
                  <select 
                    value={newPhotoYear} 
                    onChange={e => setNewPhotoYear(parseInt(e.target.value))}
                    className="w-full bg-transparent border-none outline-none font-bold text-sm"
                  >
                    {Array.from({ length: 11 }, (_, i) => 2020 + i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ) )}
                  </select>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Month</label>
                <div className="bg-[#f5f5f5] rounded-2xl p-4 border border-brand-ink/5">
                  <select 
                    value={newPhotoMonth} 
                    onChange={e => setNewPhotoMonth(parseInt(e.target.value))}
                    className="w-full bg-transparent border-none outline-none font-bold text-sm"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{m}</option>
                    ) )}
                  </select>
                </div>
              </div>
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
                  <p className="font-serif italic text-brand-muted mb-2">Click to select photos</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">Max 500KB per file</p>
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
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
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
                disabled={tempGalleryFiles.length === 0}
                className="flex-[2] bg-brand-ink text-white py-5 rounded-2xl font-bold tracking-[0.2em] uppercase text-[11px] hover:bg-brand-gold disabled:opacity-20 disabled:hover:bg-brand-ink transition-all shadow-xl shadow-brand-ink/10"
              >
                Upload {tempGalleryFiles.length > 0 && `${tempGalleryFiles.length} Photos`}
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
              <h2 className="text-2xl font-serif font-bold tracking-tight mb-2">Edit Photo Info</h2>
              <p className="text-[12px] text-brand-muted opacity-60 uppercase tracking-widest font-bold">사진의 날짜를 수정합니다.</p>
            </div>

            <div className="space-y-6 mb-10">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Year</label>
                <div className="bg-[#f5f5f5] rounded-2xl p-4 border border-brand-ink/5">
                  <select 
                    value={editPhotoYear} 
                    onChange={e => setEditPhotoYear(parseInt(e.target.value))}
                    className="w-full bg-transparent border-none outline-none font-bold text-sm"
                  >
                    {Array.from({ length: 11 }, (_, i) => 2020 + i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ) )}
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Month</label>
                <div className="bg-[#f5f5f5] rounded-2xl p-4 border border-brand-ink/5">
                  <select 
                    value={editPhotoMonth} 
                    onChange={e => setEditPhotoMonth(parseInt(e.target.value))}
                    className="w-full bg-transparent border-none outline-none font-bold text-sm"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{m}</option>
                    ) )}
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={saveEditedPhoto}
              className="w-full bg-brand-ink text-white py-5 rounded-2xl font-bold tracking-[0.2em] uppercase text-[11px] hover:bg-brand-gold transition-all shadow-xl shadow-brand-ink/10"
            >
              Save Changes
            </button>
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
            <h3 className="text-xl font-serif font-bold mb-4 tracking-tight">업로드 제한</h3>
            <p className="text-brand-muted font-light leading-relaxed mb-10 whitespace-pre-wrap">
              {errorModal.message}
            </p>
            <button 
              onClick={() => setErrorModal({ isOpen: false, message: '' })}
              className="w-full bg-brand-ink text-white py-4 rounded-2xl font-bold tracking-[0.2em] uppercase text-[11px] hover:bg-brand-gold transition-all shadow-xl shadow-brand-ink/10 active:scale-[0.98]"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
