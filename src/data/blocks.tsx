import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH1, EditableParagraph, InlineScrubbleNumber, InlineTooltip, Cartesian2D } from "@/components/atoms";

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

    // Current position on log scale
    const currentY = Math.log10(totalThickness);

    // Create milestone point plots
    const milestonePointPlots = milestones
        .filter(m => m.folds <= 50)
        .map(m => ({
            type: 'point' as const,
            x: m.folds,
            y: Math.log10(paperThickness * Math.pow(2, m.folds)),
            color: m.color,
        }));

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

            {/* Axis labels */}
            <div className="text-center text-xs text-muted-foreground mb-1">
                Thickness (log₁₀ scale)
            </div>

            {/* Exponential growth chart */}
            <div className="bg-white rounded-lg">
                <Cartesian2D
                    height={320}
                    viewBox={{ x: [-2, 52], y: [-2, 14] }}
                    showGrid={true}
                    subdivisions={false}
                    plots={[
                        // The exponential curve (shown as log scale for visibility)
                        {
                            type: 'function',
                            fn: (x: number) => Math.log10(paperThickness * Math.pow(2, x)),
                            color: '#6366f1',
                            weight: 3,
                            domain: [0, 50],
                        },
                        // Vertical line at current fold count
                        {
                            type: 'segment',
                            point1: [folds, -2] as [number, number],
                            point2: [folds, currentY] as [number, number],
                            color: '#f97316',
                            weight: 2,
                            style: 'dashed',
                        },
                        // Milestone markers as points
                        ...milestonePointPlots,
                        // Current position marker
                        {
                            type: 'point' as const,
                            x: folds,
                            y: currentY,
                            color: '#f97316',
                        },
                    ]}
                />
            </div>

            {/* X-axis label */}
            <div className="text-center text-xs text-muted-foreground mt-1">
                Number of folds
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
];
