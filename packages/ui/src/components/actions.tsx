import { Copy, LogOut, MessageCircle, RefreshCw } from 'lucide-react';
import { formatPlainText, whatsappShareUrl, type FetchResult } from '@biblio/core';
import { useCopy } from '../hooks/use-copy.js';

interface Props {
  result: FetchResult;
  isRefreshing: boolean;
  onRefresh: () => void;
  onSignOut: () => void;
}

const ICON_SIZE = 15;
const ICON_STROKE = 1.9;

export function Actions({ result, isRefreshing, onRefresh, onSignOut }: Props) {
  const { copied, copy } = useCopy();
  const text = formatPlainText(result);

  const refreshClass = isRefreshing ? 'icon-btn refreshing' : 'icon-btn';

  return (
    <>
      <button
        type="button"
        onClick={onRefresh}
        className={refreshClass}
        title="רענן"
        aria-label="refresh"
        disabled={isRefreshing}
      >
        <RefreshCw size={ICON_SIZE} strokeWidth={ICON_STROKE} />
      </button>
      <button
        type="button"
        onClick={() => copy(text)}
        className={`icon-btn ${copied ? 'flash' : ''}`}
        title={copied ? 'הועתק' : 'העתק טקסט'}
        aria-label="copy"
      >
        <Copy size={ICON_SIZE} strokeWidth={ICON_STROKE} />
      </button>
      <a
        href={whatsappShareUrl(text)}
        target="_blank"
        rel="noopener noreferrer"
        className="icon-btn"
        title="שלח בוואטסאפ"
        aria-label="whatsapp"
      >
        <MessageCircle size={ICON_SIZE} strokeWidth={ICON_STROKE} />
      </a>
      <button
        type="button"
        onClick={onSignOut}
        className="icon-btn"
        title="התנתק"
        aria-label="sign out"
      >
        <LogOut size={ICON_SIZE} strokeWidth={ICON_STROKE} />
      </button>
    </>
  );
}
