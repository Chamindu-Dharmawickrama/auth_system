import './SkeletonGrid.css'
/** Skeleton loading grid — 6 placeholder cards while notes are loading */
export function SkeletonGrid() {
   return (
      <div className="notes-grid">
         {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="skeleton-card">
               <div className="skeleton skeleton-title" style={{ marginBottom: 'var(--space-3)' }} />
               <div className="skeleton skeleton-text" style={{ width: '90%', marginBottom: 'var(--space-2)' }} />
               <div className="skeleton skeleton-text" style={{ width: '75%', marginBottom: 'var(--space-2)' }} />
               <div className="skeleton skeleton-text" style={{ width: '60%', marginBottom: 'var(--space-4)' }} />
               <div className="skeleton skeleton-text-short" />
            </div>
         ))}
      </div>
   );
}
