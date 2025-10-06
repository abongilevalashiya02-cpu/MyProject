import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { setStoredVapidPublicKey } from '@/utils/vapid';

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const b64 = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  return b64;
}

async function generateVapidKeyPair(): Promise<{ publicKey: string; privateJwk: JsonWebKey }>{
  const keyPair = await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign', 'verify']
  );

  const publicJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey) as JsonWebKey;
  const privateJwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey) as JsonWebKey;

  // Construct uncompressed public key: 0x04 || x || y
  const x = Uint8Array.from(atob(publicJwk.x!.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
  const y = Uint8Array.from(atob(publicJwk.y!.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
  const uncompressed = new Uint8Array(65);
  uncompressed[0] = 0x04;
  uncompressed.set(x, 1);
  uncompressed.set(y, 33);

  const publicKey = base64UrlEncode(uncompressed);
  return { publicKey, privateJwk };
}

const VapidKeyGenerator: React.FC = () => {
  const { toast } = useToast();
  const [publicKey, setPublicKey] = useState('');
  const [privateJwk, setPrivateJwk] = useState<JsonWebKey | null>(null);

  const handleGenerate = async () => {
    try {
      const { publicKey, privateJwk } = await generateVapidKeyPair();
      setPublicKey(publicKey);
      setPrivateJwk(privateJwk);
      setStoredVapidPublicKey(publicKey);
      toast({ title: 'VAPID keys generated', description: 'Public key saved locally for subscriptions.' });
    } catch (e) {
      console.error(e);
      toast({ title: 'Generation failed', description: 'Could not generate VAPID keys.', variant: 'destructive' });
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copied', description: 'Copied to clipboard.' });
    } catch {}
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>VAPID Key Generator</CardTitle>
          <CardDescription>Generate a VAPID keypair for Web Push. Public key is saved locally; keep the private key secret (server-side only).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGenerate}>Generate Keypair</Button>
          {publicKey && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Public Key (Base64 URL)</label>
                <div className="flex gap-2 mt-1">
                  <Input readOnly value={publicKey} />
                  <Button variant="outline" onClick={() => handleCopy(publicKey)}>Copy</Button>
                </div>
              </div>
              {privateJwk && (
                <div>
                  <label className="text-sm font-medium">Private JWK (DO NOT SHARE)</label>
                  <div className="flex gap-2 mt-1">
                    <Input readOnly value={JSON.stringify(privateJwk)} />
                    <Button variant="outline" onClick={() => handleCopy(JSON.stringify(privateJwk))}>Copy</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VapidKeyGenerator;
