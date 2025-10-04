// using the new JSX transform; no default React import needed
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { User } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Profile">
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <img src={user.avatar || '/assets/avatars/default.svg'} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
          <div>
            <h3 className="text-lg font-semibold dark:text-slate-100">{user.firstName} {user.lastName}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{user.email}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 capitalize">{user.role}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-slate-700">Manage your profile information and preferences from here.</p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}

export default ProfileModal;
