import {
    OccupationSelect
} from "./selectors/OccupationSelect";
import {DomainNameStr, University} from "polar-shared/src/util/Universities";
import {default as React, useState} from "react";
import {nullToUndefined} from "polar-shared/src/util/Nullable";
import {AcademicProfileConfigurator} from "./AcademicProfileConfigurator";
import {
    AcademicOccupation,
    BusinessOccupation,
    Occupation
} from "polar-shared/src/util/Occupations";
import {FieldOfStudy} from "polar-shared/src/util/FieldOfStudies";
import LinearProgress from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {PolarLogoImage} from "../../nav/PolarLogoImage";
import {PolarLogoText} from "../../nav/PolarLogoText";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            fontSize: '16px',
            minHeight: '30em',
            display: 'flex',
            flexDirection: 'column',
        },
    }),
);

export interface AcademicOccupationProfile {
    readonly occupation: AcademicOccupation;
    readonly fieldOfStudy: FieldOfStudy;
    readonly university: University;
}

export interface BusinessOccupationProfile {
    readonly occupation: BusinessOccupation;
    // readonly domainOrURL: URLStr | DomainNameStr;
    // readonly domain: DomainNameStr;
}

export type OccupationProfile = AcademicOccupationProfile | BusinessOccupationProfile;

export function isAcademicOccupationProfile(profile: OccupationProfile): profile is AcademicOccupationProfile {
    return (profile as any).fieldOfStudy !== undefined;
}


interface IProps {
    readonly onProfile: (occupationProfile: OccupationProfile) => void;
}

export interface FormData<T> {
    readonly profile: Partial<T>;
    readonly progress: number;
}

type ProfileFormData = FormData<AcademicOccupationProfile> | FormData<BusinessOccupationProfile>;

interface IState {
    readonly occupation?: Occupation;
    readonly form: ProfileFormData;
}

export const ProfileConfigurator = (props: IProps) => {

    const classes = useStyles();

    const [state, setState] = useState<IState>({
        form: {
            profile: {},
            progress: 0
        }
    });

    const onOccupation = React.useCallback((occupation: Occupation | undefined) => {

        const computeProgress = () => {
            switch (occupation?.type) {

                case "academic":
                    return 25;
                case "business":
                    return 100;
                default:
                    return 0;
            }
        };

        const progress = computeProgress();

        function toFormData(): ProfileFormData {

            if (occupation?.type === 'business') {

                return {
                    ...state.form,
                    profile: {
                        occupation
                    },
                    progress
                }
            }

            return {
                ...state.form,
                profile: {

                },
                progress
            };

        }

        const form = toFormData();

        const newState: IState = {
            ...state,
            form,
            occupation
        };

        setState(newState);

    }, [state]);

    const onForm = React.useCallback((form: FormData<AcademicOccupationProfile> | FormData<BusinessOccupationProfile>) => {
        setState({...state, form});
    }, [state]);

    const handleCompleted = React.useCallback(() => {

        const {form} = state;

        if (form.progress === 100) {

            switch (state.occupation?.type) {

                case "academic":
                    props.onProfile(form.profile as AcademicOccupationProfile);
                    break;
                case "business":
                    props.onProfile(form.profile as BusinessOccupationProfile);
                    break;

            }

        }

    }, [props, state]);

    return (
        <div className={classes.root}>

            <LinearProgress variant="determinate"
                            value={state.form.progress}/>

            <Box style={{flexGrow: 1}} m={1} ml={2} mr={2}>

                <div style={{
                         display: 'flex',
                         justifyContent: 'center',
                         alignItems: 'center'
                     }}>

                    <div style={{marginRight: '5px'}}>
                        <PolarLogoImage width={75} height={75}/>
                    </div>

                    <div style={{marginLeft: '5px'}}>
                        <PolarLogoText style={{fontSize: '45px'}}/>
                    </div>

                </div>

                <Box style={{
                         display: 'flex',
                         justifyContent: 'center',
                         alignItems: 'center'
                     }}>

                    <h2>
                        Read. Learn. Remember.
                    </h2>

                </Box>

                {/*<Box style={{*/}
                {/*         display: 'flex',*/}
                {/*         justifyContent: 'center',*/}
                {/*         alignItems: 'center'*/}
                {/*     }}>*/}

                {/*    <h3>*/}
                {/*        Polar enables you to read smarter, study more efficiently,*/}
                {/*        and build a personal knowledge base.*/}
                {/*    </h3>*/}

                {/*</Box>*/}

                <div style={{textAlign: 'center'}}>

                    <h2>Tell us about yourself</h2>

                    <Box color="text.secondary">
                        Just a few quick questions to help us customize your profile.
                    </Box>

                </div>

                <Box mt={3}
                     style={{
                         display: 'flex',
                         flexDirection: 'column',
                         justifyContent: 'flex-center'
                     }}>

                    <Box m={2}>

                        <OccupationSelect
                            placeholder="Pick one from the list or create one if necessary."
                            onSelect={selected => onOccupation(nullToUndefined(selected?.value))}/>

                    </Box>

                    {state.occupation && state.occupation.type === 'academic' &&
                        <AcademicProfileConfigurator occupation={state.occupation}
                                                     form={state.form as FormData<AcademicOccupationProfile>}
                                                     onForm={form => onForm(form)}/>}

                    {/*{state.occupation && state.occupation.type === 'business' &&*/}
                    {/*    <BusinessProfileConfigurator occupation={state.occupation}*/}
                    {/*                                 form={state.form as FormData<BusinessOccupationProfile>}*/}
                    {/*                                 onForm={form => onForm(form)}/>}*/}

                </Box>
            </Box>

            <Box mt={1}
                 mb={1}
                 style={{
                     display: 'flex',
                     justifyContent: 'center'
                 }}>

                {/*<Button disabled={state.form.progress === 100}*/}
                {/*        variant="contained"*/}
                {/*        size="large">*/}

                {/*    Skip*/}

                {/*</Button>*/}

                <Button disabled={state.form.progress !== 100}
                        variant="contained"
                        size="large"
                        onClick={handleCompleted}
                        color="primary">

                    Let's Get Started

                </Button>

            </Box>

        </div>
    );

};
