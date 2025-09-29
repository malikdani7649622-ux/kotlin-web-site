import React, { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Switcher from '@rescui/switcher';
import Checkbox from '@rescui/checkbox';
import { createTextCn } from '@rescui/typography';
import '@jetbrains/kotlin-web-site-ui/out/components/layout';
import styles from './case-studies-filter.module.css';
import { CasePlatform, CaseStudyType, CaseTypeSwitch, Platforms } from '../case-studies';


function parseType(maybeCaseType: unknown): CaseTypeSwitch {
    const maybeCaseTypeString = String(maybeCaseType || 'all');
    return (maybeCaseTypeString === 'multiplatform' || maybeCaseTypeString === 'server-side') ? maybeCaseTypeString : 'all';
}

function parsePlatforms(maybePlatforms: unknown): CasePlatform[] {
    if (!maybePlatforms) {
        return [...Platforms];
    }
    const list = String(maybePlatforms).split(',').map((x) => x.trim()).filter(Boolean);
    const set = new Set<CasePlatform>();
    for (const i of list) {
        if ((Platforms as readonly string[]).includes(i)) {
            set.add(i as CasePlatform);
        }
    }
    return set.size === 0 ? [...Platforms] : Array.from(set);
}

function parseCompose(v: unknown): boolean {
    if (v === true) return true;
    const s = String(v || 'true').toLowerCase();
    return s === 'true' || s === '1' || s === 'yes';
}

function buildQuery(type: CaseTypeSwitch, platforms: CasePlatform[], compose: boolean) {
    const q: Record<string, any> = {};
    if (type && type !== 'all') q.type = type;
    // only keep platforms if not all selected
    const allSelected = platforms.length === Platforms.length && Platforms.every((p) => platforms.includes(p));
    if (!allSelected && (type === 'multiplatform' || type === 'all')) {
        q.platforms = platforms.join(',');
    }
    if (type === 'multiplatform' || type === 'all') q.compose = compose ? 'true' : 'false';
    return q;
}

export const CaseStudiesFilter: React.FC = () => {
    const router = useRouter();
    const darkTextCn = createTextCn('dark');

    // Case study type switcher
    const typeOptions: Array<{value: CaseTypeSwitch, label: string}> = useMemo(
        () => [
            { value: 'all', label: 'All' },
            { value: 'multiplatform', label: 'Kotlin Multiplatform' },
            { value: 'server-side', label: 'Server-side' }
        ], []
    );

    // State synchronized with URL
    const [type, setType] = useState<CaseTypeSwitch>('all');
    const [platforms, setPlatforms] = useState<CasePlatform[]>([...Platforms]);
    const [compose, setCompose] = useState<boolean>(true);

    // Initialize/Sync from URL
    useEffect(() => {
        const q = router.query;
        const t = parseType(q.type);
        const p = parsePlatforms(q.platforms);
        const c = parseCompose(q.compose);
        setType(t);
        setPlatforms(p);
        setCompose(c);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.type, router.query.platforms, router.query.compose]);

    // Handlers update both state and URL (shallow)
    const pushQuery = useCallback((nextType: CaseTypeSwitch, nextPlatforms: CasePlatform[], nextCompose: boolean) => {
        const q = buildQuery(nextType, nextPlatforms, nextCompose);
        router.replace({ pathname: router.pathname, query: q }, undefined, { shallow: true });
    }, [router]);

    const onTypeChange = useCallback((value: string) => {
        const nextType = parseType(value);
        // When switching to server-side, we can keep platforms/compose but they won't be shown
        pushQuery(nextType, platforms, compose);
    }, [platforms, compose, pushQuery]);

    const togglePlatform = useCallback((id: CasePlatform) => {
        let next = platforms.includes(id) ? platforms.filter((x) => x !== id) : [...platforms, id];
        // If user unchecks all, reset to all selected
        if (next.length === 0) next = [...Platforms];
        pushQuery(type, next, compose);
    }, [platforms, type, compose, pushQuery]);

    const onComposeChange = useCallback(() => {
        const next = !compose;
        pushQuery(type, platforms, next);
    }, [compose, type, platforms, pushQuery]);

    // for accessibility ids
    const typeTitleId = useId();
    const codeSharedTitleId = useId();
    const uiTechTitleId = useId();

    const showKmpFilters = type === 'multiplatform' || type === 'all';

    return (
        <section data-testid="case-studies-filter" aria-label="Case Studies Filter" className={styles.wrapper}>
            <div className={'ktl-layout ktl-layout--center'}>
                <h2 className={styles.title}>
                    <span className={darkTextCn('rs-h4')}>Filters</span>
                </h2>
                <div className={styles.inner}>
                    {/* Case study type */}
                    <div className={`${styles.group} ${styles.groupType}`} role="group" aria-labelledby={typeTitleId}
                         data-test="filter-type">
                        <h3 id={typeTitleId} className={styles.groupTitle}><span className={darkTextCn('rs-h4')}>Case study type</span>
                        </h3>
                        <div className={styles.switcherSmall}>
                            <Switcher mode={'rock'} value={type} onChange={onTypeChange} options={typeOptions} />
                        </div>
                    </div>

                    {showKmpFilters && (
                        <div className={styles.group} role="group" aria-labelledby={codeSharedTitleId}
                             data-test="filter-code-shared">
                            <h3 id={codeSharedTitleId} className={styles.groupTitle}><span
                                className={darkTextCn('rs-h4')}>Code shared across</span></h3>
                            <div className={styles.checkboxes}>
                                {Platforms.map((pid) => {
                                    const checked = platforms.includes(pid);
                                    const label = pid === 'ios' ? 'iOS' : pid.charAt(0).toUpperCase() + pid.slice(1);
                                    return (
                                        <Checkbox
                                            key={pid}
                                            checked={checked}
                                            onChange={() => togglePlatform(pid)}
                                            mode="classic"
                                            size="m"
                                        >
                                            {label}
                                        </Checkbox>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {showKmpFilters && (
                        <div className={styles.group} role="group" aria-labelledby={uiTechTitleId}
                             data-test="filter-ui-technology">
                            <h3 id={uiTechTitleId} className={styles.groupTitle}><span className={darkTextCn('rs-h4')}>UI technology</span>
                            </h3>
                            <div className={styles.checkboxes}>
                                <Checkbox
                                    checked={compose}
                                    onChange={onComposeChange}
                                    mode="classic"
                                    size="m"
                                >
                                    Built with Compose Multiplatform
                                </Checkbox>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
