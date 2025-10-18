'use client';

import { Button } from '@/components/ui/button';// Adjust path to your Button component
import { Download } from 'lucide-react'; // Adjust path to your Icon component

const DownloadCodeButton = ({ codeString, filename = "code.js" }) => {
  const handleDownload = () => {
    // Create a Blob from the code string
    const blob = new Blob([codeString], { type: 'text/plain' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor tag to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = filename; // Set the desired file name
    document.body.appendChild(a); // Append to the DOM
    a.click(); // Programmatically click the anchor
    document.body.removeChild(a); // Clean up and remove the anchor

    // Revoke the Blob URL to free up memory
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="btn-secondary flex-1"
      onClick={handleDownload}
    >
      <Download className="h-4 w-4 mr-1" />
      Download
    </Button>
  );
};

export default DownloadCodeButton;