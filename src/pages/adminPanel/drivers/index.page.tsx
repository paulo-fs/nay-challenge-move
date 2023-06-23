import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { Container, Grid, Typography } from "@mui/material";
import { HeaderMenu, MyTable } from "@/components";

import { useDriverPanel } from "./driversPanel.controller";
import { IDriver } from "@/dataTypes/driver.dto";
import { getAllDrivers } from "@/services/requests/driver.request";

export default function DriversPanel({ drivers } : InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    menuLinks,
    tableHead,
    tableData,
  } = useDriverPanel(drivers)

  return (
    <>
      <HeaderMenu
        pages={menuLinks}
      />
      <Container maxWidth='xl'>
        {/* head description */}
        <Grid container marginTop={14} >
          <Grid item sm={6} padding={2}>
            <Typography component='h1' variant="h4" sx={{ textTransform: 'capitalize' }}>
              Relatório de motoristas
            </Typography>
            <Typography variant="body1">
              Dados dos motoristas da plataforma Move.
            </Typography>
          </Grid>
        </Grid>

        {/* content */}
        <Grid container marginTop={4} paddingX={4}>
          <MyTable
            tableHead={tableHead}
            data={tableData ?? []}
          />
        </Grid>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{
  drivers: IDriver[] | null
}> = async ({ req, res }) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=49"
  );

  try {
    const { drivers } = await getAllDrivers()
    return {
      props: {
        drivers
      },
    }
  } catch (err: any) {
    return {
      props: {
        drivers: null
      },
    }
  };
};
