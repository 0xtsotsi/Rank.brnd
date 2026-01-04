'use client';

/**
 * Test Upload Page
 *
 * This is a temporary test page to verify image upload functionality.
 * After verification, this page can be removed.
 */

import { useState } from 'react';
import Image from 'next/image';
import { uploadImage } from '@/lib/supabase/storage';

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const uploadResult = await uploadImage(file, {
        bucket: 'images',
        upsert: false,
      });

      setResult(uploadResult.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h1>Image Upload Test</h1>

      <form onSubmit={handleUpload}>
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="file"
            style={{ display: 'block', marginBottom: '10px' }}
          >
            Select an image:
          </label>
          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ display: 'block' }}
          />
        </div>

        {file && (
          <div style={{ marginBottom: '20px' }}>
            <p>
              <strong>Selected:</strong> {file.name}
            </p>
            <p>
              <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
            </p>
            <p>
              <strong>Type:</strong> {file.type}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={!file || uploading}
          style={{
            padding: '10px 20px',
            background: uploading ? '#ccc' : '#4F46E5',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: uploading ? 'not-allowed' : 'pointer',
          }}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>

      {error && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            background: '#FEE',
            border: '1px solid #FCC',
            borderRadius: '5px',
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            background: '#EFE',
            border: '1px solid #CFC',
            borderRadius: '5px',
          }}
        >
          <p>
            <strong>Success!</strong>
          </p>
          <p>
            <strong>Public URL:</strong>{' '}
            <a href={result} target="_blank" rel="noopener noreferrer">
              {result}
            </a>
          </p>
          <div style={{ marginTop: '10px' }}>
            <Image
              src={result}
              alt="Uploaded"
              width={800}
              height={300}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: '40px',
          padding: '15px',
          background: '#f5f5f5',
          borderRadius: '5px',
        }}
      >
        <h2>Test Instructions:</h2>
        <ol>
          <li>
            Ensure Supabase environment variables are set in{' '}
            <code>.env.local</code>
          </li>
          <li>
            Create a storage bucket named <code>images</code> in Supabase
          </li>
          <li>Select an image file (JPEG, PNG, GIF, WebP)</li>
          <li>Click &quot;Upload Image&quot;</li>
          <li>Verify the image is uploaded and displayed</li>
        </ol>
      </div>
    </div>
  );
}
