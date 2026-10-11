import { Button } from '../ui/index.js'
import { useToast } from '../../context/ToastContext.jsx'

/**
 * Share and Print for an open invoice.
 *
 * Share uses the native share sheet where there is one (phones, Safari) and
 * falls back to copying the link. Print is the browser's own dialog — the
 * shell is print:hidden, so only the sheet reaches the paper.
 */
export function DocActions({ title }) {
  const { toast } = useToast()

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }
      await navigator.clipboard.writeText(url)
      toast('Link copied to clipboard.')
    } catch (err) {
      // The user closing the share sheet is not an error worth a toast.
      if (err?.name !== 'AbortError') toast('Couldn’t share — copy the address bar instead.', 'warn')
    }
  }

  return (
    <>
      <Button variant="outline" icon="share" onClick={share}>
        Share
      </Button>
      <Button icon="print" onClick={() => window.print()}>
        Print
      </Button>
    </>
  )
}
