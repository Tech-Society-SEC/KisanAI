import { Volume2, Save, ExternalLink, Share2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scheme } from '@/lib/types';
import { SpeechSynthesisService } from '@/lib/speech';

interface SchemeCardProps {
  data: Scheme;
  compact?: boolean;
  onSave?: () => void;
  onApply?: () => void;
}

const ttsService = new SpeechSynthesisService();

export function SchemeCard({ data, compact = false, onSave, onApply }: SchemeCardProps) {
  const handlePlayVoice = () => {
    const summary = `${data.title}. ${data.summary} Eligibility: ${data.eligibility.join(', ')}. How to apply: ${data.apply}`;
    ttsService.speak(summary);
  };

  if (compact) {
    return (
      <Card className="p-3 bg-card">
        <h4 className="font-semibold text-sm mb-1">{data.title}</h4>
        <p className="text-xs text-muted-foreground">{data.summary}</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-foreground">{data.title}</h3>
        <p className="text-sm text-muted-foreground">{data.summary}</p>
      </div>

      {/* Eligibility */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Eligibility</h4>
        <div className="flex flex-wrap gap-2">
          {data.eligibility.map((item, i) => (
            <Badge key={i} variant="secondary">{item}</Badge>
          ))}
        </div>
      </div>

      {/* Required documents */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Required Documents</h4>
        <ul className="space-y-1">
          {data.documents.map((doc, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="text-primary">•</span>
              <span>{doc}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* How to apply */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">How to Apply</h4>
        <p className="text-sm text-muted-foreground">{data.apply}</p>
      </div>

      {/* Contact */}
      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        <Phone className="h-4 w-4 text-primary" />
        <div>
          <p className="text-sm font-medium">Helpline</p>
          <p className="text-sm text-muted-foreground">{data.contact}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2">
        <Button onClick={handlePlayVoice} variant="outline" size="sm">
          <Volume2 className="h-4 w-4 mr-2" />
          Play Voice
        </Button>

        {onApply && (
          <Button onClick={onApply} variant="default" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Pre-fill Application
          </Button>
        )}

        {onSave && (
          <Button onClick={onSave} variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        )}

        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </Card>
  );
}
