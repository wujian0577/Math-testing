
import React, { useState, useMemo } from 'react';
import { MathProblem, SolverStep } from './types';
import VennDiagram from './components/VennDiagram';
import { generateSimilarProblem } from './services/geminiService';

const INITIAL_PROBLEM: MathProblem = {
  title: "钢琴与小提琴",
  totalStudents: 49,
  setAName: "钢琴",
  setBName: "小提琴",
  countA: 30,
  countB: 28,
  countBoth: 13,
  description: "班里共有49名同学，会弹钢琴的有30名，会拉小提琴的有28名，两样都会的有13名，两样都不会的有多少名？"
};

const App: React.FC = () => {
  const [problem, setProblem] = useState<MathProblem>(INITIAL_PROBLEM);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const steps: SolverStep[] = useMemo(() => [
    { 
      key: 'TOTAL', 
      label: '1. 确定全班总数', 
      description: `首先，我们知道全班一共有 ${problem.totalStudents} 名同学。我们要在这个范围内找出“两样都不会”的人。` 
    },
    { 
      key: 'BOTH', 
      label: '2. 找出“重叠”的部分', 
      description: `题目说有 ${problem.countBoth} 名同学两样都会。这部分人在“会${problem.setAName}”和“会${problem.setBName}”的人群中都被算了一次。` 
    },
    { 
      key: 'ONLY_A', 
      label: `3. 计算“只会${problem.setAName}”的人`, 
      description: `会${problem.setAName}的总共有 ${problem.countA} 人，减去两样都会的 ${problem.countBoth} 人，剩下的就是只会${problem.setAName}的人。`,
      calculation: `${problem.countA} - ${problem.countBoth} = ${problem.countA - problem.countBoth}`
    },
    { 
      key: 'ONLY_B', 
      label: `4. 计算“只会${problem.setBName}”的人`, 
      description: `会${problem.setBName}的总共有 ${problem.countB} 人，减去两样都会的 ${problem.countBoth} 人，剩下的就是只会${problem.setBName}的人。`,
      calculation: `${problem.countB} - ${problem.countBoth} = ${problem.countB - problem.countBoth}`
    },
    { 
      key: 'UNION', 
      label: '5. 计算“至少会一样”的总人数', 
      description: `把只会${problem.setAName}的人、只会${problem.setBName}的人，以及两样都会的人加在一起。`,
      calculation: `${problem.countA - problem.countBoth} + ${problem.countB - problem.countBoth} + ${problem.countBoth} = ${problem.countA + problem.countB - problem.countBoth}`
    },
    { 
      key: 'RESULT', 
      label: '6. 得出最终答案', 
      description: `全班总人数减去“至少会一样”的人，就是剩下的“两样都不会”的人。`,
      calculation: `${problem.totalStudents} - ${problem.countA + problem.countB - problem.countBoth} = ${problem.totalStudents - (problem.countA + problem.countB - problem.countBoth)}`
    }
  ], [problem]);

  const handleNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const newProblem = await generateSimilarProblem();
      setProblem(newProblem);
      setCurrentStepIdx(0);
    } catch (error) {
      console.error("Failed to generate problem:", error);
      alert("生成新题目失败，可能是网络问题或 API 限制。");
    } finally {
      setIsLoading(false);
    }
  };

  const currentStep = steps[currentStepIdx];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12 flex flex-col items-center">
      <header className="max-w-5xl w-full flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span className="text-indigo-600">Math</span>Venn
          </h1>
          <p className="text-slate-500 font-medium">小学数学集合问题可视化交互系统</p>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-white border-2 border-slate-200 hover:border-indigo-400 hover:text-indigo-600 px-6 py-3 rounded-2xl font-bold shadow-sm transition-all flex items-center gap-3 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
          ) : "✨ 换一道新题目"}
        </button>
      </header>

      <main className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Visual and Task */}
        <div className="lg:col-span-7 space-y-6 flex flex-col">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-6 border border-white">
            <VennDiagram problem={problem} activeStep={currentStep.key} />
          </div>
          
          <div className="flex-grow bg-indigo-600 rounded-[2rem] p-8 text-white shadow-lg shadow-indigo-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 pointer-events-none">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
            </div>
            <h2 className="text-indigo-100 font-bold uppercase tracking-widest text-xs mb-3">当前挑战</h2>
            <p className="text-xl md:text-2xl font-medium leading-relaxed">
              {problem.description}
            </p>
          </div>
        </div>

        {/* Right Column: Step Control */}
        <div className="lg:col-span-5 flex flex-col bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 border border-white relative">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-800">解题步骤</h2>
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 w-6 rounded-full transition-all duration-300 ${i <= currentStepIdx ? 'bg-indigo-500' : 'bg-slate-100'}`}
                />
              ))}
            </div>
          </div>

          <div className="flex-grow">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black uppercase mb-3">
                STEP {currentStepIdx + 1}
              </span>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{currentStep.label}</h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                {currentStep.description}
              </p>
            </div>

            {currentStep.calculation && (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">算式</span>
                <div className="text-2xl font-mono font-bold text-indigo-600">
                  {currentStep.calculation}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-auto pt-6">
            <button
              onClick={handlePrev}
              disabled={currentStepIdx === 0}
              className="px-6 py-4 rounded-2xl font-black text-slate-400 hover:text-slate-600 transition-all disabled:opacity-0"
            >
              ← 返回
            </button>
            <button
              onClick={handleNext}
              className={`flex-1 py-4 rounded-2xl font-black shadow-lg transition-all ${
                currentStepIdx === steps.length - 1 
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
              } disabled:opacity-30`}
              disabled={currentStepIdx === steps.length - 1}
            >
              {currentStepIdx === steps.length - 1 ? '完成解析 🎉' : '下一步 →'}
            </button>
          </div>
        </div>
      </main>

      <footer className="mt-16 text-slate-400 font-medium text-center">
        <p>适合 3-6 年级学生的容斥原理可视化教学辅助工具</p>
      </footer>
    </div>
  );
};

export default App;
