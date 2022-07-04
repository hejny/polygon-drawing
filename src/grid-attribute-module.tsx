import { declareModule, makeAttributeModule, React } from '@collboard/modules-sdk';
import { contributors, description, license, repository, version } from '../package.json';

export enum GridType {
    Square = 'SQUARE',
    Triangle = 'TRIANGLE',
    Hexagon = 'HEXAGON',
}

declareModule(
    makeAttributeModule<string>({
        manifest: {
            name: '@hejny/grid-polygon-drawing/grid-type-attribute',
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
            type: 'string',
            name: 'grid-type',
            defaultValue: GridType.Square,
        },
        inputRender: (value: GridType, onChange: (value: GridType) => void) => (
            <>
                {Object.values(GridType).map((gridType) => (
                    <div
                        key={gridType}
                        className={value === gridType ? 'active' : ''}
                        onClick={() => onChange(gridType)}
                    >
                        {gridType}
                    </div>
                ))}
            </>
        ),
    }),
);
