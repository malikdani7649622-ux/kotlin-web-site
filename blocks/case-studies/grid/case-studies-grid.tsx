import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import caseStudiesDataRaw from '../../../data/case-studies/case-studies.yml';
import { CaseStudyCard } from '../card/case-studies-card';
import styles from './case-studies-grid.module.css';
import type { CaseStudyItem } from '../case-studies';

const ALL_PLATFORMS = ['android', 'ios', 'desktop', 'frontend', 'backend'] as const;
type PlatformFilter = typeof ALL_PLATFORMS[number];

type TypeFilter = 'all' | 'kotlin-multiplatform' | 'server-side';

function parseType(v: unknown): TypeFilter {
  const s = String(v || 'all');
  return (s === 'kotlin-multiplatform' || s === 'server-side') ? (s as TypeFilter) : 'all';
}

function parsePlatforms(v: unknown): PlatformFilter[] {
  if (!v) return [...ALL_PLATFORMS];
  const list = String(v).split(',').map((x) => x.trim()).filter(Boolean);
  const set = new Set<PlatformFilter>();
  for (const i of list) {
    if ((ALL_PLATFORMS as readonly string[]).includes(i)) set.add(i as PlatformFilter);
  }
  return set.size === 0 ? [...ALL_PLATFORMS] : Array.from(set);
}

function parseCompose(v: unknown): boolean {
  if (v === true) return true;
  const s = String(v || 'true').toLowerCase();
  return s === 'true' || s === '1' || s === 'yes';
}

export const CaseStudiesGrid: React.FC = () => {
  const router = useRouter();

  const type = parseType(router.query.type);
  const platforms = parsePlatforms(router.query.platforms);
  const compose = parseCompose(router.query.compose);

  const items = useMemo(() => {
    const source: CaseStudyItem[] = caseStudiesDataRaw.items as any;
    return source.filter((it) => {
      // Map filter type to item types
      const isMp = it.type === 'multiplatform';
      const isSs = it.type === 'server-side';

      if (type === 'server-side') return isSs;
      if (type === 'kotlin-multiplatform') {
        // Only multiplatform items with filters applied
        if (!isMp) return false;
        // Compose filter
        if (compose && !(it.platforms || []).includes('compose-multiplatform')) return false;
        // Platform filter applies only to MP: must intersect
        const intersects = (it.platforms || []).some((p: string) => (platforms as string[]).includes(p));
        return intersects;
      }
      // type === 'all': include server-side as is; apply filters to MP only
      if (isSs) return true;
      // MP item: apply compose + platforms
      if (compose && !(it.platforms || []).includes('compose-multiplatform')) return false;
      const intersects = (it.platforms || []).some((p: string) => (platforms as string[]).includes(p));
      return intersects;
    });
  }, [type, platforms, compose]);

  return (
    <section data-testid="case-studies-grid" aria-label="Case Studies Grid">
      <h2>Case studies</h2>
      <div role="list" className={styles['masonry-tiles-container']}>
        {items.map((it) => (
          <div
            key={it.id}
            role="listitem"
            className={styles['masonry-tile']}
          >
            <CaseStudyCard item={{ ...it }} />
          </div>
        ))}
      </div>
    </section>
  );
};