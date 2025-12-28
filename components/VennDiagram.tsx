
import React from 'react';
import { MathProblem, StepKey } from '../types';

interface VennDiagramProps {
  problem: MathProblem;
  activeStep: StepKey;
}

const VennDiagram: React.FC<VennDiagramProps> = ({ problem, activeStep }) => {
  const { totalStudents, setAName, setBName, countA, countB, countBoth } = problem;
  
  const onlyA = countA - countBoth;
  const onlyB = countB - countBoth;
  const either = onlyA + onlyB + countBoth;
  const neither = totalStudents - either;

  // SVG dimensions
  const width = 500;
  const height = 350;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 100;
  const offset = 65;

  const leftCircleX = centerX - offset;
  const rightCircleX = centerX + offset;

  // Helper to determine region color based on active step
  const getFill = (region: StepKey) => {
    if (activeStep === 'RESULT' && region === 'RESULT') return '#fde68a66'; // Highlight "Neither" area
    if (activeStep === 'UNION' && (region === 'ONLY_A' || region === 'ONLY_B' || region === 'BOTH')) return '#818cf844';
    if (activeStep === region) return '#6366f133';
    return 'transparent';
  };

  const isHighlighted = (region: StepKey) => {
    if (activeStep === 'RESULT') return true;
    if (activeStep === 'UNION') return ['ONLY_A', 'ONLY_B', 'BOTH'].includes(region);
    return activeStep === region;
  };

  return (
    <div className="relative w-full max-w-xl mx-auto bg-white rounded-2xl shadow-inner p-4 overflow-hidden border border-slate-100">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto drop-shadow-sm">
        <defs>
          <clipPath id="clipLeft">
            <circle cx={leftCircleX} cy={centerY} r={radius} />
          </clipPath>
          <clipPath id="clipRight">
            <circle cx={rightCircleX} cy={centerY} r={radius} />
          </clipPath>
        </defs>

        {/* Background Rectangle (The "Total" box) */}
        <rect
          x="10" y="10" width={width - 20} height={height - 20}
          rx="20"
          fill={activeStep === 'TOTAL' ? '#f1f5f9' : (activeStep === 'RESULT' ? '#fffbeb' : '#fafafa')}
          stroke={activeStep === 'TOTAL' || activeStep === 'RESULT' ? '#cbd5e1' : '#e2e8f0'}
          strokeWidth="3"
          className="transition-colors duration-500"
        />

        {/* Region: ONLY A */}
        <circle
          cx={leftCircleX} cy={centerY} r={radius}
          fill={activeStep === 'SET_A' || activeStep === 'ONLY_A' || activeStep === 'UNION' || activeStep === 'RESULT' ? '#3b82f615' : 'transparent'}
          className="transition-all duration-500"
        />

        {/* Region: ONLY B */}
        <circle
          cx={rightCircleX} cy={centerY} r={radius}
          fill={activeStep === 'SET_B' || activeStep === 'ONLY_B' || activeStep === 'UNION' || activeStep === 'RESULT' ? '#ef444415' : 'transparent'}
          className="transition-all duration-500"
        />

        {/* Region: BOTH (Intersection) */}
        <g clipPath="url(#clipLeft)">
          <circle
            cx={rightCircleX} cy={centerY} r={radius}
            fill={activeStep === 'BOTH' || activeStep === 'UNION' || activeStep === 'RESULT' || activeStep === 'SET_A' || activeStep === 'SET_B' ? '#8b5cf633' : 'transparent'}
            className="transition-all duration-500"
          />
        </g>

        {/* Outlines */}
        <circle
          cx={leftCircleX} cy={centerY} r={radius}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={activeStep === 'SET_A' || activeStep === 'ONLY_A' ? '4' : '2'}
          strokeDasharray={activeStep === 'ONLY_A' ? "5,5" : "0"}
          className="transition-all duration-500"
        />
        <circle
          cx={rightCircleX} cy={centerY} r={radius}
          fill="none"
          stroke="#ef4444"
          strokeWidth={activeStep === 'SET_B' || activeStep === 'ONLY_B' ? '4' : '2'}
          strokeDasharray={activeStep === 'ONLY_B' ? "5,5" : "0"}
          className="transition-all duration-500"
        />

        {/* Numeric Labels */}
        <g className="font-bold text-lg select-none">
          {/* Only A */}
          <text x={leftCircleX - 45} y={centerY} textAnchor="middle" className={`transition-opacity duration-300 ${['ONLY_A', 'UNION', 'RESULT'].includes(activeStep) ? 'opacity-100 fill-blue-700' : 'opacity-20'}`}>
            {onlyA}
          </text>
          
          {/* Both */}
          <text x={centerX} y={centerY} textAnchor="middle" className={`transition-opacity duration-300 ${['BOTH', 'UNION', 'RESULT', 'SET_A', 'SET_B'].includes(activeStep) ? 'opacity-100 fill-purple-700' : 'opacity-20'}`}>
            {countBoth}
          </text>
          
          {/* Only B */}
          <text x={rightCircleX + 45} y={centerY} textAnchor="middle" className={`transition-opacity duration-300 ${['ONLY_B', 'UNION', 'RESULT'].includes(activeStep) ? 'opacity-100 fill-red-700' : 'opacity-20'}`}>
            {onlyB}
          </text>

          {/* Neither */}
          <text x={60} y={60} className={`text-2xl transition-all duration-500 ${activeStep === 'RESULT' ? 'opacity-100 scale-125 fill-amber-600' : 'opacity-0 scale-50'}`}>
            {neither}
          </text>
        </g>

        {/* Text Labels */}
        <text x={leftCircleX} y={centerY - radius - 15} textAnchor="middle" className="text-sm font-black fill-blue-600 uppercase tracking-wide">
          {setAName} ({countA})
        </text>
        <text x={rightCircleX} y={centerY - radius - 15} textAnchor="middle" className="text-sm font-black fill-red-600 uppercase tracking-wide">
          {setBName} ({countB})
        </text>
        
        <text x={width - 30} y={height - 30} textAnchor="end" className="text-xs font-bold fill-slate-400">
          全班总计: {totalStudents}
        </text>

        {activeStep === 'RESULT' && (
          <text x={60} y={85} className="text-[10px] font-bold fill-amber-500 uppercase">
            都不参加的学生人数
          </text>
        )}
      </svg>
    </div>
  );
};

export default VennDiagram;
