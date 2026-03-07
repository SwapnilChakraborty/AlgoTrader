import { Bell, Search, User, Zap } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export async function Navbar() {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    return (
        <header className="h-16 bg-black border-b border-zinc-900 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 shadow-2xl">
            <div className="flex items-center gap-4">
                {/* Mobile Logo visibility */}
                <Link href="/dashboard" className="lg:hidden flex items-center group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-700 flex items-center justify-center mr-2 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                        <Zap className="w-5 h-5 text-black" />
                    </div>
                </Link>

                <div className="hidden md:flex items-center bg-zinc-900/50 rounded-full px-5 py-2 w-64 lg:w-72 border border-zinc-800 focus-within:border-gold/50 transition-all duration-500 shadow-inner">
                    <Search className="w-4 h-4 text-zinc-500 mr-3" />
                    <input
                        type="text"
                        placeholder="Search market alpha..."
                        className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-zinc-600 font-medium italic"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
                <button className="p-2 text-zinc-400 hover:text-gold transition-all relative group">
                    <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full shadow-[0_0_10px_#D4AF37]"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">{user?.role === 'ADMIN' ? 'Root Access' : 'Elite Status'}</p>
                        <p className="text-xs font-bold text-white tracking-tight truncate max-w-[120px]">
                            {user?.name || user?.email?.split('@')[0] || 'Member'}
                        </p>
                    </div>
                    <Link href="/settings">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center cursor-pointer border border-zinc-800 shadow-xl hover:border-gold/30 hover:scale-105 transition-all group/avatar overflow-hidden">
                            {user?.name ? (
                                <span className="text-zinc-400 font-black text-sm group-hover/avatar:text-gold uppercase">{user.name.charAt(0)}</span>
                            ) : (
                                <User className="w-5 h-5 text-zinc-500 group-hover/avatar:text-gold" />
                            )}
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
}

