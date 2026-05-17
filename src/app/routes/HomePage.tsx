import { Link } from 'react-router-dom';
import { Calculator } from 'lucide-react';
import { HeroSection } from '@modules/landing';
import { Button, Card } from '@shared/ui';

export default function HomePage(): JSX.Element {
  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-6">
      <HeroSection />
      <section className="mx-auto max-w-2xl">
        <Card className="space-y-3">
          <Calculator className="size-6 text-brand-blue" />
          <h2 className="text-xl font-semibold">Wizard de 4 pasos</h2>
          <p className="text-sm text-brand-muted">
            Define el tipo de vinculacion, ingresa los datos y obten el desglose completo en una experiencia mas directa.
          </p>
          <Button asChild>
            <Link to="/calculadora">Abrir calculadora</Link>
          </Button>
        </Card>
      </section>
    </main>
  );
}
