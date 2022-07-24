import { declareModule, IconText, makeAttributeModule, React } from '@collboard/modules-sdk';
import { contributors, description, license, repository, version } from '../package.json';

declareModule(
    makeAttributeModule({
        manifest: {
            name: '@hejny/grid-polygon-drawing/grid-size-attribute',
            version,
            description,
            contributors,
            license,
            repository,
            flags: {
                isTemplate: true,
            },
        },
        standard: true,
        attribute: {
            type: 'number',
            name: 'grid-size',
            defaultValue: 0,
        },
        inputRender(value: number, onChange: (value: number) => void) {
            return (
                <>
                    {[-2, -1, 0, 1, 2].map((gridSize) => (
                        <IconText
                            icon={gridSize.toString()}
                            active={value === gridSize}
                            onClick={() => onChange(gridSize)}
                        >
                            {gridSize}
                        </IconText>
                    ))}
                </>
            );
        },
    }),
);
