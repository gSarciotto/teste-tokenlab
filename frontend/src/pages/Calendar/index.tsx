import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { NewEventContainer, NewEventContainerProps } from "./NewEvent";

const useStyles = makeStyles({
    mainContainer: {
        padding: "40px 0"
    }
});

type CalendarPageProps = NewEventContainerProps;

export function CalendarPage(props: CalendarPageProps): JSX.Element {
    const classes = useStyles();
    return (
        <Grid
            container
            item
            xs={12}
            sm={10}
            justify="center"
            component={Paper}
            elevation={3}
            className={classes.mainContainer}
        >
            <NewEventContainer
                token={props.token}
                updateAuthenticatedUser={props.updateAuthenticatedUser}
            />
        </Grid>
    );
}
