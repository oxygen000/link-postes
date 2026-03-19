import ContentLoader from "react-content-loader";

export default function PostSkeleton(props) {
  const skeletons = [1, 2, 3, 4];

  return (
    <div className="flex flex-col items-center space-y-6 mt-10 ">
      {skeletons.map((_, idx) => (
        <ContentLoader
          speed={2}
          key={idx}
          width={600}
          height={220}
          viewBox="0 0 476 124"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
          className="border border-border dark:border-border-dark rounded-lg p-4 w-full"
          {...props}
        >
          <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
          <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
          <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
          <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
          <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
          <circle cx="20" cy="20" r="20" />
        </ContentLoader>
      ))}
    </div>
  );
}
