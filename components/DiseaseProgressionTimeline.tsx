import React from 'react';

// A set of simple SVG icons to represent disease progression
const ProgressionStageIcon: React.FC<{ stage: number; totalStages: number }> = ({ stage, totalStages }) => {
    const severity = totalStages > 1 ? Math.min(Math.floor((stage / (totalStages - 1)) * 3), 3) : 0; // 0-3 severity scale

    const baseLeafPath = "M10 2a8 8 0 00-8 8c0 4.418 3.582 8 8 8s8-3.582 8-8a8 8 0 00-8-8z";
    const baseVeinPath = "M10 18V2m-5 5l5-5 5 5";
    
    let color = "#4ade80"; // green-400
    let spots: React.ReactNode[] = [];

    switch (severity) {
        case 0: // Early stage
            color = "#a3e635"; // lime-400
            spots.push(<circle key="s1" cx="12" cy="7" r="0.8" fill="#8b5cf6" />);
            break;
        case 1: // Mid stage
            color = "#facc15"; // yellow-400
            spots.push(<circle key="s1" cx="12" cy="7" r="1" fill="#7c2d12" />);
            spots.push(<circle key="s2" cx="8" cy="11" r="1.2" fill="#7c2d12" />);
            break;
        case 2: // Late stage
            color = "#fca5a5"; // red-300
            spots.push(<circle key="s1" cx="12" cy="7" r="1.2" fill="#4a044e" />);
            spots.push(<circle key="s2" cx="8" cy="11" r="1.5" fill="#4a044e" />);
            spots.push(<path key="s3" d="M14 13 L16 15" stroke="#4a044e" strokeWidth="1" />);
            break;
        case 3: // Critical stage
        default:
            color = "#9ca3af"; // gray-400
            spots.push(<circle key="s1" cx="12" cy="7" r="1.2" fill="#1e293b" />);
            spots.push(<circle key="s2" cx="8" cy="11" r="1.5" fill="#1e293b" />);
            spots.push(<circle key="s3" cx="14" cy="13" r="1.3" fill="#1e293b" />);
            spots.push(<path key="s4" d="M6 7 L4 5" stroke="#1e293b" strokeWidth="1" />);
            break;
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20">
            <path d={baseLeafPath} fill={color} />
            <path d={baseVeinPath} stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" fill="none" />
            {spots}
        </svg>
    );
};


interface DiseaseProgressionTimelineProps {
  stages: string[];
}

export const DiseaseProgressionTimeline: React.FC<DiseaseProgressionTimelineProps> = ({ stages }) => {
  return (
    <div className="flex items-start space-x-2 md:space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
      {stages.map((description, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center flex-shrink-0 w-28 md:w-32">
            <div className="relative p-2 bg-gray-100 rounded-full">
              <ProgressionStageIcon stage={index} totalStages={stages.length} />
              <div className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow">
                {index + 1}
              </div>
            </div>
            <p className="mt-2 text-xs text-center text-gray-600 font-medium">{description}</p>
          </div>
          
          {index < stages.length - 1 && (
            <div className="flex-grow h-px bg-indigo-200 mt-7"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
