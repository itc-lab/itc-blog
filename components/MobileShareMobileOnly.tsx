import useMobileDevice from '../hooks/useMobileDevice';
import MobileShare from './mobileShare';

interface Props {
  postTitle: string;
  siteTitle: string;
  className?: string;
}

const MobileShareMobileOnly = ({ postTitle, siteTitle, className }: Props) => {
  const [isMobileOrTablet] = useMobileDevice();

  if (!isMobileOrTablet) return null;

  return (
    <div className={className}>
      <MobileShare postTitle={postTitle} siteTitle={siteTitle} />
    </div>
  );
};

export default MobileShareMobileOnly;
