import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Field, FieldArray, Form, Formik } from 'formik';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import { object, array, number, string, boolean, ValidationError } from 'yup';

const emptyDonation = { institution: '', percentage: 0 };
const useStyles = makeStyles(theme => ({
  errorColor: {
    color: theme.palette.error.main,
  },
  stretch: {
    flexGrow: 1,
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <Card>
      <CardContent>
        <Formik
          initialValues={{
            fullName: '',
            donationsAmount: 0,
            termsAndConditions: false,
            donations: [emptyDonation],
          }}
          validationSchema={object({
            fullName: string()
              .required('Harus diisi')
              .min(2, 'At least 2 chars')
              .max(10, 'not more than 10 chars'),
            donationsAmount: number().required('Harus diisi').min(10),
            termsAndConditions: boolean().required().isTrue(),
            donations: array(
              object({
                institution: string().required('Harus diisi').min(3).max(10),
                percentage: number()
                  .required('Harus diisi')
                  .min(1, 'at least 1')
                  .max(100, 'max 100'),
              })
            )
              .min(1)
              .max(3)
              .test(donations => {
                const sum = donations.reduce(
                  (acc, curr) => acc + curr.percentage,
                  0
                );

                if (sum !== 100) {
                  return new ValidationError(
                    `Percentage should 100%, but you have ${sum}%`,
                    null,
                    'donations'
                  );
                }

                return sum === 100;
              }),
          })}
          onSubmit={async values => {
            console.log('my values', values);
            return new Promise(res => setTimeout(res, 2500));
          }}
        >
          {({ values, errors, isSubmitting }) => (
            <Form autoComplete="off">
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Field
                    fullWidth
                    name="fullName"
                    component={TextField}
                    label="Full Name"
                  />
                </Grid>
                <Grid item>
                  <Field
                    fullWidth
                    name="donationsAmount"
                    type="number"
                    component={TextField}
                    label="Donation (IDR)"
                  />
                </Grid>

                <FieldArray name="donations">
                  {({ push, remove }) => (
                    <React.Fragment>
                      <Grid item>
                        <Typography variant="h6">Your Donations</Typography>
                      </Grid>

                      {values.donations.map((_, index) => (
                        <Grid container item key={index} spacing={2}>
                          <Grid
                            item
                            xs={12}
                            sm="auto"
                            className={classes.stretch}
                          >
                            <Field
                              fullWidth
                              name={`donations[${index}].institution`}
                              component={TextField}
                              label="Institution"
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm="auto"
                            className={classes.stretch}
                          >
                            <Field
                              fullWidth
                              name={`donations[${index}].percentage`}
                              component={TextField}
                              type="number"
                              label="Percentage"
                            />
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => remove(index)}
                            >
                              Delete
                            </Button>
                          </Grid>
                        </Grid>
                      ))}

                      <Grid item>
                        {typeof errors.donations === 'string' ? (
                          <Typography color="error">
                            {errors.donations}
                          </Typography>
                        ) : null}
                      </Grid>

                      <Grid item>
                        <Button
                          variant="contained"
                          color="default"
                          onClick={() => push(emptyDonation)}
                        >
                          Add Donations
                        </Button>
                      </Grid>
                    </React.Fragment>
                  )}
                </FieldArray>

                <Grid item>
                  <Field
                    name="termsAndConditions"
                    type="checkbox"
                    component={CheckboxWithLabel}
                    Label={{
                      label: 'Accept terms and conditions',
                      className: errors.termsAndConditions
                        ? classes.errorColor
                        : null,
                    }}
                  />
                </Grid>
                <Grid item>
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={
                      isSubmitting ? <CircularProgress size="0.9rem" /> : null
                    }
                  >
                    {isSubmitting ? 'Submitting' : 'Submit'}
                  </Button>
                </Grid>
              </Grid>

              <pre>{JSON.stringify({ values, errors }, null, 4)}</pre>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default App;
