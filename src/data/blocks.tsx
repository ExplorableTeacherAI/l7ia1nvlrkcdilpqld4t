import { type ReactElement, useMemo } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH1, EditableParagraph, InlineScrubbleNumber, InlineTooltip, DataVisualization } from "@/components/atoms";

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

// Helper component: Reactive bar chart showing thickness growth with each fold
const PaperFoldingChart = () => {
    const folds = useVar('folds', 10) as number;
    const paperThickness = 0.1; // mm

    // Generate data for each fold up to the current number
    const chartData = useMemo(() => {
        const data = [];
        for (let i = 1; i <= Math.min(folds, 20); i++) {
            const thickness = paperThickness * Math.pow(2, i);
            // Convert to readable units for display
            let displayValue: number;
            let unit: string;
            if (thickness < 1000) {
                displayValue = Math.round(thickness * 10) / 10;
                unit = 'mm';
            } else if (thickness < 1000000) {
                displayValue = Math.round(thickness / 100) / 10;
                unit = 'm';
            } else {
                displayValue = Math.round(thickness / 100000) / 10;
                unit = 'km';
            }
            data.push({
                label: `${i}`,
                value: Math.log10(thickness + 1), // Use log scale for visualization
                displayValue: `${displayValue} ${unit}`,
                rawValue: thickness,
            });
        }
        return data;
    }, [folds]);

    // Color gradient from teal to indigo based on thickness
    const getBarColor = (index: number) => {
        const colors = ['#3cc499', '#34d399', '#2dd4bf', '#22d3ee', '#38bdf8', '#60a5fa', '#818cf8', '#8b5cf6', '#a78bfa', '#6366f1'];
        return colors[Math.min(index, colors.length - 1)];
    };

    const coloredData = chartData.map((d, i) => ({
        ...d,
        color: getBarColor(i),
    }));

    return (
        <div className="w-full">
            <DataVisualization
                type="bar"
                data={coloredData}
                height={300}
                xLabel="Number of folds"
                yLabel="Thickness (log scale)"
                showValues={false}
                animate={false}
                color="#6366f1"
            />
            <p className="text-center text-sm text-muted-foreground mt-2">
                After <strong>{folds}</strong> folds: {(() => {
                    const thickness = paperThickness * Math.pow(2, folds);
                    if (thickness < 1000) return `${thickness.toFixed(1)} mm`;
                    if (thickness < 1000000) return `${(thickness / 1000).toFixed(1)} m`;
                    if (thickness < 1000000000) return `${(thickness / 1000000).toFixed(1)} km`;
                    return `${(thickness / 1000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} km`;
                })()}
            </p>
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
            <PaperFoldingChart />
        </Block>
    </StackLayout>,
];
