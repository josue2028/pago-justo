import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Wallet } from 'lucide-react';
import { Button, Card } from '@core/ui';

export function HeroSection(): JSX.Element {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-16 text-white shadow-card md:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(30,111,217,0.4),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(244,166,42,0.32),_transparent_30%)]" />
      <div className="relative grid gap-8 md:grid-cols-[1.3fr_0.9fr] md:items-center">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
            Calculos laborales claros para Colombia
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Seguridad social, parafiscales y prestaciones sin hojas de calculo fragiles.
            </h1>
            <p className="max-w-2xl text-base text-slate-200 md:text-lg">
              Pago Justo te guia paso a paso y desglosa cada valor con contexto legal simple.
            </p>
          </div>
          <Button
            asChild
            variant="secondary"
          >
            <Link to="/calculadora">
              Empezar calculo
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
        <Card className="grid gap-4 bg-white/95 text-brand-text">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 size-5 text-brand-blue" />
            <div>
              <p className="font-semibold">Normativa trazable</p>
              <p className="text-sm text-brand-muted">Referencias legales visibles y tarifas 2024 centralizadas.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Wallet className="mt-1 size-5 text-brand-yellow" />
            <div>
              <p className="font-semibold">Exporta y presenta</p>
              <p className="text-sm text-brand-muted">Genera PDF y revisa cada rubro con una distribucion visual clara.</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
