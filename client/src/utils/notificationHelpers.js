import { FaBell, FaEnvelope, FaComment, FaCalendarAlt } from 'react-icons/fa';

const TYPE_ICON_COMPONENTS = {
  message_request:  FaEnvelope,
  incoming_message: FaComment,
  event_update:     FaCalendarAlt,
  session_reminder: FaBell,
};

export function getTypeIcon(type, size = 16) {
  const Icon = TYPE_ICON_COMPONENTS[type] || FaBell;
  return <Icon size={size} />;
}

export function relativeTime(dateStr) {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
