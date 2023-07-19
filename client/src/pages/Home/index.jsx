// Render Prop
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { makeStyles, createStyles } from '@mui/styles';
import { Box, Paper, Button } from '@mui/material';
import copy from 'copy-to-clipboard';

const initialValues = {
  url: '',
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: `linear-gradient(45deg, #80FFDB, #5390D9)`,
    },
    main: {
      width: '600px',
      height: '400px',
      backgroundImage: 'none',
      background: '#5390D9',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 20px',
      boxSizing: 'border-box',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    formRow: {
      display: 'flex',
      flexDirection: 'column',
    },
  })
);

const validationSchema = yup.object().shape({
  url: yup
    .string()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      'Enter correct url!'
    )
    .required('Please enter website'),
});

const Landing = () => {
  const [newUrl, setNewUrl] = React.useState(null);
  const classes = useStyles();
  return (
    <>
      <Box className={classes.root}>
        <Paper
          className={classes.main}
          elevation={6}
          sx={{
            background: `linear-gradient(45deg, rgba(0, 0, 0, 0.1), 
          rgba(0, 0, 0, 0.1))`,
          }}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              try {
                console.log(values);
                const response = await fetch(
                  'http://localhost:8000/createUrl',
                  {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json, text/plain, */*',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                  }
                ).then((response) => response.json());

                setNewUrl(response.newUrl);
                console.log(response.newUrl);
              } catch (error) {
                console.error(error);
                setNewUrl(error);
              }
            }}
            className={classes.form}
          >
            {(formik) => {
              const { errors, touched, isValid, dirty } = formik;
              return (
                <div className={classes.container}>
                  <h1>Enter URL</h1>
                  <Form>
                    <div className={classes.formRow}>
                      {/* <label htmlFor='url'>URL</label> */}
                      <Field
                        type='url'
                        name='url'
                        id='url'
                        placeHolder='Enter Url'
                        className={
                          errors.url && touched.url ? 'input-error' : null
                        }
                      />
                      <ErrorMessage
                        name='url'
                        component='span'
                        className={classes.error}
                      />

                      <button
                        type='submit'
                        className={!(dirty && isValid) ? 'disabled-btn' : ''}
                        disabled={!(dirty && isValid)}
                      >
                        Done!
                      </button>
                    </div>
                  </Form>
                </div>
              );
            }}
          </Formik>
          {newUrl ? (
            <div>
              <h1>{newUrl}</h1>
              <Button onClick={() => copy(newUrl)} sx={{ color: 'black' }}>
                Copy
              </Button>
            </div>
          ) : (
            <div></div>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default Landing;
