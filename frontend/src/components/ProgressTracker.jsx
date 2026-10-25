import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useDestination } from '../context/DestinationContext';

const ProgressTracker = ({ currentStep = 1 }) => {
  const navigate = useNavigate();
  const { selectedDestination, selectedPlace } = useDestination();

  const steps = [
    {
      id: 1,
      title: 'Select Destination',
      description: 'Choose a tourist place to explore.',
      route: '/destinations',
      canNavigate: true
    },
    {
      id: 2,
      title: 'Nearby Tourist Places',
      description: 'Explore nearby tourist places.',
      route: '/nearby-places',
      canNavigate: !!selectedDestination
    },
    {
      id: 3,
      title: 'Nearby Hotels',
      description: 'Find hotels near your destination.',
      route: '/hotels',
      canNavigate: !!selectedDestination || !!selectedPlace
    }
  ];

  const handleStepClick = (step) => {
    if (step.canNavigate && step.id !== currentStep) {
      navigate(step.route);
    }
  };

  return (
    <div className="w-full bg-white border-b border-slate-300 py-6 mb-8">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between relative">
          
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            const isClickable = step.canNavigate && !isActive;

            return (
              <React.Fragment key={step.id}>
                {/* Step Item */}
                <div 
                  onClick={() => isClickable && handleStepClick(step)}
                  className={`flex items-center gap-3 sm:gap-4 transition-all ${
                    isClickable ? 'cursor-pointer group' : 'cursor-default'
                  }`}
                >
                  {/* Circle */}
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-base transition-all shadow-xs ${
                      isActive
                        ? 'bg-emerald-700 text-white ring-4 ring-emerald-100'
                        : isCompleted
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : step.id}
                  </div>

                  {/* Text */}
                  <div className="hidden sm:block text-left">
                    <p
                      className={`text-base font-bold tracking-tight transition-colors ${
                        isActive
                          ? 'text-emerald-800'
                          : isCompleted
                          ? 'text-slate-900 group-hover:text-emerald-700'
                          : 'text-slate-700'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-sm text-slate-600 font-medium mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connecting Line between steps */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-3 sm:mx-6 h-1 relative bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        currentStep > step.id ? 'bg-emerald-700 w-full' : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
