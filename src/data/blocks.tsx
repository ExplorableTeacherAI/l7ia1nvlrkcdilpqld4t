import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH1, EditableParagraph, InlineScrubbleNumber, InlineTooltip } from "@/components/atoms";

// Initialize variables and their colors from this file's variable definitions
import { useVariableStore, initializeVariableColors, useVar } from "@/stores";
import { getDefaultValues, variableDefinitions, getVariableInfo, numberPropsFromDefinition } from "./variables";
useVariableStore.getState().initialize(getDefaultValues());
initializeVariableColors(variableDefinitions);

// Helper component to compute and display the paper thickness
const PaperThickness = () => {
    const folds = useVar('folds', 10) as number;
    const paperThickness = 0.1; // mm
    const totalThickness = paperThickness * Math.pow(2, folds);

    // Format the thickness nicely
    const formatThickness = (mm: number) => {
        if (mm < 1000) return `${mm.toFixed(1)} mm`;
        if (mm < 1000000) return `${(mm / 1000).toFixed(1)} m`;
        if (mm < 1000000000) return `${(mm / 1000000).toFixed(1)} km`;
        return `${(mm / 1000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} km`;
    };

    const getComparison = (mm: number) => {
        if (mm < 10) return "thinner than your fingernail";
        if (mm < 100) return "about the thickness of a phone";
        if (mm < 1000) return "about the height of a water bottle";
        if (mm < 10000) return "taller than a house";
        if (mm < 100000) return "higher than a skyscraper";
        if (mm < 1000000) return "reaching into the clouds";
        if (mm < 10000000) return "past airplanes fly";
        if (mm < 100000000) return "into outer space";
        if (mm < 384400000000) return "heading toward the Moon";
        return "past the Moon! 🌙";
    };

    return (
        <span style={{ color: '#3cc499', fontWeight: 600 }}>
            {formatThickness(totalThickness)} — {getComparison(totalThickness)}
        </span>
    );
};

// Helper component: Exponential growth chart showing paper thickness
const ExponentialGrowthChart = () => {
    const folds = useVar('folds', 10) as number;
    const paperThickness = 0.1; // mm
    const totalThickness = paperThickness * Math.pow(2, folds);

    // Milestones with fold numbers where they're reached
    const milestones = [
        { folds: 4, label: 'Fingernail', icon: '💅', color: '#3cc499' },
        { folds: 7, label: 'Phone', icon: '📱', color: '#22d3ee' },
        { folds: 14, label: 'Tall person', icon: '🧍', color: '#60a5fa' },
        { folds: 17, label: 'House', icon: '🏠', color: '#818cf8' },
        { folds: 22, label: 'Skyscraper', icon: '🏙️', color: '#8b5cf6' },
        { folds: 27, label: 'Airplane', icon: '✈️', color: '#a78bfa' },
        { folds: 30, label: 'Space', icon: '🚀', color: '#f472b6' },
        { folds: 42, label: 'Moon', icon: '🌙', color: '#fbbf24' },
    ];

    // Format thickness for display
    const formatThickness = (mm: number) => {
        if (mm < 1000) return `${mm.toFixed(1)} mm`;
        if (mm < 1000000) return `${(mm / 1000).toFixed(1)} m`;
        if (mm < 1000000000) return `${(mm / 1000000).toFixed(1)} km`;
        return `${(mm / 1000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} km`;
    };

    // Chart dimensions
    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Scale functions
    const xMin = 0, xMax = 50;
    const yMin = -1, yMax = 13;
    const scaleX = (x: number) => margin.left + ((x - xMin) / (xMax - xMin)) * chartWidth;
    const scaleY = (y: number) => margin.top + chartHeight - ((y - yMin) / (yMax - yMin)) * chartHeight;

    // Generate curve path
    const pathPoints: string[] = [];
    for (let x = 0; x <= 50; x += 0.5) {
        const y = Math.log10(paperThickness * Math.pow(2, x));
        const px = scaleX(x);
        const py = scaleY(y);
        pathPoints.push(`${x === 0 ? 'M' : 'L'} ${px} ${py}`);
    }
    const curvePath = pathPoints.join(' ');

    // Current position
    const currentY = Math.log10(totalThickness);
    const currentPx = scaleX(folds);
    const currentPy = scaleY(currentY);

    // X-axis ticks (every 10)
    const xTicks = [0, 10, 20, 30, 40, 50];
    // Y-axis ticks (every 2)
    const yTicks = [0, 2, 4, 6, 8, 10, 12];

    return (
        <div className="w-full p-6 bg-white rounded-xl border border-border/40">
            {/* Header with current values */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="text-sm text-muted-foreground">Current thickness</div>
                    <div className="text-2xl font-bold" style={{ color: '#6366f1' }}>
                        {formatThickness(totalThickness)}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-muted-foreground">Layers of paper</div>
                    <div className="text-2xl font-bold text-foreground">
                        {Math.pow(2, folds).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Custom SVG Chart */}
            <div className="bg-white rounded-lg flex justify-center">
                <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ maxWidth: '100%', height: 'auto' }}>
                    {/* Grid lines */}
                    {yTicks.map(y => (
                        <line
                            key={`grid-y-${y}`}
                            x1={margin.left}
                            y1={scaleY(y)}
                            x2={width - margin.right}
                            y2={scaleY(y)}
                            stroke="#e5e7eb"
                            strokeDasharray="3,3"
                        />
                    ))}
                    {xTicks.map(x => (
                        <line
                            key={`grid-x-${x}`}
                            x1={scaleX(x)}
                            y1={margin.top}
                            x2={scaleX(x)}
                            y2={height - margin.bottom}
                            stroke="#e5e7eb"
                            strokeDasharray="3,3"
                        />
                    ))}

                    {/* Axes */}
                    <line x1={margin.left} y1={height - margin.bottom} x2={width - margin.right} y2={height - margin.bottom} stroke="#9ca3af" strokeWidth={1} />
                    <line x1={margin.left} y1={margin.top} x2={margin.left} y2={height - margin.bottom} stroke="#9ca3af" strokeWidth={1} />

                    {/* X-axis labels */}
                    {xTicks.map(x => (
                        <text
                            key={`x-label-${x}`}
                            x={scaleX(x)}
                            y={height - margin.bottom + 20}
                            textAnchor="middle"
                            fill="#6b7280"
                            fontSize={12}
                        >
                            {x}
                        </text>
                    ))}

                    {/* Y-axis labels */}
                    {yTicks.map(y => (
                        <text
                            key={`y-label-${y}`}
                            x={margin.left - 10}
                            y={scaleY(y) + 4}
                            textAnchor="end"
                            fill="#6b7280"
                            fontSize={12}
                        >
                            {y}
                        </text>
                    ))}

                    {/* Axis titles */}
                    <text x={width / 2} y={height - 8} textAnchor="middle" fill="#6b7280" fontSize={12}>
                        Number of folds
                    </text>
                    <text x={-height / 2 + 20} y={16} textAnchor="middle" fill="#6b7280" fontSize={12} transform="rotate(-90)">
                        Thickness (log₁₀ mm)
                    </text>

                    {/* Exponential curve */}
                    <path d={curvePath} fill="none" stroke="#6366f1" strokeWidth={3} strokeLinecap="round" />

                    {/* Vertical line at current position */}
                    <line
                        x1={currentPx}
                        y1={height - margin.bottom}
                        x2={currentPx}
                        y2={currentPy}
                        stroke="#f97316"
                        strokeWidth={2}
                        strokeDasharray="6,4"
                    />

                    {/* Milestone markers */}
                    {milestones.map((m, i) => {
                        const my = Math.log10(paperThickness * Math.pow(2, m.folds));
                        return (
                            <circle
                                key={i}
                                cx={scaleX(m.folds)}
                                cy={scaleY(my)}
                                r={6}
                                fill={m.color}
                                stroke="white"
                                strokeWidth={2}
                            />
                        );
                    })}

                    {/* Current position marker */}
                    <circle
                        cx={currentPx}
                        cy={currentPy}
                        r={8}
                        fill="#f97316"
                        stroke="white"
                        strokeWidth={2}
                    />
                </svg>
            </div>

            {/* Milestone legend */}
            <div className="border-t border-border/40 pt-4 mt-4">
                <div className="text-xs text-muted-foreground mb-3 text-center">Milestones on the journey:</div>
                <div className="flex flex-wrap justify-center gap-2">
                    {milestones.map((milestone, i) => {
                        const reached = folds >= milestone.folds;
                        return (
                            <div
                                key={i}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all duration-300 ${
                                    reached
                                        ? 'bg-primary/10 text-foreground scale-100 opacity-100'
                                        : 'bg-muted/30 text-muted-foreground scale-95 opacity-50'
                                }`}
                                style={{
                                    borderLeft: reached ? `3px solid ${milestone.color}` : '3px solid transparent',
                                }}
                            >
                                <span>{milestone.icon}</span>
                                <span className="font-medium">{milestone.label}</span>
                                <span className="text-xs opacity-70">({milestone.folds})</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

/**
 * ------------------------------------------------------------------
 * BLOCK CONFIGURATION
 * ------------------------------------------------------------------
 * This file is the entry point for your lesson content.
 * 
 * INSTRUCTIONS:
 * 1. Create your content using <Block> components.
 * 2. Use Layout components to organize your blocks.
 * 3. Add your blocks to the `blocks` array below.
 * 
 * ------------------------------------------------------------------
 * CROSS-BLOCK VARIABLES
 * ------------------------------------------------------------------
 * Variables can be shared across blocks using the global store.
 * 
 * DEFINE VARIABLES: src/data/variables.ts (use only variables.ts in this file; same structure as exampleBlocks + exampleVariables)
 * 
 * USAGE IN BLOCKS:
 * 
 * // Reading a value (auto-updates when changed):
 * import { useVar } from '@/stores';
 * const amplitude = useVar('amplitude', 1);
 * 
 * // Setting a value:
 * import { useSetVar } from '@/stores';
 * const setVar = useSetVar();
 * setVar('amplitude', 2.5);
 * 
 * // InlineScrubbleNumber (from variables.ts): getVariableInfo(name) + numberPropsFromDefinition(...)
 * <InlineScrubbleNumber varName="amplitude" {...numberPropsFromDefinition(getVariableInfo('amplitude'))} />
 * 
 * ------------------------------------------------------------------
 * AVAILABLE LAYOUTS
 * ------------------------------------------------------------------
 * 
 * 1. StackLayout
 *    - Best for: Title headers, introductory text, broad visualizations.
 *    - Usage:
 *      <StackLayout maxWidth="xl">
 *          <Block id="intro">...</Block>
 *      </StackLayout>
 * 
 * 2. SplitLayout
 *    - Best for: Side-by-side content (e.g., Text + Visualization).
 *    - Usage:
 *      <SplitLayout ratio="1:1" gap="lg">
 *          <Block id="left">...</Block>
 *          <Block id="right">...</Block>
 *      </SplitLayout>
 * 
 * 3. GridLayout
 *    - Best for: Multiple equal-sized items (cards, galleries).
 *    - Usage:
 *      <GridLayout columns={3} gap="md">
 *          <Block id="item-1">...</Block>
 *          <Block id="item-2">...</Block>
 *          <Block id="item-3">...</Block>
 *      </GridLayout>
 * 
 * 4. ScrollytellingLayout
 *    - Best for: Narrative steps with a reactive sticky visualization.
 *    - Usage:
 *      <ScrollytellingLayout varName="scrollStep" visualPosition="right">
 *          <ScrollStep><Block id="step-0">...</Block></ScrollStep>
 *          <ScrollStep><Block id="step-1">...</Block></ScrollStep>
 *          <ScrollVisual><Block id="viz">...</Block></ScrollVisual>
 *      </ScrollytellingLayout>
 * 
 * EXAMPLES:
 * See `src/data/exampleBlocks.tsx` for comprehensive examples.
 * 
 * NOTE: If you are seeing examples in the browser instead of this content,
 * check your .env file and set VITE_SHOW_EXAMPLES=false.
 */

export const blocks: ReactElement[] = [
    <StackLayout key="layout-paper-title" maxWidth="xl">
        <Block id="block-paper-title" padding="lg">
            <EditableH1 id="h1-paper-title" blockId="block-paper-title">
                The Paper Folding Paradox 📄
            </EditableH1>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-paper-intro" maxWidth="xl">
        <Block id="block-paper-intro" padding="sm">
            <EditableParagraph id="para-paper-intro" blockId="block-paper-intro">
                Here's a mind-bending fact: if you could fold a piece of paper in half{" "}
                <InlineScrubbleNumber
                    id="scrubble-folds"
                    varName="folds"
                    {...numberPropsFromDefinition(getVariableInfo('folds'))}
                />
                {" "}times, the stack would be{" "}
                <PaperThickness />
                . Each fold doubles the thickness — that's{" "}
                <InlineTooltip
                    id="tooltip-exponential"
                    tooltip="When something doubles repeatedly, it grows shockingly fast. This is called exponential growth."
                    color="#8b5cf6"
                >
                    exponential growth
                </InlineTooltip>
                {" "}in action. Try dragging the number above to see how quickly things escalate. At just 42 folds, you'd reach the Moon!
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-paper-chart" maxWidth="xl">
        <Block id="block-1772606539652" padding="md" hasVisualization>
            <ExponentialGrowthChart />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-math-history" maxWidth="xl">
        <Block id="block-1772607663338" padding="sm">
            <EditableParagraph id="para-math-history" blockId="block-1772607663338">
                The concept of exponential growth has fascinated mathematicians for centuries. Ancient Indian mathematicians explored similar ideas in the legend of the{" "}
                <InlineTooltip
                    id="tooltip-wheat-chessboard"
                    tooltip="A story where grains of wheat double on each square of a chessboard, resulting in more wheat than exists on Earth."
                    color="#f97316"
                >
                    wheat and chessboard problem
                </InlineTooltip>
                {" "}around the 6th century. Later, mathematicians like{" "}
                <InlineTooltip
                    id="tooltip-euler"
                    tooltip="Leonhard Euler (1707–1783) was a Swiss mathematician who made foundational contributions to exponential functions and the number e."
                    color="#6366f1"
                >
                    Leonhard Euler
                </InlineTooltip>
                {" "}formalized exponential functions, giving us the tools to understand everything from population growth to compound interest — and yes, paper folding!
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
