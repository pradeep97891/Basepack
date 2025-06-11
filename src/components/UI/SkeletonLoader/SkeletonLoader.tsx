import styles from './SkeletonLoader.module.scss';

const SkeletonLoaderMenuItem = () => {
  return (
    <>
      <div className={`${styles['menu-img']} ${styles['skeleton']}`}></div>
      <div className={`${styles['menu-label']} ${styles['skeleton']}`}></div>
    </>
  );
};

export { SkeletonLoaderMenuItem };
