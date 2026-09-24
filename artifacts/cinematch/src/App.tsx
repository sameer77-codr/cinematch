import { type ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowRight,
  Bookmark,
  Check,
  ChevronDown,
  ChevronUp,
  CircleUserRound,
  Clapperboard,
  Compass,
  Film,
  Heart,
  Info,
  LampCeiling,
  Moon,
  Play,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Star,
  Sun,
  Ticket,
  X,
} from 'lucide-react';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

const queryClient = new QueryClient();

type Movie = {
  id: number;
  title: string;
  year: number;
  runtime: string;
  genres: string[];
  director: string;
  cast: string;
  synopsis: string;
  reason: string;
  score: number;
  matchLabel: string;
  poster: string;
  backdrop: string;
  tone: string;
  industry?: string;
  language?: string;
  cinemaRegions?: string[];
};

const movies: Movie[] = [
  {
    id: 1,
    title: 'Past Lives',
    year: 2023,
    runtime: '1h 46m',
    genres: ['Romance', 'Drama'],
    director: 'Celine Song',
    cast: 'Greta Lee, Teo Yoo, John Magaro',
    synopsis: 'Two childhood friends reunite in New York for one week, turning an ordinary visit into a quiet reckoning with the lives they chose.',
    reason: 'You tend to love stories that trust a pause. This one turns longing into something mature, lucid, and quietly devastating.',
    score: 97,
    matchLabel: 'A near-perfect fit',
    poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=85',
    backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=85',
    tone: 'tender, precise, unhurried',
  },
  {
    id: 2,
    title: 'The Holdovers',
    year: 2023,
    runtime: '2h 13m',
    genres: ['Comedy', 'Drama'],
    director: 'Alexander Payne',
    cast: 'Paul Giamatti, Da’Vine Joy Randolph, Dominic Sessa',
    synopsis: 'A cranky teacher, a grieving cook, and a stranded student form an unlikely family over an empty Christmas break.',
    reason: 'For the evenings when you want warmth without sentimentality, and characters who get better by being honest.',
    score: 94,
    matchLabel: 'Very much your weather',
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=85',
    backdrop: 'https://images.unsplash.com/photo-1536440136628-849c177e76a2?auto=format&fit=crop&w=1600&q=85',
    tone: 'wry, warm, wintry',
  },
  {
    id: 3,
    title: 'Perfect Days',
    year: 2023,
    runtime: '2h 4m',
    genres: ['Drama'],
    director: 'Wim Wenders',
    cast: 'Kōji Yakusho, Tokio Emoto, Arisa Nakano',
    synopsis: 'A Tokyo restroom cleaner finds quiet joy in a life composed of ritual, cassettes, trees, and small human encounters.',
    reason: 'Your taste profile has a strong signal for beautiful routines. This is a film that makes attention feel like an adventure.',
    score: 91,
    matchLabel: 'A slow-burn yes',
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=85',
    backdrop: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=85',
    tone: 'observant, humane, luminous',
  },
  {
    id: 4,
    title: 'Anatomy of a Fall',
    year: 2023,
    runtime: '2h 31m',
    genres: ['Mystery', 'Drama'],
    director: 'Justine Triet',
    cast: 'Sandra Hüller, Swann Arlaud, Milo Machado Graner',
    synopsis: 'After a man’s death in the French Alps, his wife becomes the sole suspect in a trial that tests the limits of truth.',
    reason: 'You like a mystery that leaves room for interpretation. Every answer here opens a more interesting question.',
    score: 89,
    matchLabel: 'For your curious side',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=85',
    backdrop: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85',
    tone: 'sharp, cerebral, tense',
  },
  {
    id: 5,
    title: 'The Worst Person in the World',
    year: 2021,
    runtime: '2h 8m',
    genres: ['Romance', 'Comedy', 'Drama'],
    director: 'Joachim Trier',
    cast: 'Renate Reinsve, Anders Danielsen Lie, Herbert Nordrum',
    synopsis: 'Four years in the life of Julie, a young woman navigating the troubled waters of her love life and finding her career path.',
    reason: 'A little messy, very alive. It gets the strange comedy of becoming a person exactly right.',
    score: 88,
    matchLabel: 'A smart little detour',
    poster: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&w=600&q=85',
    backdrop: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1600&q=85',
    tone: 'brisk, romantic, searching',
  },
  {
    id: 6,
    title: 'Moonlight',
    year: 2016,
    runtime: '1h 51m',
    genres: ['Drama'],
    director: 'Barry Jenkins',
    cast: 'Mahershala Ali, Naomie Harris, Trevante Rhodes',
    synopsis: 'A young man finds connection and identity across three defining chapters of his life in Miami.',
    reason: 'The kind of intimate storytelling you return to: visually confident, emotionally exact, never in a hurry.',
    score: 86,
    matchLabel: 'A lasting favorite',
    poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=600&q=85',
    backdrop: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1600&q=85',
    tone: 'intimate, blue, searching',
  },
  {
    id: 7,
    title: 'Decision to Leave',
    year: 2022,
    runtime: '2h 18m',
    genres: ['Mystery', 'Romance'],
    director: 'Park Chan-wook',
    cast: 'Tang Wei, Park Hae-il, Lee Jung-hyun',
    synopsis: 'A detective investigating a man’s death develops an elusive fascination with the dead man’s widow.',
    reason: 'For when you want romance with a locked-room pulse and images that keep rearranging themselves in your head.',
    score: 84,
    matchLabel: 'A beautiful complication',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=85',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85',
    tone: 'sensuous, exacting, strange',
  },
  {
    id: 8,
    title: 'Arrival',
    year: 2016,
    runtime: '1h 56m',
    genres: ['Science Fiction', 'Drama'],
    director: 'Denis Villeneuve',
    cast: 'Amy Adams, Jeremy Renner, Forest Whitaker',
    synopsis: 'A linguist works to communicate with extraterrestrial visitors while time and memory begin to bend.',
    reason: 'Big ideas, a tender center. This is your kind of spectacle: intimate enough to feel personal.',
    score: 82,
    matchLabel: 'Thoughtful and transportive',
    poster: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=600&q=85',
    backdrop: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=85',
    tone: 'atmospheric, cerebral, tender',
  },
  {
    id: 9,
    title: '12th Fail',
    year: 2023,
    runtime: '2h 27m',
    genres: ['Drama', 'Biography'],
    director: 'Vidhu Vinod Chopra',
    cast: 'Vikrant Massey, Medha Shankr, Anant V Joshi',
    synopsis: 'A young man from a small village rebuilds his life and prepares for India’s civil service examinations after failing school.',
    reason: 'A grounded, quietly determined story for viewers who respond to human-scale drama and earned optimism.',
    score: 93,
    matchLabel: 'A hopeful, human fit',
    poster: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=85',
    backdrop: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85',
    tone: 'earnest, resilient, uplifting',
    industry: 'Bollywood',
    language: 'Hindi',
    cinemaRegions: ['Maharashtra'],
  },
  {
    id: 10,
    title: 'RRR',
    year: 2022,
    runtime: '3h 7m',
    genres: ['Action', 'Drama', 'Historical'],
    director: 'S. S. Rajamouli',
    cast: 'N. T. Rama Rao Jr., Ram Charan, Alia Bhatt',
    synopsis: 'Two revolutionaries forge a powerful friendship in a fictionalized story set during British colonial rule.',
    reason: 'For nights when you want scale and spectacle: the action is huge, but the emotional core stays front and center.',
    score: 92,
    matchLabel: 'Big-screen energy',
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=85',
    backdrop: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=85',
    tone: 'rousing, grand, exuberant',
    industry: 'Telugu cinema',
    language: 'Telugu',
    cinemaRegions: ['Telangana', 'Andhra Pradesh'],
  },
  {
    id: 11,
    title: 'Sita Ramam',
    year: 2022,
    runtime: '2h 43m',
    genres: ['Romance', 'Drama', 'Mystery'],
    director: 'Hanu Raghavapudi',
    cast: 'Dulquer Salmaan, Mrunal Thakur, Rashmika Mandanna',
    synopsis: 'A letter addressed to an army officer sets a young woman on a journey to uncover a decades-old love story.',
    reason: 'A strong match if you enjoy romance shaped by memory, sweeping landscapes, and a mystery that unfolds gently.',
    score: 90,
    matchLabel: 'A sweeping romance',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=85',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85',
    tone: 'lyrical, romantic, nostalgic',
    industry: 'Telugu cinema',
    language: 'Telugu',
    cinemaRegions: ['Telangana', 'Andhra Pradesh'],
  },
  {
    id: 12,
    title: 'Manjummel Boys',
    year: 2024,
    runtime: '2h 15m',
    genres: ['Thriller', 'Drama', 'Adventure'],
    director: 'Chidambaram',
    cast: 'Soubin Shahir, Sreenath Bhasi, Balu Varghese',
    synopsis: 'A close-knit group of friends from Kerala face an extraordinary rescue mission during a trip to the Guna Caves.',
    reason: 'You may like its mix of lived-in friendship, mounting tension, and a true-story-inspired rescue at the heart of it.',
    score: 89,
    matchLabel: 'Tense and heartfelt',
    poster: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=600&q=85',
    backdrop: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=85',
    tone: 'intimate, suspenseful, loyal',
    industry: 'Malayalam cinema',
    language: 'Malayalam',
    cinemaRegions: ['Kerala'],
  },
  {
    id: 13,
    title: 'Kantara',
    year: 2022,
    runtime: '2h 28m',
    genres: ['Action', 'Drama', 'Thriller'],
    director: 'Rishab Shetty',
    cast: 'Rishab Shetty, Kishore, Sapthami Gowda',
    synopsis: 'A conflict over land and tradition draws a village into a collision between a forest officer and a local Kambala champion.',
    reason: 'A distinctive pick for viewers drawn to folklore, vivid settings, and stories where place is part of the plot.',
    score: 88,
    matchLabel: 'Rooted and electric',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=85',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85',
    tone: 'earthy, mythic, forceful',
    industry: 'Kannada cinema',
    language: 'Kannada',
    cinemaRegions: ['Karnataka'],
  },
  {
    id: 14,
    title: 'Jai Bhim',
    year: 2021,
    runtime: '2h 44m',
    genres: ['Drama', 'Crime', 'Courtroom'],
    director: 'T. J. Gnanavel',
    cast: 'Suriya, Lijomol Jose, K. Manikandan',
    synopsis: 'A determined lawyer takes on a case involving a missing tribal man and the search for justice.',
    reason: 'Recommended for its gripping courtroom momentum and commitment to a serious, character-led story.',
    score: 87,
    matchLabel: 'A powerful drama',
    poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=600&q=85',
    backdrop: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1600&q=85',
    tone: 'urgent, humane, unflinching',
    industry: 'Tamil cinema',
    language: 'Tamil',
    cinemaRegions: ['Tamil Nadu'],
  },
  {
    id: 15,
    title: 'Sairat',
    year: 2016,
    runtime: '2h 53m',
    genres: ['Romance', 'Drama', 'Musical'],
    director: 'Nagraj Manjule',
    cast: 'Rinku Rajguru, Akash Thosar, Tanaji Galgunde',
    synopsis: 'A young couple from different social backgrounds fall in love and face the consequences of challenging convention.',
    reason: 'A fit for viewers who want an emotionally direct romance with a memorable musical pulse and social depth.',
    score: 86,
    matchLabel: 'A love story with weight',
    poster: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&w=600&q=85',
    backdrop: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1600&q=85',
    tone: 'tender, musical, intense',
    industry: 'Marathi cinema',
    language: 'Marathi',
    cinemaRegions: ['Maharashtra'],
  },
  {
    id: 16,
    title: 'Laapataa Ladies',
    year: 2023,
    runtime: '2h 2m',
    genres: ['Comedy', 'Drama'],
    director: 'Kiran Rao',
    cast: 'Nitanshi Goel, Pratibha Ranta, Sparsh Shrivastava',
    synopsis: 'Two brides are accidentally switched during a train journey, sending each into an unexpected new chapter.',
    reason: 'A warm, observant comedy-drama for viewers who like kindness, sharp details, and characters finding their own voice.',
    score: 85,
    matchLabel: 'A warm-hearted find',
    poster: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=600&q=85',
    backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=85',
    tone: 'playful, hopeful, observant',
    industry: 'Bollywood',
    language: 'Hindi',
    cinemaRegions: ['Maharashtra'],
  },
  {
    id: 17,
    title: 'Kumbalangi Nights',
    year: 2019,
    runtime: '2h 15m',
    genres: ['Drama', 'Family'],
    director: 'Madhu C. Narayanan',
    cast: 'Shane Nigam, Soubin Shahir, Fahadh Faasil',
    synopsis: 'Four brothers living in a Kerala fishing village slowly find their way toward a more generous understanding of family.',
    reason: 'A strong choice if you value lived-in characters, quiet humor, and a vivid sense of home.',
    score: 84,
    matchLabel: 'Small moments, big heart',
    poster: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=85',
    backdrop: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85',
    tone: 'warm, gently funny, intimate',
    industry: 'Malayalam cinema',
    language: 'Malayalam',
    cinemaRegions: ['Kerala'],
  },
  {
    id: 18,
    title: 'K.G.F: Chapter 2',
    year: 2022,
    runtime: '2h 46m',
    genres: ['Action', 'Crime', 'Drama'],
    director: 'Prashanth Neel',
    cast: 'Yash, Sanjay Dutt, Raveena Tandon',
    synopsis: 'Rocky expands his power over the Kolar Gold Fields while facing new rivals and the cost of his ambition.',
    reason: 'For a full-throttle watch: operatic action, a larger-than-life lead, and a story built for the big screen.',
    score: 83,
    matchLabel: 'Maximum-screen spectacle',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a2?auto=format&fit=crop&w=600&q=85',
    backdrop: 'https://images.unsplash.com/photo-1536440136628-849c177e76a2?auto=format&fit=crop&w=1600&q=85',
    tone: 'bold, grand, high-voltage',
    industry: 'Kannada cinema',
    language: 'Kannada',
    cinemaRegions: ['Karnataka'],
  },
  {
    id: 19,
    title: 'Bhooter Bhabishyat',
    year: 2012,
    runtime: '2h 3m',
    genres: ['Comedy', 'Fantasy'],
    director: 'Anik Dutta',
    cast: 'Sabyasachi Chakrabarty, Parambrata Chatterjee, Swastika Mukherjee',
    synopsis: 'A filmmaker encounters a house full of ghosts from different eras, each with a story and a sharp sense of humor.',
    reason: 'A playful recommendation for viewers who enjoy clever ensemble comedies and a strong regional point of view.',
    score: 81,
    matchLabel: 'A witty regional gem',
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=85',
    backdrop: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=85',
    tone: 'witty, spooky, theatrical',
    industry: 'Bengali cinema',
    language: 'Bengali',
    cinemaRegions: ['West Bengal'],
  },
];

const genres = ['All films', 'Drama', 'Romance', 'Comedy', 'Mystery', 'Science Fiction', 'Action', 'Thriller', 'Crime', 'Historical', 'Musical', 'Family', 'Fantasy', 'Biography', 'Courtroom', 'Adventure'];
const cinemaRegions = ['All regions', 'Maharashtra', 'Telangana', 'Andhra Pradesh', 'Tamil Nadu', 'Kerala', 'Karnataka', 'West Bengal'];
const cinemaIndustries = ['All industries', 'Bollywood', 'Telugu cinema', 'Tamil cinema', 'Malayalam cinema', 'Kannada cinema', 'Marathi cinema', 'Bengali cinema'];
const recommendationMovies = [
  ...movies.slice(0, 3),
  ...movies.filter((movie) => movie.industry).slice(0, 3),
];

const navItems = [
  { href: '/', label: 'Home', icon: LampCeiling },
  { href: '/discover', label: 'Discover', icon: Compass },
  { href: '/recommendations', label: 'For you', icon: Sparkles },
  { href: '/watchlist', label: 'Watchlist', icon: Bookmark },
  { href: '/ratings', label: 'Ratings', icon: Star },
  { href: '/profile', label: 'Taste profile', icon: CircleUserRound },
];

type CinemaContextValue = {
  watchlist: number[];
  ratings: Record<number, number>;
  theme: 'light' | 'dark';
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedMovie: Movie | null;
  setSelectedMovie: (movie: Movie | null) => void;
  toggleWatchlist: (movie: Movie) => void;
  rateMovie: (movie: Movie, rating: number) => void;
  surprise: () => void;
  notice: string | null;
  setNotice: (value: string | null) => void;
  toggleTheme: () => void;
  isLoaded: boolean;
};

const CinemaContext = createContext<CinemaContextValue | null>(null);

function useCinema() {
  const context = useContext(CinemaContext);
  if (!context) throw new Error('useCinema must be used inside CinemaProvider');
  return context;
}

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function CinemaProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<number[]>(() => readStored('cinematch-watchlist', [2, 7]));
  const [ratings, setRatings] = useState<Record<number, number>>(() => readStored('cinematch-ratings', { 1: 5, 3: 4 }));
  const [theme, setTheme] = useState<'light' | 'dark'>(() => readStored('cinematch-theme', 'light'));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLoaded(true), 500);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('cinematch-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);
  useEffect(() => {
    window.localStorage.setItem('cinematch-ratings', JSON.stringify(ratings));
  }, [ratings]);
  useEffect(() => {
    window.localStorage.setItem('cinematch-theme', JSON.stringify(theme));
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const toggleWatchlist = (movie: Movie) => {
    const isSaved = watchlist.includes(movie.id);
    setWatchlist((current) => isSaved ? current.filter((id) => id !== movie.id) : [...current, movie.id]);
    setNotice(isSaved ? `${movie.title} removed from your watchlist` : `${movie.title} saved for later`);
  };

  const rateMovie = (movie: Movie, rating: number) => {
    setRatings((current) => ({ ...current, [movie.id]: rating }));
    setNotice(`Your ${rating}-star rating for ${movie.title} is saved`);
  };

  const surprise = () => {
    const candidate = movies[Math.floor(Math.random() * movies.length)];
    setSelectedMovie(candidate);
    setNotice('A considered surprise, picked from your taste signals');
  };

  return (
    <CinemaContext.Provider value={{
      watchlist, ratings, theme, searchTerm, setSearchTerm, selectedMovie, setSelectedMovie,
      toggleWatchlist, rateMovie, surprise, notice, setNotice,
      toggleTheme: () => setTheme((current) => current === 'light' ? 'dark' : 'light'),
      isLoaded,
    }}>
      {children}
    </CinemaContext.Provider>
  );
}

function NavItem({ href, label, icon: Icon, mobile = false }: { href: string; label: string; icon: typeof Film; mobile?: boolean }) {
  const [location] = useLocation();
  const active = href === '/' ? location === '/' : location.startsWith(href);
  return (
    <Link
      href={href}
      data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}
      className={`${mobile ? 'flex min-w-[62px] flex-col items-center gap-1 py-2 text-[10px]' : 'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm'} transition-colors ${
        active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground'
      }`}
    >
      <Icon size={mobile ? 18 : 17} strokeWidth={active ? 2.2 : 1.8} />
      <span>{label}</span>
    </Link>
  );
}

function ShellHeader() {
  const { theme, toggleTheme, searchTerm, setSearchTerm, surprise } = useCinema();
  const [, setLocation] = useLocation();
  const [draft, setDraft] = useState(searchTerm);
  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchTerm(draft);
    setLocation('/discover');
  };
  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between gap-3 border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
      <div className="flex items-center gap-2 lg:hidden">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Clapperboard size={17} /></div>
        <span className="font-display text-xl">CineMatch</span>
      </div>
      <form onSubmit={submitSearch} className="relative hidden max-w-md flex-1 sm:block lg:max-w-lg" role="search">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} />
        <input
          type="search"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Search films, directors, moods..."
          aria-label="Search films, directors, or moods"
          data-testid="input-global-search"
          className="h-10 w-full rounded-xl border border-border/80 bg-card/60 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary"
        />
      </form>
      <div className="ml-auto flex items-center gap-2">
        <button type="button" onClick={surprise} data-testid="button-surprise-header" className="hidden items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 sm:flex">
          <Sparkles size={15} /> Surprise me
        </button>
        <button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} data-testid="button-toggle-theme" className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
        </button>
        <Link href="/profile" data-testid="link-header-profile" className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-secondary-foreground transition-transform hover:scale-105">
          <span className="font-mono-cinema text-[11px]">AM</span>
        </Link>
      </div>
    </header>
  );
}

function Shell() {
  const { notice } = useCinema();
  return (
    <div className="grain min-h-[100dvh] bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[268px] flex-col bg-sidebar px-5 py-6 text-sidebar-foreground lg:flex">
        <Link href="/" data-testid="link-brand" className="mb-12 flex items-center gap-3 px-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"><Clapperboard size={19} /></div>
          <div>
            <div className="font-display text-2xl leading-none">CineMatch</div>
            <div className="mt-1 font-mono-cinema text-[9px] uppercase tracking-[0.2em] text-sidebar-foreground/40">Your next watch</div>
          </div>
        </Link>
        <div className="mb-3 px-3 font-mono-cinema text-[9px] uppercase tracking-[0.22em] text-sidebar-foreground/35">The screening room</div>
        <nav className="space-y-1">
          {navItems.map((item) => <NavItem key={item.href} {...item} />)}
        </nav>
        <div className="mt-auto rounded-2xl border border-sidebar-border bg-sidebar-accent/60 p-4">
          <div className="mb-3 flex items-center gap-2 text-sidebar-foreground/60"><Ticket size={15} /><span className="font-mono-cinema text-[9px] uppercase tracking-[0.18em]">Tonight's note</span></div>
          <p className="font-display text-xl leading-tight text-sidebar-foreground">“The right film is a feeling before it is a title.”</p>
          <div className="mt-4 h-px w-10 bg-sidebar-primary/70" />
        </div>
        <div className="mt-5 flex items-center justify-between px-2 text-xs text-sidebar-foreground/35">
          <span>Edition 01.24</span><Settings2 size={14} />
        </div>
      </aside>
      <div className="lg:pl-[268px]">
        <ShellHeader />
        <main className="mx-auto max-w-[1500px] px-4 pb-28 pt-6 sm:px-7 lg:px-10 lg:pb-12">{<AppRoutes />}</main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border/80 bg-background/95 px-1 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur-xl lg:hidden">
        {navItems.slice(0, 5).map((item) => <NavItem key={item.href} {...item} mobile />)}
      </nav>
      {notice && <div role="status" data-testid="status-notice" className="fixed bottom-20 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-medium shadow-xl animate-rise-in lg:bottom-7"><Check size={14} className="text-primary" /> {notice}</div>}
      <MovieDetailModal />
    </div>
  );
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={HomeView} />
      <Route path="/discover" component={DiscoverView} />
      <Route path="/recommendations" component={RecommendationsView} />
      <Route path="/watchlist" component={WatchlistView} />
      <Route path="/ratings" component={RatingsView} />
      <Route path="/profile" component={ProfileView} />
      <Route component={NotFound} />
    </Switch>
  );
}

function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end">
      <div>
        <div className="mb-3 flex items-center gap-2 font-mono-cinema text-[10px] uppercase tracking-[0.2em] text-primary"><span className="h-px w-6 bg-primary" />{eyebrow}</div>
        <h1 className="font-display text-5xl leading-[0.92] tracking-[-0.03em] sm:text-6xl">{title}</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

function MatchBadge({ score, label }: { score: number; label?: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-primary">
      <span className="font-mono-cinema text-[11px] font-bold">{score}%</span>
      {label && <span className="text-[11px] font-medium">{label}</span>}
    </div>
  );
}

function MoviePoster({ movie, className = '', priority = false }: { movie: Movie; className?: string; priority?: boolean }) {
  const { setSelectedMovie } = useCinema();
  return (
    <button type="button" onClick={() => setSelectedMovie(movie)} data-testid={`button-poster-${movie.id}`} aria-label={`Open details for ${movie.title}`} className={`poster-shine block overflow-hidden rounded-xl bg-muted text-left ${className}`}>
      <img src={movie.poster} alt={`${movie.title} movie poster`} loading={priority ? 'eager' : 'lazy'} className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.04]" />
    </button>
  );
}

function SaveButton({ movie, compact = false }: { movie: Movie; compact?: boolean }) {
  const { watchlist, toggleWatchlist } = useCinema();
  const saved = watchlist.includes(movie.id);
  return (
    <button type="button" onClick={() => toggleWatchlist(movie)} aria-label={saved ? `Remove ${movie.title} from watchlist` : `Save ${movie.title} to watchlist`} data-testid={`button-watchlist-${movie.id}`} className={`${compact ? 'h-8 w-8' : 'h-10 w-10'} grid place-items-center rounded-full border border-border/80 bg-card/90 text-muted-foreground shadow-sm transition-all hover:border-primary hover:text-primary ${saved ? 'border-primary/40 bg-primary/10 text-primary' : ''}`}>
      <Bookmark size={compact ? 15 : 17} fill={saved ? 'currentColor' : 'none'} />
    </button>
  );
}

function MovieMeta({ movie }: { movie: Movie }) {
  const { setSelectedMovie } = useCinema();
  return (
    <div className="min-w-0">
      <button type="button" onClick={() => setSelectedMovie(movie)} data-testid={`button-title-${movie.id}`} className="max-w-full truncate text-left font-display text-[24px] leading-none transition-colors hover:text-primary">{movie.title}</button>
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground"><span>{movie.year}</span><span className="h-1 w-1 rounded-full bg-border" /><span>{movie.runtime}</span><span className="h-1 w-1 rounded-full bg-border" /><span>{movie.genres[0]}</span></div>
      {movie.industry && <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] font-medium text-secondary-foreground"><span className="rounded-full bg-secondary px-2 py-1">{movie.industry}</span><span>{movie.language}</span><span aria-hidden="true">·</span><span>{movie.cinemaRegions?.join(' / ')}</span></div>}
    </div>
  );
}

function HomeView() {
  const { isLoaded, setSelectedMovie, surprise, watchlist, ratings } = useCinema();
  const featured = movies[0];
  if (!isLoaded) return <LoadingState />;
  return (
    <div className="animate-rise-in">
      <section className="relative isolate overflow-hidden rounded-[1.75rem] bg-[#25243a] text-[#f8f2e7] shadow-2xl shadow-[#25243a]/15">
        <img src={featured.backdrop} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30 mix-blend-screen" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_15%,rgba(227,117,76,0.55),transparent_36%),linear-gradient(100deg,#25243a_16%,rgba(37,36,58,0.86)_48%,rgba(37,36,58,0.32))]" />
        <div className="relative grid min-h-[500px] items-end gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_240px] lg:p-14">
          <div className="max-w-2xl">
            <div className="mb-7 flex items-center gap-3 font-mono-cinema text-[10px] uppercase tracking-[0.24em] text-[#f6ab88]"><span className="h-px w-8 bg-[#f6ab88]" /> Your evening, edited</div>
            <h1 className="max-w-xl font-display text-6xl leading-[0.85] tracking-[-0.035em] sm:text-8xl">A film with<br /><em>something to say.</em></h1>
            <p className="mt-7 max-w-lg text-sm leading-6 text-[#f8f2e7]/70">Skip the scroll. We found a story that matches your appetite for tender, intelligent films that stay with you after the credits.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => setSelectedMovie(featured)} data-testid="button-open-featured" className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#f8f2e7] px-4 text-sm font-semibold text-[#25243a] transition-transform hover:-translate-y-0.5"><Play size={15} fill="currentColor" /> Meet your match</button>
              <button type="button" onClick={surprise} data-testid="button-surprise-home" className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#f8f2e7]/25 px-4 text-sm font-semibold text-[#f8f2e7] transition-colors hover:bg-[#f8f2e7]/10"><Sparkles size={15} /> Surprise me</button>
            </div>
          </div>
          <div className="hidden justify-self-end lg:block">
            <div className="relative w-[210px] rotate-3 transition-transform duration-500 hover:rotate-0">
              <MoviePoster movie={featured} className="aspect-[2/3] shadow-2xl" priority />
              <div className="absolute -bottom-4 -left-10 rounded-xl border border-[#f8f2e7]/15 bg-[#25243a]/85 px-3 py-2 backdrop-blur-md"><MatchBadge score={featured.score} label="match" /></div>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-10 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-7">
          <div className="mb-6 flex items-center justify-between"><div><div className="font-mono-cinema text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Why this one</div><h2 className="mt-2 font-display text-3xl">A recommendation with receipts</h2></div><Info size={17} className="text-muted-foreground" /></div>
          <div className="flex gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground"><Heart size={18} fill="currentColor" /></div>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{featured.reason}</p>
          </div>
          <div className="mt-7 flex flex-wrap gap-2">{['quiet tension', 'human scale', 'beautifully observed'].map((tag) => <span key={tag} className="rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">{tag}</span>)}</div>
        </div>
        <div className="rounded-2xl border border-border bg-secondary/50 p-5 sm:p-7">
          <div className="font-mono-cinema text-[10px] uppercase tracking-[0.18em] text-secondary-foreground/60">Your screening room</div>
          <div className="mt-5 grid grid-cols-2 gap-y-6">
            <div><div className="font-display text-4xl text-secondary-foreground">{watchlist.length}</div><div className="mt-1 text-xs text-secondary-foreground/65">saved for later</div></div>
            <div><div className="font-display text-4xl text-secondary-foreground">{Object.keys(ratings).length}</div><div className="mt-1 text-xs text-secondary-foreground/65">films rated</div></div>
          </div>
          <Link href="/profile" data-testid="link-home-taste-profile" className="mt-7 inline-flex items-center gap-2 text-xs font-semibold text-secondary-foreground hover:underline">Tune your taste <ArrowRight size={14} /></Link>
        </div>
      </section>
      <section className="mt-12">
        <div className="mb-5 flex items-end justify-between"><div><div className="font-mono-cinema text-[10px] uppercase tracking-[0.18em] text-muted-foreground">A good place to continue</div><h2 className="mt-2 font-display text-3xl">More in your orbit</h2></div><Link href="/recommendations" data-testid="link-home-recommendations" className="hidden items-center gap-1 text-xs font-semibold text-primary sm:flex">See all <ArrowRight size={14} /></Link></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">{movies.slice(1, 5).map((movie) => <MiniMovieCard key={movie.id} movie={movie} />)}</div>
      </section>
      <section className="mt-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div><div className="font-mono-cinema text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Across Indian screens</div><h2 className="mt-2 font-display text-3xl">Many languages. Many ways to tell a story.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Explore Bollywood and South Indian cinema—from Hindi and Telugu to Tamil, Malayalam, and Kannada—alongside Marathi and Bengali picks.</p></div>
          <Link href="/discover" data-testid="link-indian-cinema-discover" className="hidden shrink-0 items-center gap-1 text-xs font-semibold text-primary sm:flex">Explore regions <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">{movies.filter((movie) => movie.industry).slice(0, 4).map((movie) => <MiniMovieCard key={movie.id} movie={movie} />)}</div>
      </section>
    </div>
  );
}

function MiniMovieCard({ movie }: { movie: Movie }) {
  return (
    <article className="group min-w-0">
      <div className="relative">
        <MoviePoster movie={movie} className="aspect-[2/3] w-full" />
        <div className="absolute left-2 top-2"><MatchBadge score={movie.score} /></div>
        <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"><SaveButton movie={movie} compact /></div>
      </div>
      <div className="mt-3 truncate font-display text-xl">{movie.title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{movie.year} · {movie.genres[0]}</div>
    </article>
  );
}

function DiscoverView() {
  const { searchTerm, setSearchTerm, isLoaded } = useCinema();
  const [genre, setGenre] = useState('All films');
  const [industry, setIndustry] = useState('All industries');
  const [region, setRegion] = useState('All regions');
  const [input, setInput] = useState(searchTerm);
  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return movies.filter((movie) => {
      const matchesGenre = genre === 'All films' || movie.genres.includes(genre);
      const matchesIndustry = industry === 'All industries' || movie.industry === industry;
      const matchesRegion = region === 'All regions' || movie.cinemaRegions?.includes(region);
      const searchable = [movie.title, movie.director, movie.cast, movie.genres.join(' '), movie.industry, movie.language, movie.cinemaRegions?.join(' ')].filter(Boolean).join(' ').toLowerCase();
      return matchesGenre && matchesIndustry && matchesRegion && (!query || searchable.includes(query));
    });
  }, [genre, industry, region, searchTerm]);
  if (!isLoaded) return <LoadingState />;
  return (
    <div className="animate-rise-in">
      <PageIntro eyebrow="The catalogue" title="Find your next film." description="Browse by feeling, filmmaker, language, or the particular kind of night you’re having. No endless feed required." action={<button type="button" onClick={() => { setSearchTerm(''); setInput(''); setGenre('All films'); setIndustry('All industries'); setRegion('All regions'); }} data-testid="button-clear-discover" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary"><X size={14} /> Clear filters</button>} />
      <div className="mb-7 space-y-4 border-b border-border pb-5">
        <div className="relative w-full sm:max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input type="search" value={input} onChange={(event) => { setInput(event.target.value); setSearchTerm(event.target.value); }} placeholder="Try “quiet”, “Park”, “romance”..." aria-label="Search the film catalogue" data-testid="input-discover-search" className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary" /></div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 gap-1 overflow-x-auto pb-1" role="group" aria-label="Filter by genre">{genres.map((item) => <button key={item} type="button" onClick={() => setGenre(item)} aria-pressed={genre === item} data-testid={`button-genre-${item.toLowerCase().replaceAll(' ', '-')}`} className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-colors ${genre === item ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>{item}</button>)}</div>
          <div className="grid shrink-0 grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="sr-only" htmlFor="industry-filter">Filter by Indian film industry</label>
            <select id="industry-filter" value={industry} onChange={(event) => setIndustry(event.target.value)} aria-label="Filter by Indian film industry" data-testid="select-indian-industry" className="h-10 rounded-xl border border-border bg-card px-3 text-xs text-foreground outline-none focus:border-primary">
              {cinemaIndustries.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <label className="sr-only" htmlFor="region-filter">Filter by Indian cinema state</label>
            <select id="region-filter" value={region} onChange={(event) => setRegion(event.target.value)} aria-label="Filter by Indian cinema state" data-testid="select-indian-region" className="h-10 rounded-xl border border-border bg-card px-3 text-xs text-foreground outline-none focus:border-primary">
              {cinemaRegions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">Regional filters highlight films from each language industry’s home state; this catalogue does not show live theatre schedules.</p>
        <p className="font-mono-cinema text-[10px] uppercase tracking-[0.16em] text-muted-foreground" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'film' : 'films'} in this selection</p>
      </div>
      {filtered.length === 0 ? <EmptyState title="No films in this frame." description="Try another title, industry, state, or genre. The catalogue is small but opinionated." action={<button type="button" onClick={() => { setSearchTerm(''); setInput(''); setGenre('All films'); setIndustry('All industries'); setRegion('All regions'); }} data-testid="button-reset-empty-discover" className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Reset discovery</button>} /> : <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">{filtered.map((movie) => <DiscoverCard key={movie.id} movie={movie} />)}</div>}
    </div>
  );
}

function DiscoverCard({ movie }: { movie: Movie }) {
  return (
    <article className="group min-w-0">
      <div className="relative">
        <MoviePoster movie={movie} className="aspect-[2/3] w-full" />
        <div className="absolute left-2 top-2"><MatchBadge score={movie.score} /></div>
        <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100"><SaveButton movie={movie} compact /></div>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2"><MovieMeta movie={movie} /><div className="mt-1 shrink-0 text-muted-foreground"><Star size={14} fill="currentColor" /></div></div>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{movie.reason}</p>
    </article>
  );
}

function RecommendationsView() {
  const { isLoaded, surprise, setSelectedMovie } = useCinema();
  const [expanded, setExpanded] = useState<number | null>(1);
  if (!isLoaded) return <LoadingState />;
  return (
    <div className="animate-rise-in">
      <PageIntro eyebrow="Your edit" title="Made for your taste." description="Every score is a conversation between what you’ve rated, what you’ve saved, and the stories you keep circling back to." action={<button type="button" onClick={surprise} data-testid="button-surprise-recommendations" className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"><Sparkles size={15} /> Surprise me</button>} />
      <section className="mb-8 grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-6">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"><Sparkles size={23} /></div>
        <div><h2 className="font-display text-2xl">Tonight’s strongest signal</h2><p className="mt-1 text-sm text-muted-foreground">You’ve been gravitating toward films that are intimate, visually assured, and a little unresolved.</p></div>
        <div className="text-left sm:text-right"><div className="font-mono-cinema text-2xl text-primary">3</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">taste signals</div></div>
      </section>
      <div className="space-y-3">{recommendationMovies.map((movie, index) => {
        const isOpen = expanded === movie.id;
        return (
          <article key={movie.id} className={`overflow-hidden rounded-2xl border transition-colors ${isOpen ? 'border-primary/35 bg-card' : 'border-border bg-card/50'}`}>
            <div className="flex items-center gap-3 p-3 sm:gap-5 sm:p-4">
              <div className="hidden w-7 shrink-0 font-mono-cinema text-xs text-muted-foreground sm:block">{String(index + 1).padStart(2, '0')}</div>
              <MoviePoster movie={movie} className="h-20 w-14 shrink-0 rounded-lg sm:h-24 sm:w-16" />
              <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><MovieMeta movie={movie} /><MatchBadge score={movie.score} /></div><p className="mt-2 hidden max-w-xl truncate text-xs text-muted-foreground sm:block">{movie.reason}</p></div>
              <button type="button" onClick={() => setExpanded(isOpen ? null : movie.id)} aria-expanded={isOpen} data-testid={`button-expand-reason-${movie.id}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{isOpen ? <ChevronUp size={17} /> : <ChevronDown size={17} />}</button>
            </div>
            {isOpen && <div className="border-t border-border/70 px-4 pb-5 pt-4 sm:ml-[6.25rem] sm:mr-5 sm:px-0"><div className="mb-3 font-mono-cinema text-[10px] uppercase tracking-[0.18em] text-primary">The reasoning</div><p className="max-w-2xl text-sm leading-6 text-muted-foreground">{movie.reason}</p><div className="mt-4 flex flex-wrap gap-2">{movie.genres.map((genre) => <span key={genre} className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">{genre}</span>)}<button type="button" onClick={() => setSelectedMovie(movie)} data-testid={`button-open-recommendation-${movie.id}`} className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">See film <ArrowRight size={13} /></button></div></div>}
          </article>
        );
      })}</div>
    </div>
  );
}

function WatchlistView() {
  const { watchlist, isLoaded } = useCinema();
  const savedMovies = movies.filter((movie) => watchlist.includes(movie.id));
  if (!isLoaded) return <LoadingState />;
  return (
    <div className="animate-rise-in">
      <PageIntro eyebrow="Saved for later" title="Your watchlist." description="A small, intentional queue for the nights when you want a good film without doing the work of finding one." />
      {savedMovies.length === 0 ? <EmptyState title="Your queue is wide open." description="Save films as you browse and they’ll collect here, ready for a night that needs a little direction." action={<Link href="/discover" data-testid="link-empty-watchlist" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Explore the catalogue <ArrowRight size={14} /></Link>} /> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{savedMovies.map((movie) => <SavedRow key={movie.id} movie={movie} />)}</div>}
    </div>
  );
}

function SavedRow({ movie }: { movie: Movie }) {
  const { setSelectedMovie } = useCinema();
  return (
    <article className="group flex gap-4 rounded-2xl border border-border bg-card p-3 transition-transform hover:-translate-y-0.5 hover:border-primary/40">
      <MoviePoster movie={movie} className="h-36 w-24 shrink-0 rounded-xl" />
      <div className="flex min-w-0 flex-1 flex-col py-1"><div className="flex items-start justify-between gap-2"><MovieMeta movie={movie} /><SaveButton movie={movie} compact /></div><p className="mt-3 line-clamp-3 text-xs leading-5 text-muted-foreground">{movie.reason}</p><button type="button" onClick={() => setSelectedMovie(movie)} data-testid={`button-watchlist-details-${movie.id}`} className="mt-auto inline-flex items-center gap-1 self-start text-xs font-semibold text-primary hover:underline">View details <ArrowRight size={13} /></button></div>
    </article>
  );
}

function RatingsView() {
  const { ratings, rateMovie, isLoaded } = useCinema();
  const ratedMovies = movies.filter((movie) => ratings[movie.id]);
  if (!isLoaded) return <LoadingState />;
  return (
    <div className="animate-rise-in">
      <PageIntro eyebrow="Your verdicts" title="Films you’ve felt." description="Your ratings tune the signal. The more honest you are, the more personal the next recommendation becomes." />
      {ratedMovies.length === 0 ? <EmptyState title="No verdicts yet." description="Open any film and leave a rating. Even a one-star opinion helps us understand your edges." action={<Link href="/discover" data-testid="link-empty-ratings" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Rate a film <ArrowRight size={14} /></Link>} /> : <div className="divide-y divide-border rounded-2xl border border-border bg-card">{ratedMovies.map((movie) => <div key={movie.id} className="flex items-center gap-4 p-4 sm:p-5"><MoviePoster movie={movie} className="h-20 w-14 shrink-0 rounded-lg" /><div className="min-w-0 flex-1"><MovieMeta movie={movie} /><div className="mt-3 flex items-center gap-1" aria-label={`Your rating: ${ratings[movie.id]} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" onClick={() => rateMovie(movie, star)} aria-label={`Rate ${movie.title} ${star} out of 5`} data-testid={`button-rate-${movie.id}-${star}`} className="p-0.5 text-primary transition-transform hover:scale-110"><Star size={17} fill={star <= ratings[movie.id] ? 'currentColor' : 'none'} /></button>)}</div></div><div className="hidden text-right sm:block"><div className="font-mono-cinema text-lg text-primary">{ratings[movie.id]}.0</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground">your rating</div></div></div>)}</div>}
    </div>
  );
}

function ProfileView() {
  const { ratings, watchlist, isLoaded, toggleTheme, theme } = useCinema();
  const signals = [
    { label: 'Quietly emotional', value: 82, color: 'bg-primary' },
    { label: 'Human-scale stories', value: 74, color: 'bg-accent' },
    { label: 'Moral grey areas', value: 61, color: 'bg-[#b79564]' },
  ];
  if (!isLoaded) return <LoadingState />;
  return (
    <div className="animate-rise-in">
      <PageIntro eyebrow="Your cinematic fingerprint" title="Taste, in progress." description="A living portrait of the stories you choose, the moods you return to, and the edges we’re still learning." />
      <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center gap-4 border-b border-border pb-7"><div className="grid h-16 w-16 place-items-center rounded-2xl bg-secondary font-display text-2xl text-secondary-foreground">AM</div><div><h2 className="font-display text-3xl">Alex Morgan</h2><p className="mt-1 text-xs text-muted-foreground">Member since October 2024 · private screening room</p></div></div>
          <div className="mt-7"><div className="mb-5 flex items-end justify-between"><div><div className="font-mono-cinema text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Current signals</div><h3 className="mt-2 font-display text-2xl">What pulls you in</h3></div><span className="font-mono-cinema text-[10px] text-primary">updated now</span></div><div className="space-y-5">{signals.map((signal) => <div key={signal.label}><div className="mb-2 flex justify-between text-xs"><span>{signal.label}</span><span className="font-mono-cinema text-muted-foreground">{signal.value}%</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${signal.color} transition-all duration-700`} style={{ width: `${signal.value}%` }} /></div></div>)}</div></div>
          <div className="mt-8 rounded-xl bg-muted/60 p-4"><div className="flex items-center gap-2 text-xs font-semibold"><Sparkles size={14} className="text-primary" /> The read</div><p className="mt-2 text-sm leading-6 text-muted-foreground">You prefer films that notice the small things. Your best matches are patient, visually confident, and leave a little room for you to finish the thought.</p></div>
        </section>
        <div className="space-y-5">
          <section className="rounded-2xl border border-border bg-card p-6"><div className="mb-5 flex items-center justify-between"><h2 className="font-display text-2xl">Your activity</h2><CircleUserRound size={17} className="text-muted-foreground" /></div><div className="grid grid-cols-2 gap-3"><div className="rounded-xl bg-muted p-4"><div className="font-display text-4xl">{Object.keys(ratings).length}</div><div className="mt-1 text-xs text-muted-foreground">films rated</div></div><div className="rounded-xl bg-secondary p-4"><div className="font-display text-4xl text-secondary-foreground">{watchlist.length}</div><div className="mt-1 text-xs text-secondary-foreground/70">in watchlist</div></div></div></section>
          <section className="rounded-2xl border border-border bg-card p-6"><div className="mb-5 flex items-center justify-between"><h2 className="font-display text-2xl">Room settings</h2><Settings2 size={17} className="text-muted-foreground" /></div><button type="button" onClick={toggleTheme} data-testid="button-profile-theme" className="flex w-full items-center justify-between rounded-xl border border-border px-3 py-3 text-left transition-colors hover:bg-muted"><span className="flex items-center gap-3 text-sm">{theme === 'light' ? <Moon size={16} /> : <Sun size={16} />} {theme === 'light' ? 'Use dark screening room' : 'Use light screening room'}</span><span className="text-xs text-muted-foreground">{theme}</span></button></section>
        </div>
      </div>
    </div>
  );
}

function MovieDetailModal() {
  const { selectedMovie, setSelectedMovie, watchlist, toggleWatchlist, ratings, rateMovie } = useCinema();
  if (!selectedMovie) return null;
  const movie = selectedMovie;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#1f1d2d]/70 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="presentation">
      <button type="button" onClick={() => setSelectedMovie(null)} aria-label="Close movie details" data-testid="button-close-movie-details" className="absolute inset-0 cursor-default" />
      <section role="dialog" aria-modal="true" aria-labelledby="movie-dialog-title" className="relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-[1.5rem] border border-border bg-card shadow-2xl sm:rounded-[1.5rem]">
        <button type="button" onClick={() => setSelectedMovie(null)} aria-label="Close details" data-testid="button-close-details" className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-card/80 text-muted-foreground backdrop-blur transition-colors hover:bg-muted hover:text-foreground"><X size={18} /></button>
        <div className="relative h-48 overflow-hidden sm:h-60"><img src={movie.backdrop} alt="" className="h-full w-full object-cover opacity-65" /><div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" /><div className="absolute bottom-5 left-5 right-16 sm:left-8"><MatchBadge score={movie.score} label={movie.matchLabel} /></div></div>
        <div className="grid gap-6 p-5 sm:grid-cols-[140px_1fr] sm:gap-7 sm:p-8">
          <MoviePoster movie={movie} className="hidden aspect-[2/3] w-full sm:block" />
          <div className="min-w-0"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 id="movie-dialog-title" className="font-display text-4xl leading-none">{movie.title}</h2><div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground"><span>{movie.year}</span><span>·</span><span>{movie.runtime}</span><span>·</span><span>{movie.director}</span></div></div><SaveButton movie={movie} /></div>
            {movie.industry && <div className="mt-4 rounded-xl bg-secondary/70 p-3"><div className="font-mono-cinema text-[9px] uppercase tracking-[0.16em] text-secondary-foreground/70">Regional cinema</div><div className="mt-1 text-sm font-semibold text-secondary-foreground">{movie.industry} <span className="font-normal">· {movie.language}</span></div><div className="mt-1 text-xs text-secondary-foreground/80">Industry region: {movie.cinemaRegions?.join(' and ')}</div></div>}
            <p className="mt-6 text-sm leading-7 text-muted-foreground">{movie.synopsis}</p><div className="mt-4 flex flex-wrap gap-2">{movie.genres.map((genre) => <span key={genre} className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">{genre}</span>)}</div><div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4"><div className="flex items-center gap-2 text-xs font-semibold text-primary"><Sparkles size={14} /> Why it matches you</div><p className="mt-2 text-sm leading-6 text-foreground/75">{movie.reason}</p></div><div className="mt-6 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="mb-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Your rating</div><div className="flex items-center gap-1">{[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" onClick={() => rateMovie(movie, star)} aria-label={`Rate ${movie.title} ${star} out of 5`} data-testid={`button-modal-rate-${movie.id}-${star}`} className="p-0.5 text-primary transition-transform hover:scale-110"><Star size={19} fill={star <= (ratings[movie.id] || 0) ? 'currentColor' : 'none'} /></button>)}</div></div><button type="button" onClick={() => toggleWatchlist(movie)} data-testid="button-modal-watchlist" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold transition-colors hover:border-primary hover:text-primary">{watchlist.includes(movie.id) ? <Check size={15} /> : <Plus size={15} />} {watchlist.includes(movie.id) ? 'Saved to watchlist' : 'Save to watchlist'}</button></div></div>
        </div>
      </section>
    </div>
  );
}

function LoadingState() {
  return <div className="space-y-7" aria-label="Loading CineMatch"><div className="h-7 w-32 animate-pulse rounded bg-muted" /><div className="h-64 animate-pulse rounded-[1.5rem] bg-muted sm:h-96" /><div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="aspect-[2/3] animate-pulse rounded-xl bg-muted" />)}</div></div>;
}

function EmptyState({ title, description, action }: { title: string; description: string; action: ReactNode }) {
  return <div className="cinema-grid flex min-h-[390px] flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 text-center"><div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-secondary-foreground"><Film size={23} /></div><h2 className="font-display text-3xl">{title}</h2><p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p><div className="mt-6">{action}</div></div>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><CinemaProvider><Shell /></CinemaProvider></ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;