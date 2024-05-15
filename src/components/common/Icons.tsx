interface iconProps {
  width?: string;
  height?: string;
}

export const IconSurvey = ({ width = "1", height = "1" }: iconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={`${width}em`}
      height={`${height}em`}
      viewBox="0 0 26 26"
    >
      <path
        fill="currentColor"
        d="M8.813 0A1 1 0 0 0 8 1v1H4.406C3.606 2 3 2.606 3 3.406V24.5c0 .9.606 1.5 1.406 1.5H21.5c.8 0 1.406-.606 1.406-1.406V3.406c.1-.8-.512-1.406-1.312-1.406H18V1a1 1 0 0 0-1-1H9a1 1 0 0 0-.094 0a1 1 0 0 0-.094 0zM10 2h6v2h-6zM5 4h3v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4h3v20H5zm2 5v4h4V9zm1 1h2v2H8zm5 0v2h6v-2zm-6 5v4h4v-4zm6 1v2h6v-2z"
      />
    </svg>
  );
};

export const IconHome = ({ width = "1", height = "1" }: iconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={`${width}em`}
      height={`${height}em`}
      viewBox="0 0 26 26"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          d="M22 22H2m0-11l4.063-3.25M22 11l-8.126-6.5a3 3 0 0 0-3.748 0l-.782.625M15.5 5.5v-2A.5.5 0 0 1 16 3h2.5a.5.5 0 0 1 .5.5v5M4 22V9.5m16 0v4m0 8.5v-4.5"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 22v-5c0-1.414 0-2.121-.44-2.56C14.122 14 13.415 14 12 14c-1.414 0-2.121 0-2.56.44M9 22v-5"
        />
        <path d="M14 9.5a2 2 0 1 1-4 0a2 2 0 0 1 4 0Z" />
      </g>
    </svg>
  );
};