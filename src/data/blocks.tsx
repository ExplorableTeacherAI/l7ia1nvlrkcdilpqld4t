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

// Helper component: Stacked Paper Layers Animation
const StackedPaperLayers = () => {
    const folds = useVar('folds', 10) as number;
    const paperThickness = 0.1; // mm
    const totalThickness = paperThickness * Math.pow(2, folds);
    const layers = Math.pow(2, folds);

    // Milestones with their heights in mm
    const milestones = [
        { height: 1.6, label: 'Fingernail', icon: '💅', color: '#3cc499' },
        { height: 12.8, label: 'Phone', icon: '📱', color: '#22d3ee' },
        { height: 1800, label: 'Person', icon: '🧍', color: '#60a5fa' },
        { height: 10000, label: 'House', icon: '🏠', color: '#818cf8' },
        { height: 400000, label: 'Skyscraper', icon: '🏙️', color: '#8b5cf6' },
        { height: 12000000, label: 'Airplane', icon: '✈️', color: '#a78bfa' },
        { height: 100000000, label: 'Space', icon: '🚀', color: '#f472b6' },
        { height: 384400000000, label: 'Moon', icon: '🌙', color: '#fbbf24' },
    ];

    // Format thickness for display
    const formatThickness = (mm: number) => {
        if (mm < 1000) return `${mm.toFixed(1)} mm`;
        if (mm < 1000000) return `${(mm / 1000).toFixed(1)} m`;
        if (mm < 1000000000) return `${(mm / 1000000).toFixed(1)} km`;
        return `${(mm / 1000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} km`;
    };

    // Calculate visual height (logarithmic scale for visualization)
    const maxVisualHeight = 280;
    const minLogHeight = Math.log10(0.1);
    const maxLogHeight = Math.log10(384400000000 * 1.5);
    const currentLogHeight = Math.log10(Math.max(totalThickness, 0.1));
    const visualHeight = ((currentLogHeight - minLogHeight) / (maxLogHeight - minLogHeight)) * maxVisualHeight;

    // Number of visible paper layers (max 16 for visual clarity)
    const visibleLayers = Math.min(layers, 16);
    const layerHeight = Math.max(visualHeight / visibleLayers, 2);

    // Generate colors for layers (alternating shades)
    const getLayerColor = (index: number) => {
        const colors = ['#f8fafc', '#e2e8f0', '#f1f5f9', '#e5e7eb'];
        return colors[index % colors.length];
    };

    // Find current milestone
    const getCurrentMilestone = () => {
        for (let i = milestones.length - 1; i >= 0; i--) {
            if (totalThickness >= milestones[i].height) {
                return milestones[i];
            }
        }
        return null;
    };

    const currentMilestone = getCurrentMilestone();

    return (
        <div className="w-full p-6 bg-white rounded-xl border border-border/40">
            {/* Header with current values */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="text-sm text-muted-foreground">Total thickness</div>
                    <div className="text-2xl font-bold" style={{ color: '#6366f1' }}>
                        {formatThickness(totalThickness)}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-muted-foreground">Paper layers</div>
                    <div className="text-2xl font-bold text-foreground">
                        {layers.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Main visualization area */}
            <div className="flex gap-8 items-end justify-center mb-6">
                {/* Paper stack */}
                <div className="relative flex flex-col-reverse items-center" style={{ minHeight: '300px' }}>
                    {/* Ground line */}
                    <div className="absolute bottom-0 w-32 h-0.5 bg-muted-foreground/30" />

                    {/* Stacked paper layers */}
                    <div
                        className="relative flex flex-col-reverse transition-all duration-500 ease-out"
                        style={{ height: `${Math.max(visualHeight, 10)}px` }}
                    >
                        {Array.from({ length: visibleLayers }).map((_, i) => (
                            <div
                                key={i}
                                className="w-24 border border-slate-300 shadow-sm transition-all duration-300"
                                style={{
                                    height: `${layerHeight}px`,
                                    minHeight: '2px',
                                    backgroundColor: getLayerColor(i),
                                    transform: `translateX(${(i % 2) * 2 - 1}px)`,
                                }}
                            />
                        ))}
                        {layers > 16 && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
                                +{(layers - 16).toLocaleString()} more layers
                            </div>
                        )}
                    </div>

                    {/* Label */}
                    <div className="mt-3 text-sm font-medium text-muted-foreground">
                        Paper Stack
                    </div>
                </div>

                {/* Comparison objects */}
                <div className="relative flex flex-col justify-end items-center" style={{ minHeight: '300px' }}>
                    {/* Milestone comparison bars */}
                    <div className="flex gap-3 items-end">
                        {milestones.slice(0, 6).map((milestone, i) => {
                            const milestoneLogHeight = Math.log10(milestone.height);
                            const milestoneVisualHeight = ((milestoneLogHeight - minLogHeight) / (maxLogHeight - minLogHeight)) * maxVisualHeight;
                            const isReached = totalThickness >= milestone.height;

                            return (
                                <div key={i} className="flex flex-col items-center">
                                    <div
                                        className="w-8 rounded-t transition-all duration-500"
                                        style={{
                                            height: `${Math.max(milestoneVisualHeight, 8)}px`,
                                            backgroundColor: isReached ? milestone.color : '#e5e7eb',
                                            opacity: isReached ? 1 : 0.4,
                                        }}
                                    />
                                    <div
                                        className="mt-2 text-lg transition-all duration-300"
                                        style={{
                                            opacity: isReached ? 1 : 0.3,
                                            transform: isReached ? 'scale(1.1)' : 'scale(1)',
                                        }}
                                    >
                                        {milestone.icon}
                                    </div>
                                    <div
                                        className="text-xs text-center mt-1 transition-all duration-300"
                                        style={{
                                            color: isReached ? milestone.color : '#9ca3af',
                                            fontWeight: isReached ? 600 : 400,
                                        }}
                                    >
                                        {milestone.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Current status message */}
            <div className="text-center p-4 rounded-lg bg-muted/30 border border-border/40">
                {currentMilestone ? (
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl">{currentMilestone.icon}</span>
                        <span className="text-foreground">
                            Your paper stack is now taller than a{' '}
                            <span className="font-semibold" style={{ color: currentMilestone.color }}>
                                {currentMilestone.label.toLowerCase()}
                            </span>!
                        </span>
                    </div>
                ) : (
                    <div className="text-muted-foreground">
                        Keep folding to reach the first milestone!
                    </div>
                )}
            </div>

            {/* Progress indicators */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
                {milestones.map((milestone, i) => {
                    const isReached = totalThickness >= milestone.height;
                    return (
                        <div
                            key={i}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all duration-300 ${
                                isReached
                                    ? 'bg-primary/10 text-foreground'
                                    : 'bg-muted/20 text-muted-foreground opacity-50'
                            }`}
                            style={{
                                borderLeft: isReached ? `3px solid ${milestone.color}` : '3px solid transparent',
                            }}
                        >
                            <span>{milestone.icon}</span>
                            <span className="font-medium">{milestone.label}</span>
                        </div>
                    );
                })}
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
            <StackedPaperLayers />
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
