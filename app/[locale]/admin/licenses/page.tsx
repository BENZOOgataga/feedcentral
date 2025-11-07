'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Key, Copy, Check, AlertTriangle, Shield } from 'lucide-react';

interface GeneratedKey {
  id: string;
  key: string;
  tier: string;
  duration: number;
  issuedAt: string;
}

export default function AdminLicensesPage() {
  const t = useTranslations();
  const { toast } = useToast();
  
  const [tier, setTier] = useState<'premium' | 'pro'>('premium');
  const [duration, setDuration] = useState<number>(365);
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [generatedKeys, setGeneratedKeys] = useState<GeneratedKey[]>([]);
  const [copiedKeys, setCopiedKeys] = useState<Set<string>>(new Set());

  const handleGenerate = async () => {
    try {
      setGenerating(true);

      const response = await fetch('/api/admin/licenses/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, duration, quantity, notes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate license keys');
      }

      setGeneratedKeys(data.keys);
      toast({
        title: 'Success',
        description: data.message,
      });

      // Reset form
      setNotes('');
      setQuantity(1);

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKeys(prev => new Set(prev).add(key));
      
      toast({
        title: 'Copied',
        description: 'License key copied to clipboard',
      });

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">License Key Generator</h1>
            <p className="text-sm text-muted-foreground">
              Admin-only: Generate premium license keys for this FeedCentral instance
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-yellow-500">Instance-Specific Keys</p>
            <p className="text-muted-foreground mt-1">
              License keys generated here are cryptographically bound to this specific FeedCentral instance.
              They <strong>cannot</strong> be used on other instances (including forks) due to instance-specific
              signing secrets and HMAC verification. Each deployment must generate its own keys.
            </p>
          </div>
        </div>

        {/* Generation Form */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Key className="h-5 w-5" />
            Generate New License Keys
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tier Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">License Tier</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as 'premium' | 'pro')}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                disabled={generating}
              >
                <option value="premium">Premium (50 custom sources)</option>
                <option value="pro">Pro (Unlimited sources)</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-2">Duration (days)</label>
              <Input
                type="number"
                min="1"
                max="3650"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 365)}
                disabled={generating}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {duration} days = {Math.round(duration / 30)} months = {Math.round(duration / 365)} year(s)
              </p>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <Input
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                disabled={generating}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">Notes (optional)</label>
              <Input
                type="text"
                placeholder="e.g., Patreon supporter batch #1"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={generating}
              />
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full"
          >
            {generating ? 'Generating...' : `Generate ${quantity} License Key${quantity > 1 ? 's' : ''}`}
          </Button>
        </div>

        {/* Generated Keys Display */}
        {generatedKeys.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Generated Keys</h2>
            <p className="text-sm text-muted-foreground">
              These keys have been saved to the database. Copy them now and distribute to users.
            </p>

            <div className="space-y-2">
              {generatedKeys.map((keyData) => (
                <div
                  key={keyData.id}
                  className="flex items-center gap-3 p-3 bg-muted/50 border border-border rounded-lg"
                >
                  <div className="flex-1 font-mono text-sm">
                    <div className="font-bold text-primary">{keyData.key}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {keyData.tier.toUpperCase()} • {keyData.duration} days • 
                      Issued: {new Date(keyData.issuedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(keyData.key)}
                  >
                    {copiedKeys.has(keyData.key) ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Information Panel */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-3">
          <h3 className="font-semibold">How License Keys Work</h3>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li>Keys are in format: <code className="bg-muted px-1 py-0.5 rounded">FEED-XXXX-XXXX-XXXX-XXXX</code></li>
            <li>Each key can only be redeemed once by a single user</li>
            <li>Keys are bound to this instance via HMAC-SHA256 signature</li>
            <li>Instance ID is derived from LICENSE_SIGNING_SECRET environment variable</li>
            <li>Attempting to use keys on a different instance (fork) will fail signature verification</li>
            <li>Duration is applied from the moment the key is redeemed, not generated</li>
            <li>Keys can be revoked by admins, which immediately downgrades the user</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
