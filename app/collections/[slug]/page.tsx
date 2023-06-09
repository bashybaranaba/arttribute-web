"use client";
import axios from "axios";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {
  Box,
  CardMedia,
  Grid,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import AppNavBar from "../../components/layout/AppNavBar";
import { DrawerHeader } from "../../components/layout/DrawerHeader";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TollIcon from "@mui/icons-material/Toll";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
import AutoAwesomeMotionOutlinedIcon from "@mui/icons-material/AutoAwesomeMotionOutlined";

import AttributeArt from "@/app/components/artcollection/AttributeArt";

import { ArttributeAddress } from "../../../config.js";
import ArtAttribution from "../../../ArtAttribution.json";

export default function CollectionDetails({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  console.log("slug: ", slug);
  const id = parseInt(slug.toString().split("-arttcollection-")[1]);
  console.log("id: ", id);

  const [collection, setCollection] = useState<any>({});
  const [imageFiles, setImageFiles] = useState<any>({});
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCollection();
  }, []);

  async function loadCollection() {
    setLoading(true);
    /* create a generic provider and query new items */
    const provider = new ethers.providers.JsonRpcProvider(
      "https://api.calibration.node.glif.io/rpc/v1"
    );

    const contract = new ethers.Contract(
      ArttributeAddress,
      ArtAttribution.abi,
      provider
    );
    const data = await contract.getCollectionById(id);

    const meta = await fetch(data.collectionUri).then((res) => res.json());
    let collectionDetails = {
      id: data.collectionId.toNumber(),
      name: meta.name,
      creator: data.creator,
      metadata: data.collectionUri,
      price: meta.price,
      collectionFilesUri: meta.files,
      description: meta.description,
      featuredImage: meta.featuredImage,
      totalAttributions: data.totalAttributions.toNumber(),
    };
    setCollection(collectionDetails);
    console.log("collectionDetails: ", collectionDetails);
    setImageFiles(collectionDetails.collectionFilesUri);
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppNavBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Grid container spacing={2} sx={{ m: 1 }}>
          <Grid item xs={12} md={3}>
            {collection.featuredImage ? (
              <CardMedia
                component="img"
                height="300"
                image={collection.featuredImage}
                alt={collection.name}
                sx={{ borderRadius: 6 }}
              />
            ) : (
              <Box
                sx={{
                  height: 300,
                  backgroundColor: "#c5cae9",
                  borderRadius: 6,
                }}
              />
            )}
            <Box
              sx={{
                width: "100%",
                mt: 2,
                p: 2,
                border: 1,
                borderRadius: 4,
                borderColor: "#c5cae9",
              }}
            >
              <Grid container>
                <Grid item xs={8} lg={8}>
                  <Box sx={{ display: "flex", m: 1 }}>
                    <TollIcon sx={{ mr: 1 }} />
                    <Typography variant="body1">Collection Price:</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4} lg={4}>
                  <Typography variant="body1" sx={{ fontWeight: 700, m: 1 }}>
                    {collection.price} +
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={8} lg={8}>
                  <Box sx={{ display: "flex", m: 1 }}>
                    <ModelTrainingIcon sx={{ mr: 1 }} />
                    <Typography variant="body1">Models trained:</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4} lg={4}>
                  <Typography variant="body1" sx={{ fontWeight: 700, m: 1 }}>
                    {collection.totalAttributions}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={8} lg={8}>
                  <Box sx={{ display: "flex", m: 1 }}>
                    <AutoAwesomeMotionOutlinedIcon sx={{ mr: 1 }} />
                    <Typography variant="body1">total images:</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4} lg={4}>
                  <Typography variant="body1" sx={{ fontWeight: 700, m: 1 }}>
                    {imageFiles?.length}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, m: 1 }}>
                <AttributeArt
                  id={collection.id}
                  price={collection.price}
                  collectionName={collection.name}
                  featuredImage={collection.featuredImage}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <Box sx={{ m: 1 }}>
              <Typography variant="h4" sx={{ m: 1, fontWeight: 700 }}>
                {collection.name}
              </Typography>
              <Typography variant="body1" sx={{ m: 1 }}>
                {collection.description}
              </Typography>
            </Box>

            <ImageList
              sx={{ width: "90%", height: 500, m: 3, borderRadius: 3 }}
              cols={3}
              rowHeight={164}
            >
              {imageFiles?.length > 0 &&
                imageFiles.map((image: string) => (
                  <ImageListItem key={image}>
                    <img
                      src={`${image}?w=164&h=164&fit=crop&auto=format`}
                      srcSet={`${image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                      alt={image}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
            </ImageList>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
