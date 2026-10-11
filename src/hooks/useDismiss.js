import { useEffect, useRef } from 'react'

/**
 * Closes a popover on outside click or Escape. Returns the ref to put on the
 * element that counts as "inside".
 *
 * `anchorRef` is a second inside element — the trigger of a panel portalled
 * elsewhere in the DOM, so a click on it toggles rather than closing and then
 * reopening.
 *
 * `onClose` is held in a ref so a fresh inline callback each render doesn't
 * re-bind the document listeners — otherwise every parent render would tear
 * down and re-add both listeners, and a mousedown landing in that gap would be
 * missed.
 */
export function useDismiss(open, onClose, anchorRef) {
  const ref = useRef(null)
  const closeRef = useRef(onClose)

  useEffect(() => {
    closeRef.current = onClose
  })

  useEffect(() => {
    if (!open) return

    const inside = (target) =>
      ref.current?.contains(target) || anchorRef?.current?.contains(target)
    const onPointer = (e) => !inside(e.target) && closeRef.current()
    const onKey = (e) => e.key === 'Escape' && closeRef.current()

    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, anchorRef])

  return ref
}
