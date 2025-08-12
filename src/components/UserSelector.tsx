import React from 'react';
import { User, Users } from 'lucide-react';

export type UserProfile = 'user1' | 'user2';

interface UserSelectorProps {
  currentUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
  user1Name: string;
  user2Name: string;
}

export const UserSelector: React.FC<UserSelectorProps> = ({
  currentUser,
  onUserChange,
  user1Name,
  user2Name
}) => {
  return (
    <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
      <button
        onClick={() => onUserChange('user1')}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
          ${currentUser === 'user1' 
            ? 'bg-blue-500 text-white' 
            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
          }
        `}
        aria-label={`Switch to ${user1Name}'s profile`}
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">{user1Name}</span>
      </button>
      
      <button
        onClick={() => onUserChange('user2')}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
          ${currentUser === 'user2' 
            ? 'bg-purple-500 text-white' 
            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
          }
        `}
        aria-label={`Switch to ${user2Name}'s profile`}
      >
        <Users className="w-4 h-4" />
        <span className="hidden sm:inline">{user2Name}</span>
      </button>
    </div>
  );
};