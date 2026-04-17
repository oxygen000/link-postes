import { CircularProgress } from "react-loader-spinner";

export default function LoadingSpinner() {
  return (
    <>
      <div className="flex  items-center justify-center">
        <CircularProgress
          height="100"
          width="100"
          color="#3c6fc2"
          ariaLabel="circular-progress-loading"
          wrapperStyle={{}}
          wrapperClass="wrapper-class"
          visible={true}
          strokeWidth={2}
          animationDuration={1}
        />
      </div>
    </>
  );
}
