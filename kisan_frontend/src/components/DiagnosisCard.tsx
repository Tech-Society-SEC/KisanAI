import { Volume2, Save, ExternalLink, Share2, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DiagnosisResult } from '@/lib/types';
import { SpeechSynthesisService } from '@/lib/speech';
import { cn } from '@/lib/utils';

interface DiagnosisCardProps {
  data: DiagnosisResult;
  compact?: boolean;
  onSave?: () => void;
  onExpert?: () => void;
}

const ttsService = new SpeechSynthesisService();

export function DiagnosisCard({ data, compact = false, onSave, onExpert }: DiagnosisCardProps) {
  const confidencePercent = Math.round(data.confidence * 100);
  
  const getConfidenceBadge = () => {
    if (data.status === 'high') {
      return <Badge className="bg-success"><CheckCircle className="h-3 w-3 mr-1" /> High Confidence</Badge>;
    }
    if (data.status === 'medium') {
      return <Badge className="bg-warning"><AlertTriangle className="h-3 w-3 mr-1" /> Medium</Badge>;
    }
    return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Low Confidence</Badge>;
  };

  const getStatusText = () => {
    if (data.status === 'high') return "We're quite sure — here's what to do";
    if (data.status === 'medium') return "Likely diagnosis — follow advice and monitor";
    return "Low confidence — do you want to send this to an expert?";
  };

  const handlePlayVoice = () => {
    const summary = `Diagnosis: ${data.disease}, confidence ${confidencePercent}%. Advice — ${data.advice.join('. ')}.`;
    ttsService.speak(summary);
  };

  if (compact) {
    return (
      <Card className="p-3 bg-card">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-semibold">{data.disease}</h4>
            <p className="text-xs text-muted-foreground">{data.scientific}</p>
          </div>
          {getConfidenceBadge()}
        </div>
        <ul className="text-xs space-y-1">
          {data.advice.map((item, i) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      {/* Image preview */}
      {data.image && (
        <img 
          src={data.image} 
          alt="Diagnosed crop" 
          className="w-full h-48 object-cover rounded-lg"
        />
      )}

      {/* Disease info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-foreground">{data.disease}</h3>
            <p className="text-sm text-muted-foreground">{data.scientific}</p>
          </div>
          {getConfidenceBadge()}
        </div>

        {/* Confidence meter */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Confidence</span>
            <span className="font-semibold">{confidencePercent}%</span>
          </div>
          <Progress 
            value={confidencePercent} 
            className={cn(
              "h-2",
              data.status === 'high' && "[&>div]:bg-success",
              data.status === 'medium' && "[&>div]:bg-warning",
              data.status === 'low' && "[&>div]:bg-destructive"
            )}
          />
        </div>

        <p className="text-sm text-muted-foreground">{getStatusText()}</p>
      </div>

      {/* Treatment advice */}
      <div className="space-y-2">
        <h4 className="font-semibold">Treatment Advice</h4>
        <ul className="space-y-2">
          {data.advice.map((item, index) => (
            <li key={index} className="flex gap-2 text-sm">
              <span className="text-primary font-bold">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Alternatives */}
      {data.alternatives && data.alternatives.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <p>Also considered: {data.alternatives.map(a => a.disease).join(', ')}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2">
        <Button onClick={handlePlayVoice} variant="outline" size="sm">
          <Volume2 className="h-4 w-4 mr-2" />
          Play Voice
        </Button>
        
        {onSave && (
          <Button onClick={onSave} variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        )}

        {data.status === 'low' && onExpert && (
          <Button onClick={onExpert} variant="default" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Ask Expert
          </Button>
        )}

        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Detected at {new Date(data.timestamp).toLocaleString()}
      </p>
    </Card>
  );
}
