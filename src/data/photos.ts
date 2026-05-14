export interface Photo {
  url: string;
  alt: string;
}

export interface PhotoAlbum {
  id: string;
  year: number;
  month: string;
  title: string;
  photos: Photo[];
}

export const PHOTO_ALBUMS: PhotoAlbum[] = [
  {
    id: '1',
    year: 2024,
    month: 'May',
    title: 'Lab Life',
    photos: [
      { url: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=90&w=1600", alt: "Lab 1" },
      { url: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=90&w=1200", alt: "Lab 2" },
      { url: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=90&w=1200", alt: "Lab 3" },
      { url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=90&w=1200", alt: "Lab 4" },
      { url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=90&w=1200", alt: "Lab 5" },
      { url: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=90&w=1600", alt: "Lab 6" },
    ]
  },
  {
    id: '2',
    year: 2024,
    month: 'March',
    title: 'Conferences',
    photos: [
      { url: "https://images.unsplash.com/photo-1540575861501-7ad0582373f3?auto=format&fit=crop&q=90&w=1600", alt: "Conference 1" },
      { url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=90&w=1200", alt: "Conference 2" },
      { url: "https://images.unsplash.com/photo-1475721027785-f74dea996971?auto=format&fit=crop&q=90&w=1200", alt: "Conference 3" },
      { url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=90&w=1200", alt: "Conference 4" },
      { url: "https://images.unsplash.com/photo-1524178232363-1fb28f74b671?auto=format&fit=crop&q=90&w=1600", alt: "Conference 5" },
      { url: "https://images.unsplash.com/photo-1523580494863-6f30312248fd?auto=format&fit=crop&q=90&w=1200", alt: "Conference 6" },
    ]
  }
];
