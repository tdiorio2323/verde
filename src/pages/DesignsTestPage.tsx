import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabaseClient";

type FileInfo = {
  name: string;
  metadata?: { size?: number } | null;
};

const DesignsTestPage = () => {
  const [status, setStatus] = useState("Loading...");
  const [files, setFiles] = useState<FileInfo[]>([]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus("Testing Supabase connection...");
        
        // Test basic connection
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        if (bucketsError) {
          setStatus(`Bucket list error: ${bucketsError.message}`);
          return;
        }

        setStatus(`Found ${buckets?.length || 0} buckets`);
        
        // Test designs bucket
        const { data: files, error: filesError } = await supabase.storage
          .from("designs")
          .list("", { limit: 10 });

        if (filesError) {
          setStatus(`Files list error: ${filesError.message}`);
          return;
        }

        setFiles(files || []);
        setStatus(`Success! Found ${files?.length || 0} files in designs bucket`);
        
      } catch (error) {
        setStatus(`Unexpected error: ${error}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Designs Test Page</h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Connection Status</h2>
          <p className="text-white">{status}</p>
        </div>

        {files.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Files Found</h2>
            <ul className="text-white space-y-2">
              {files.map((file, index) => (
                <li key={index} className="text-sm">
                  {file.name} ({file.metadata?.size ? `${Math.round(file.metadata.size / 1024)} KB` : 'Unknown size'})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignsTestPage;