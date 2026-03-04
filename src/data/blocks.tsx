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

// Helper component: Animated stacking layers showing paper thickness growth
const PaperStackingLayers = () => {
    const folds = useVar('folds', 10) as number;
    const paperThickness = 0.1; // mm
    const totalThickness = paperThickness * Math.pow(2, folds);

    // Milestones in mm
    const milestones = [
        { threshold: 2, label: 'Fingernail', icon: '💅', color: '#3cc499' },
        { threshold: 10, label: 'Phone', icon: '📱', color: '#22d3ee' },
        { threshold: 1000, label: 'Tall person', icon: '🧍', color: '#60a5fa' },
        { threshold: 10000, label: 'House', icon: '🏠', color: '#818cf8' },
        { threshold: 300000, label: 'Skyscraper', icon: '🏙️', color: '#8b5cf6' },
        { threshold: 10000000, label: 'Airplane cruising', icon: '✈️', color: '#a78bfa' },
        { threshold: 100000000, label: 'Edge of space', icon: '🚀', color: '#f472b6' },
        { threshold: 384400000000, label: 'The Moon!', icon: '🌙', color: '#fbbf24' },
    ];

    // Format thickness for display
    const formatThickness = (mm: number) => {
        if (mm < 1000) return `${mm.toFixed(1)} mm`;
        if (mm < 1000000) return `${(mm / 1000).toFixed(1)} m`;
        if (mm < 1000000000) return `${(mm / 1000000).toFixed(1)} km`;
        return `${(mm / 1000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} km`;
    };

    // Calculate number of visible layers (max 16 for visual clarity)
    const visibleLayers = Math.min(folds, 16);
    const layers = Math.pow(2, folds);

    return (
        <div className="w-full p-6 bg-card rounded-xl border border-border/40">
            {/* Stacking visualization */}
            <div className="relative h-64 flex items-end justify-center mb-6">
                {/* Stack of paper layers */}
                <div className="relative flex flex-col-reverse items-center">
                    {Array.from({ length: visibleLayers }).map((_, i) => {
                        const layerHeight = Math.max(2, Math.min(12, 180 / visibleLayers));
                        const width = 120 - i * 2;
                        const hue = 230 + (i / visibleLayers) * 60; // Blue to purple gradient
                        return (
                            <div
                                key={i}
                                className="transition-all duration-300 ease-out rounded-sm shadow-sm"
                                style={{
                                    width: `${Math.max(60, width)}px`,
                                    height: `${layerHeight}px`,
                                    backgroundColor: `hsl(${hue}, 70%, ${65 + i * 1.5}%)`,
                                    marginTop: '-1px',
                                    transform: `translateY(${-i * 0.5}px)`,
                                    animation: `stackIn 0.3s ease-out ${i * 0.02}s both`,
                                }}
                            />
                        );
                    })}
                </div>

                {/* Layer count indicator */}
                <div className="absolute top-2 right-4 text-right">
                    <div className="text-2xl font-bold text-foreground">
                        {layers.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">layers</div>
                </div>

                {/* Thickness indicator */}
                <div className="absolute top-2 left-4 text-left">
                    <div className="text-2xl font-bold text-foreground">
                        {formatThickness(totalThickness)}
                    </div>
                    <div className="text-xs text-muted-foreground">total thickness</div>
                </div>
            </div>

            {/* Milestone markers */}
            <div className="border-t border-border/40 pt-4">
                <div className="text-xs text-muted-foreground mb-3 text-center">Milestones reached:</div>
                <div className="flex flex-wrap justify-center gap-2">
                    {milestones.map((milestone, i) => {
                        const reached = totalThickness >= milestone.threshold;
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
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CSS Animation */}
            <style>{`
                @keyframes stackIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
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
            <PaperStackingLayers />
        </Block>
    </StackLayout>,
];
