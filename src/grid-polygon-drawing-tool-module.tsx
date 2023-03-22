// Note: We are using library destroyable and xyzt which is published under @hejny (creator of Collboard) but probbly it should be also published under @collboard to make clear that it is an integral part of Collboard stack.
import {
  declareModule,
  makeIconModuleOnModule,
  React,
  SCALE_PIXELS,
  Separator,
  ToolbarName
} from '@collboard/modules-sdk';
import { Registration } from 'destroyable';
// TODO: !!! Better icon + probbably rounder corners
import icon from '../assets/icons/Pavol_Hejny_icon_of_stained_glass_window_19982422-65e4-499d-94d2-076ebe150ab3.png';
import { contributors, description, license, repository, version } from '../package.json';
import { GridPolygonArt } from './grid-polygon-art-module';

declareModule(
    makeIconModuleOnModule({
        manifest: {
            name: '@hejny/grid-polygon-drawing/polygon-tool',
            version,
            description,
            contributors,
            license,
            repository,
            title: { en: 'Drawing of polygonal art', cs: 'Kreslení polygonálních obrazů' },
            keywords: ['Cubism', 'Voronoi'],
            categories: ['Basic', 'Art', 'Experimental'],
            icon,
            flags: {
                isTemplate: true,
            },
        },
        toolbar: ToolbarName.Tools,
        async icon(systems) {
            const { attributesSystem } = await systems.request('attributesSystem');
            return {
                section: 2,
                icon,
                boardCursor: 'crosshair',
                menu: () => (
                    <>
                        {attributesSystem.inputRender('grid-type')}
                        <Separator />
                        {attributesSystem.inputRender('grid-size')}
                        <Separator />
                        {attributesSystem.inputRender('color')}
                    </>
                ),
            };
        },
        moduleActivatedByIcon: {
            async setup(systems) {
                const { touchController, appState, attributesSystem, materialArtVersioningSystem, collSpace } =
                    await systems.request(
                        'touchController',
                        'appState',
                        'attributesSystem',
                        'materialArtVersioningSystem',
                        'collSpace',
                    );

                return Registration.fromSubscription((registerAdditionalSubscription) =>
                    touchController.touches.subscribe({
                        async next(touch) {
                            appState.cancelSelection();

                            const cubeArt = new GridPolygonArt(
                                attributesSystem.getAttributeValue('color').value as string,
                            );
                            let position = (await collSpace.pickPoint(touch.firstFrame.position)).point;

                            // TODO: In sync with grid
                            // TODO: !!! Use SCALE_PIXELS in tool OR art BUT NOT BOTH
                            // TODO: !!! Map in place
                            position = position.map(
                                (value) => Math.round(value / SCALE_PIXELS.field) * SCALE_PIXELS.field,
                            );
                            cubeArt.setShift(position);

                            const operation = materialArtVersioningSystem.createPrimaryOperation();
                            operation.newArts(cubeArt);
                            operation.persist();

                            // console.log({ cubeArt });

                            registerAdditionalSubscription(
                                touch.frames.subscribe({
                                    async next(touchFrame) {
                                        /*
                                        TODO: !!! Only unique on grid
                                        TODO: !!! Removing

                                        const cubeArt = new CubeArt(
                                            (await collSpace.pickPoint(touchFrame.position)).point,
                                            attributesSystem.getAttributeValue('color') as string,
                                        );

                                        const operation = materialArtVersioningSystem.createPrimaryOperation();
                                        operation.newArts(cubeArt);
                                        operation.persist();

                                        console.log({ cubeArt });

                                        */
                                    },
                                    // complete() {},
                                }),
                            );
                        },
                    }),
                );
            },
        },
    }),
);
