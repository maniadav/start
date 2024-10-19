import { convertBase64ToFile } from '@helper/binaryConvertion';
import useEyeFeatureExtractor from '@hooks/useEyeFeatureExtractor';
import { getIndexedDBValue, setIndexedDBValue } from '@utils/indexDB';
import { getLocalStorageValue } from '@utils/localStorage';
import { useState } from 'react';
import ZipToBase64 from './EyesBase64';

export function VideoProcessorComponent() {
  const { processVideo, processing } = useEyeFeatureExtractor();
  const [processingVideo, setProcessingVideo] = useState(false);

  const handleProcessVideo = async () => {
    setProcessingVideo(true);
    try {
      // const vidData = getLocalStorageValue('recordedVideo');
      const vidBase64Data: string =
        (await getIndexedDBValue('testing', 'eyeZipBase64')) || '';

      if (!vidBase64Data)
        throw new Error('No video data found in local storage');

      const eyeZipBase64 = await processVideo(vidBase64Data);

      if (!eyeZipBase64) throw new Error('No eyeZipBase64 data found');

      if (eyeZipBase64) {
        await setIndexedDBValue('testing', 'eyeZipBase64', eyeZipBase64);
      }
    } catch (error) {
      console.error('Error processing video:', error);
    } finally {
      setProcessingVideo(false);
    }
  };

  const handleDownload = async () => {
    try {
      const zipBase64Data: string =
        (await getIndexedDBValue('testing', 'eyeDetectionsZip')) || '';
      if (zipBase64Data) {
        const zipBlob = convertBase64ToFile(zipBase64Data, 'application/zip');
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'eye-detection.zip';
        link.click();
        URL.revokeObjectURL(url);
      } else {
        console.error('No zip data found in IndexedDB');
      }
    } catch (error) {
      console.error('Error downloading zip file:', error);
    }
  };

  return (
    <div className="w-full flex items-center justify-center gap-8">
      <button
        onClick={handleProcessVideo}
        disabled={processingVideo}
        className="bg-pink-800 text-white p-8"
      >
        {processingVideo ? 'Processing...' : 'Start Video Processing'}
      </button>
      <button
        onClick={handleDownload}
        disabled={processing}
        className="bg-pink-800 text-white p-8"
      >
        Download Data
      </button>
      {/* <div>Progress: {progress.toFixed(2)}%</div> */}
      <ZipToBase64 />
    </div>
  );
}
