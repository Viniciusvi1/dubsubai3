import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: PricingFeature[];
  popular?: boolean;
  buttonText: string;
  onSelectPlan: () => void;
}

export default function PricingCard({ 
  title, 
  price, 
  description, 
  features, 
  popular = false, 
  buttonText, 
  onSelectPlan 
}: PricingCardProps) {
  return (
    <div className={`price-card ${popular ? 'popular' : ''}`}>
      {popular && (
        <div className="absolute top-0 -right-3 bg-brand-blue text-white px-4 py-1 rounded-r-full text-sm font-medium">
          Popular
        </div>
      )}
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">{price}</span>
        {price !== "Gratuito" && <span className="text-gray-500">/mês</span>}
      </div>
      
      <p className="text-gray-600 mb-5">{description}</p>
      
      <ul className="space-y-3 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <span className={`flex-shrink-0 w-5 h-5 mr-2 ${feature.included ? 'text-brand-blue' : 'text-gray-300'}`}>
              <Check size={20} />
            </span>
            <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>{feature.text}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        onClick={onSelectPlan} 
        className={`w-full ${popular ? 'bg-brand-blue hover:bg-brand-blue-dark text-white' : 'bg-white border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white'}`}
        variant={popular ? 'default' : 'outline'} 
      >
        {buttonText}
      </Button>
    </div>
  );
}
