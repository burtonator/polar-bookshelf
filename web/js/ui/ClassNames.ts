export class ClassNames {

    public static withToggled(toggle: boolean, toggledClassName: string, baseClassName: string = "") {

        if (toggle) {
            return `${baseClassName} ${toggledClassName}`;
        } else {
            return baseClassName;
        }

    }

}
