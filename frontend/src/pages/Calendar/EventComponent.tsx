import React from "react";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";
import { Event } from "./fetches";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

interface EventComponentProps {
    event: Event;
    deleteEvent: (eventId: string) => Promise<void>;
}

export function EventComponent({
    event,
    deleteEvent
}: EventComponentProps): JSX.Element {
    const handleDeleteClick = async (
        e: React.MouseEvent<HTMLButtonElement>
    ): Promise<void> => {
        await deleteEvent(event.id);
    };
    return (
        <ListItem disableGutters divider>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h6" color="textSecondary">
                        {"Início: "}
                        <Typography
                            variant="body1"
                            color="textPrimary"
                            display="inline"
                        >
                            {event.begin.toLocaleString("pt-BR", {
                                weekday: "short",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            })}
                        </Typography>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" color="textSecondary">
                        {"Fim: "}
                        <Typography
                            variant="body1"
                            color="textPrimary"
                            display="inline"
                        >
                            {event.end.toLocaleString("pt-BR", {
                                weekday: "short",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            })}
                        </Typography>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" color="textSecondary">
                        {"Criador: "}
                        <Typography
                            variant="body1"
                            color="textPrimary"
                            display="inline"
                        >
                            {event.username}
                        </Typography>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1">{event.description}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <ButtonGroup color="primary" fullWidth variant="contained">
                        <Button
                            onClick={handleDeleteClick}
                            startIcon={<DeleteIcon />}
                        >
                            Excluir
                        </Button>
                        <Button startIcon={<EditIcon />}>Editar</Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </ListItem>
    );
}
