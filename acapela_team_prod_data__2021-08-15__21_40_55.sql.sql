--
-- PostgreSQL database dump
--

-- Dumped from database version 12.7 (Debian 12.7-1.pgdg100+1)
-- Dumped by pg_dump version 13.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: team; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.team (id, slug, name, owner_id) FROM stdin;
68246df6-08b9-4555-9e2a-55eba2ae3ad3	acapela	Acapela	7879f271-4036-48be-befb-f08de052bcdc
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."user" (id, email, name, avatar_url, created_at, email_verified, current_team_id) FROM stdin;
ee140dfb-14f6-41d3-b2b0-4e50764290d7	adam@acape.la	Adam Pietrasiak	https://lh3.googleusercontent.com/a/AATXAJxOGrBG1SXJfjS-U7PYhmE2iu3GFBa3bJQffoaN=s96-c	2021-05-20 12:57:50.85+00	\N	68246df6-08b9-4555-9e2a-55eba2ae3ad3
25db9c19-f84e-40d8-9dfb-ee94478ca40a	britta@acape.la	Britta	https://lh3.googleusercontent.com/a-/AOh14GjKBP7E1FhSJIQKZrCfLQ1lNRDx8pImYRA1EycL=s96-c	2021-05-21 11:23:05.98+00	\N	68246df6-08b9-4555-9e2a-55eba2ae3ad3
600ccd3a-a513-4a4a-864b-e00bfc9699f9	roland@acape.la	Roland Grenke	https://lh3.googleusercontent.com/a/AATXAJxQOm48Ct01Q-LFwI4elIB2sFycJ4EGtiOuXwQF=s96-c	2021-05-21 12:16:57.652+00	\N	68246df6-08b9-4555-9e2a-55eba2ae3ad3
7a90bccb-346e-4933-aaeb-cdef732be976	omar@acape.la	Omar Duarte	https://lh3.googleusercontent.com/a/AATXAJz5gAL_X7QX8ogZ8HQGRaTykYlVEtYUyC5b4B0J=s96-c	2021-05-24 06:40:15.987+00	\N	68246df6-08b9-4555-9e2a-55eba2ae3ad3
82f57a9f-6615-4527-816f-31ee7a0b7c98	yuliia@acape.la	Yuliia Picker-Huchzermeyer	https://lh3.googleusercontent.com/a-/AOh14Gj1wzDdaT7Gb74RSetSoh7YbxckpYLN0UEjWiY4=s96-c	2021-05-21 13:44:05.11+00	\N	68246df6-08b9-4555-9e2a-55eba2ae3ad3
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	arnoldas@acape.la	Arnoldas Matulis	https://lh3.googleusercontent.com/a-/AOh14GizaeWvI3irgGzT0pFOwnY7HAlbUVantErCsogT=s96-c	2021-06-01 12:16:37.094+00	\N	68246df6-08b9-4555-9e2a-55eba2ae3ad3
f30de478-b560-47f5-8588-8062ffc64a25	jannick@acape.la	Jannick Stein	https://lh3.googleusercontent.com/a-/AOh14GhH-D5E_CRExxDTPaXnGb3jQLlflDoapJxuDfkr=s96-c	2021-06-07 15:12:47.344+00	\N	68246df6-08b9-4555-9e2a-55eba2ae3ad3
ca652ee1-1423-42fe-a0ef-e5761a670845	rodion@acape.la	Rodion Chachura	https://lh3.googleusercontent.com/a-/AOh14GiQpt45PWSaWb9ODdn3HB-8eCD3dh8O8SPoNM_Y=s96-c	2021-06-09 06:14:04.41+00	\N	68246df6-08b9-4555-9e2a-55eba2ae3ad3
4d783a5d-2c91-4cc0-89f6-42d0b5d189c8	leonie@acape.la	Leonie Witte	https://lh3.googleusercontent.com/a/AATXAJw-3OsW2pumk_0sJbt5ybZQXbLnGY36sr1HSBf0=s96-c	2021-07-15 08:25:05.973+00	\N	68246df6-08b9-4555-9e2a-55eba2ae3ad3
7879f271-4036-48be-befb-f08de052bcdc	gregor@acape.la	Gregor Weber	https://lh3.googleusercontent.com/a/AATXAJyyCS7pvp00cdDa1X7n1Mp5O9D89aNUhJBLzlb-=s96-c	2021-07-26 07:47:45.135+00	\N	68246df6-08b9-4555-9e2a-55eba2ae3ad3
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	me@christophwitzko.com	Christoph Witzko	https://lh3.googleusercontent.com/a-/AOh14GhlkWp_ZWG92NOL4MdINrBlIj2Vn334V4a5a1m3=s96-c	2021-07-16 09:05:16.592+00	2021-07-30 10:52:12.322+00	68246df6-08b9-4555-9e2a-55eba2ae3ad3
31f1de58-af98-4946-997c-622cb20d9504	ana@heyana.co	Ana Moreno	https://lh3.googleusercontent.com/a-/AOh14GhgGkPjIDTfIAjt0UYGU_uLaUO09kgpe9j3wJCz=s96-c	2021-08-03 08:54:27.197+00	\N	68246df6-08b9-4555-9e2a-55eba2ae3ad3
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	heiki@acape.la	Heiki Riesenkampf	https://lh3.googleusercontent.com/a-/AOh14Ghxq5BJMTw6ZLUdv3howB95vKuw0aRK-5kaNl6V=s96-c	2021-05-21 09:51:35.552+00	\N	68246df6-08b9-4555-9e2a-55eba2ae3ad3
\.


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.account (id, created_at, user_id, provider_id, provider_type, provider_account_id, refresh_token, access_token, access_token_expires, updated_at) FROM stdin;
36a2af02-e3ec-401f-8582-5ee4431e79f4	2021-05-24 06:40:16.048+00	7a90bccb-346e-4933-aaeb-cdef732be976	google	oauth	106212502035181529830	\N	ya29.a0AfH6SMB_u6DI-mP86Hy2muShZ3_I_EieF_UZzo09vUh6sKO31tm6mhfGL_ZvIOTobVIqjntvg2zDsvYXzA7eEGPse83YKeJGho0shpSkfAvZeuvHscSs_RYSKT0LMVgJrLmTWoArQ9Wr_1eIQSa2mlN0zD5B	1970-01-01 00:00:00+00	2021-05-24 06:40:16.048+00
3946ed7f-3e9b-4a98-beb9-c4add516a891	2021-06-09 06:14:04.47+00	ca652ee1-1423-42fe-a0ef-e5761a670845	google	oauth	103127835207595371951	\N	ya29.a0AfH6SMDPomll2qfpnPTgsR0cz8Xisc0wQTKs_OBm0a4FpFgHKmU6YK_kLSzRkgiP6IIM_tguJrKhrkEhUOsLAP9QhPvpPz8Xy9nTw3gA7EAD-YlDNMHkH8_8L04bGKypXBqwM2rjCY-rAMJFY8HjQUKOcw1ymzDOVSCuykc	1970-01-01 00:00:00+00	2021-06-09 06:14:04.47+00
db57a2c1-4900-477d-8dfc-386c5a127da4	2021-06-07 15:12:47.407+00	f30de478-b560-47f5-8588-8062ffc64a25	google	oauth	100192100548469015526	1//03rwg3qjNJIXYCgYIARAAGAMSNwF-L9Ireqv-y1RADI_Dvg52ESn3hlTuCjY8WrH7ufhIbgzpEMyWis_YNXF4qN93zrl-qC81_lw	ya29.a0AfH6SMDrWWmNmOGBTqhdg5irE_mfJs58aNPn0QawdEwRiePqLF1pKvB4IjS0lwuiYrTHYFqi7qz-ZQe-c9_q8oeFzEw5FsWr1N1kjSu2IXEctKq1rjof_SY241pIw2khXyZRoKFZBYEVIxCUeO_TAyam8ob6	1970-01-01 00:00:00+00	2021-07-06 11:48:01.258967+00
b7a67b97-d8ef-4ce4-be69-9a5d46acd4a4	2021-05-21 09:51:35.614+00	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	google	oauth	100421637841297204406	1//03jRY9l8YKWImCgYIARAAGAMSNwF-L9IrN9vor1g18Es-SbOfYVlQLp2eCn4_ll7LLQuPS--t3c7CLOnIRxW1sIoHFbrqiS_-bcU	ya29.a0AfH6SMBL1GAWGvn6skWS3PV0ywCKONFngbRGqnt0LHfCaTl69MIAxPpeCVzWGKqi-ueTlWQ7yVp_OggmSNFBHnEQyCA53hZ8cVX-CeTie_3JFcV2JyEIb4lJE-yJ4FIQF-AqMBo03T44pM3GiQ9yAzw8AMLh90eNKkRpnArx	1970-01-01 00:00:00+00	2021-06-28 20:05:36.022276+00
e6824487-6ce0-4ecb-9fce-69944a86d80d	2021-06-01 12:16:37.11+00	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	google	oauth	108068571163232692039	1//03wHsdxmHtkHPCgYIARAAGAMSNwF-L9Ir3tPmGw3koL0iUCq-AG2homAoH0rWA4hT24D-aMMnpoMsYwZ10S94V-jMDXo4cdSUeds	ya29.a0AfH6SMAgin2eoLXn5YfTraPXSZmAIwFgo0aL16LhPgj_4mNCg-J5UsbeWeCGEQCdXPzRv71m83cfzb-B7LobqSpeCjyY_Wdc2vXTttwtv__35RKir6YqDFQ8bGTHBcgoFrgYMI1NRQL0weIhTW5RIJiYeoI4tRV-EAjuacE	1970-01-01 00:00:00+00	2021-06-25 07:01:46.999394+00
9b40de3a-d094-4f65-a318-1599dbb1e4a3	2021-05-21 12:16:57.714+00	600ccd3a-a513-4a4a-864b-e00bfc9699f9	google	oauth	106544215786083336989	1//03mLzLX6fwA-GCgYIARAAGAMSNwF-L9IrsjgvC8ai72rkBbcvwzcaxmjaQtXQmg2XypMJMm-suokbDzv97qJaszM9S_wdL12WYvk	ya29.a0AfH6SMByC9QcWB-uS44OYYL6gNxnegbk8LkkTmX5hO-gx1fHFz2HrXHG4V7B_lJhfQNmOTHm-HTqJXsTZ75Sz26H-NW1BmMSXpLiUG0ouqyj1HB3bx7n6ajgk7ywVcj512SYCqmfixYprP-s5awhoZHdSQKDaO_vxubal2Br	1970-01-01 00:00:00+00	2021-06-25 07:01:49.628617+00
7cbd6088-20bc-4cba-a10c-3f80cc907023	2021-05-21 13:44:05.169+00	82f57a9f-6615-4527-816f-31ee7a0b7c98	google	oauth	113248229309876526626	1//03188H8EvlkyJCgYIARAAGAMSNwF-L9IrU2uLcW8FV-DHSCCr3h63tp2zIYzHLuF8cbUE8w9CQe-_Hc-eoJIQJEe4uGdwE8wSL8Q	ya29.a0AfH6SMCTCSByou_P6DOUkQHNXcwvchKg6OtqCCf6v3KZNUeMcVyg6kvrMlv5WXztnp6BM128r05clBV2_5P2B6hyYNQ9g8HLhNKSJpOFy5prUbiZNTl8_YceRbdhNNRmEvSa7Mze1ttEX8sXUS8f9JRKnSVS	1970-01-01 00:00:00+00	2021-06-25 07:12:56.07397+00
32a3a6cf-fd17-4e4b-8852-4c44fe9b80a7	2021-05-21 11:23:06.038+00	25db9c19-f84e-40d8-9dfb-ee94478ca40a	google	oauth	107383834942078920222	1//03vepNqO-IHtMCgYIARAAGAMSNwF-L9IrXY57ypQK_sTYrl5kuwfXney-xxhiBjX4_nkHn1_2LXcilm66LeudGPHvXLT6RaRMbZ8	ya29.a0AfH6SMAQPd2ImbXIt8jQof6JTDxTuyCdwJnbAME53rHNUj5qmMIv_fQhDzPgXxRqpkAmc7QyR5Tg8xI0WAuuxABPvonEFXsQVnl4231ByVOLettumYw__oH-L7D80KI4dE52LAA4GKo0PzI3X_SLjnK0Ck2_	1970-01-01 00:00:00+00	2021-06-28 11:56:46.846873+00
77076f51-588f-47e5-ba22-e432bd7c8e14	2021-05-20 12:57:50.911+00	ee140dfb-14f6-41d3-b2b0-4e50764290d7	google	oauth	105963549908828641068	1//03dc-bb6AMaP5CgYIARAAGAMSNwF-L9Ir5iimBp-J56IQ7EYjHcngOspb8A2MsVoDZZbCOv10c7_c50pij2yobrOPEZOPDGpT89w	ya29.a0AfH6SMBwPNnYNZQv2NZ1VGC-YTmeI9LQUaPh-hPJzhHqpZ5sFemkb3CSbygoyz0My7pal2I51J7yOuXZ6j0-U881aFHuN7T7rTG5d4QHTY7ebkqh9ShWLByCwh-3Soxj4dtZKh2GYNMKF_X7HLrV5u36Z44z2rw	1970-01-01 00:00:00+00	2021-07-01 10:00:05.604467+00
4bf9ab29-548b-4329-85fd-4edfab17038c	2021-07-15 08:25:06.073+00	4d783a5d-2c91-4cc0-89f6-42d0b5d189c8	google	oauth	109836287425649393951	1//03wtLQYOWlKrqCgYIARAAGAMSNwF-L9Ir6R5xFpXk2jRDHv7y1Fx0tOE7yXKv6Ri0OblZJ8NDBYAK84pEdDmHS4fb9fWwvj3Tvu8	ya29.a0ARrdaM9CJn6XGsrV5Sgm3yGgbc61sEltoTEDdM9YlkqyaZrEijctEckOtc27gu6cR_DIP1vWhOfqRsrBpb9q9DT_0NgK-RWWWdkbM4zwUoC4nvkO9DvhXvqaM7k2Zuw4nJoBADvlsw67iQiF95_jKXn6lxtw	\N	2021-07-15 08:25:06.073+00
d4d69c9b-1344-4e49-87c5-f112d1fc4349	2021-07-16 09:05:16.625+00	69324499-ae41-4ce4-bdaa-6072e0e5c2d3	google	oauth	108750769236685240102	1//03VRAsCciiupACgYIARAAGAMSNwF-L9IrvOIDZV5dWj9z-eFOPqCwXdsBH5KdBH1znhRX5CTVhV9mc_I5TyZE4FtaLgK70qOes8Q	ya29.a0ARrdaM_DTbitvJt8uvKApJt8Ydxwe5NbENMA7OK1DgkX2q_0yotnl7HTBMH_cjDNgANZcicElwCF9YJ2P1pmI11hRiyih_JlFfj1H8UwHiYSu8aas11aN9ga5Gkj6KAscv_DzsJTHpwhSUgiFeroNqfMYUjX	\N	2021-07-16 09:05:16.625+00
747886ef-3d91-45c3-8025-47b652f44faf	2021-07-26 07:47:45.182+00	7879f271-4036-48be-befb-f08de052bcdc	google	oauth	103659480367898597463	1//03AfxGFRQKFbVCgYIARAAGAMSNwF-L9IrLUwvyd_gg9-EaXmZP2zkpmRri2ZdXxOqtjlBPb5i41yVLzLmeiSWwfS4YH_2BMq63pE	ya29.a0ARrdaM85h5Zbim-VvLzwSKr6PRKe8NQ8PFVyqIRfge5mpKNF9mOVLnldEgUa5uB9K_ZNGV5H7OlyiFVglkdaK8uyakWJXjIy5Yj3UPCY188UpP18t3RjJ0RB9ETAUSuCbPr3OORGCOLU_JRWN0d83PtIu5VA	\N	2021-07-26 07:47:45.182+00
82861b19-1ef1-4fd0-89a7-aaa09a9865b9	2021-08-03 08:54:27.265+00	31f1de58-af98-4946-997c-622cb20d9504	google	oauth	113856480617875357345	1//03LHZqAMgLBLICgYIARAAGAMSNwF-L9Ir_rmzirHQf8BbAW7_H3Qqv-MCt_wG5sp6hN-U75nlcKmrf7qh_pFkc0ugwPyBCyrgopo	ya29.a0ARrdaM8kjLEDrHCNKf6h-RS90EIzUOpNrpbyiqeGtdQn6QbPPUJvy_uucDz3CGmSv_nVA2fHnQEsaTv7dJ2jt9EddsqV9d3ggxgEbBJtKKT_4EblnxctVbZ2xbJl4YR9cqUOnvgMS_pBUj0I2Zfpo2vHycwq	\N	2021-08-03 08:54:27.265+00
\.


--
-- Data for Name: transcription_status; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.transcription_status (value) FROM stdin;
preparing
transcribing
completed
blocked
failed
\.


--
-- Data for Name: transcription; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.transcription (id, created_at, updated_at, sonix_media_id, transcript, status) FROM stdin;
eb441f7e-8d34-4c7e-9d0a-9d4fb96294b4	2021-05-21 12:44:26.007+00	2021-05-21 12:44:26.007+00	BxrG1rLQ	\N	preparing
4127a3a5-4c44-4b52-8d55-dcddfdf59c1a	2021-05-26 11:28:32.169+00	2021-05-26 13:14:46.792432+00	Wv0amRm2	[{"words": [{"text": "Testing,", "end_time": 1.8, "highlight": false, "start_time": 1.29, "strikethrough": false}, {"text": " audio", "end_time": 2.13, "highlight": false, "start_time": 1.8, "strikethrough": false}, {"text": " recording", "end_time": 2.7, "highlight": false, "start_time": 2.13, "strikethrough": false}, {"text": " and", "end_time": 2.91, "highlight": false, "start_time": 2.7, "strikethrough": false}, {"text": " the.", "end_time": 3.21, "highlight": false, "start_time": 2.91, "strikethrough": false}], "speaker": "Speaker1", "end_time": 3.21, "start_time": 1.29}]	completed
b0f279f5-c359-4c91-bba2-56d315525ee5	2021-05-26 13:49:02.784+00	2021-05-26 13:49:02.784+00	VvMXwJaQ	\N	preparing
6b2f68e5-b96b-46c9-a175-cfcca24d00b8	2021-05-27 13:43:02.3+00	2021-05-27 13:44:50.097693+00	w29BNb4x	[{"words": [{"text": "Testing", "end_time": 1.41, "highlight": false, "start_time": 0.84, "strikethrough": false}, {"text": " the", "end_time": 1.89, "highlight": false, "start_time": 1.41, "strikethrough": false}, {"text": " video", "end_time": 2.7, "highlight": false, "start_time": 2.28, "strikethrough": false}, {"text": " recording", "end_time": 3.36, "highlight": false, "start_time": 2.7, "strikethrough": false}, {"text": " screen", "end_time": 3.74, "highlight": false, "start_time": 3.36, "strikethrough": false}, {"text": " recording", "end_time": 4.2, "highlight": false, "start_time": 3.75, "strikethrough": false}, {"text": " feature", "end_time": 4.62, "highlight": false, "start_time": 4.2, "strikethrough": false}, {"text": " and", "end_time": 4.74, "highlight": false, "start_time": 4.62, "strikethrough": false}, {"text": " seeing", "end_time": 5.01, "highlight": false, "start_time": 4.74, "strikethrough": false}, {"text": " of", "end_time": 5.13, "highlight": false, "start_time": 5.01, "strikethrough": false}, {"text": " the", "end_time": 5.19, "highlight": false, "start_time": 5.13, "strikethrough": false}, {"text": " transcription", "end_time": 5.88, "highlight": false, "start_time": 5.19, "strikethrough": false}, {"text": " works.", "end_time": 6.3, "highlight": false, "start_time": 5.88, "strikethrough": false}], "speaker": "Speaker1", "end_time": 6.3, "start_time": 0.84}]	completed
ff4f52a8-e2fd-4046-8a15-fd3ccd4e3c47	2021-07-21 14:12:12.004+00	2021-07-21 14:13:30.737396+00	OxoVw762	[{"words": [{"text": "Hello,", "end_time": 1.44, "highlight": false, "start_time": 1.21, "strikethrough": false}, {"text": " I", "end_time": 1.61, "highlight": false, "start_time": 1.52, "strikethrough": false}, {"text": " don't", "end_time": 1.86, "highlight": false, "start_time": 1.62, "strikethrough": false}, {"text": " know,", "end_time": 2.21, "highlight": false, "start_time": 1.86, "strikethrough": false}, {"text": " can", "end_time": 2.76, "highlight": false, "start_time": 2.49, "strikethrough": false}, {"text": " you", "end_time": 2.85, "highlight": false, "start_time": 2.76, "strikethrough": false}, {"text": " hear", "end_time": 3, "highlight": false, "start_time": 2.85, "strikethrough": false}, {"text": " me?", "end_time": 3.24, "highlight": false, "start_time": 3, "strikethrough": false}], "speaker": "Speaker1", "end_time": 3.24, "start_time": 1.21}]	completed
95b12b11-4c45-4140-a397-3add9ec9a262	2021-05-26 12:54:06.054+00	2021-05-26 13:56:49.296653+00	Oxo1k46v	[{"words": [{"text": "Testing", "end_time": 1.95, "highlight": false, "start_time": 1.32, "strikethrough": false}, {"text": " our", "end_time": 2.39, "highlight": false, "start_time": 1.95, "strikethrough": false}, {"text": " subscriptions", "end_time": 3.3, "highlight": false, "start_time": 2.4, "strikethrough": false}, {"text": " yet", "end_time": 3.87, "highlight": false, "start_time": 3.54, "strikethrough": false}, {"text": " again,", "end_time": 4.2, "highlight": false, "start_time": 3.87, "strikethrough": false}, {"text": " no", "end_time": 5.48, "highlight": false, "start_time": 5.1, "strikethrough": false}, {"text": " other", "end_time": 5.79, "highlight": false, "start_time": 5.52, "strikethrough": false}, {"text": " transcriptase.", "end_time": 6.57, "highlight": false, "start_time": 5.85, "strikethrough": false}], "speaker": "Speaker1", "end_time": 6.57, "start_time": 1.32}]	completed
aa386402-697d-44bb-8a17-59cbe2810894	2021-05-26 14:14:21.33+00	2021-05-26 14:14:21.33+00	1Q6gja8v	\N	preparing
1e500c26-a1ba-4143-8dd8-d38160898600	2021-05-26 16:00:41.034+00	2021-05-26 16:00:41.034+00	qvYrB9X2	\N	preparing
90d1f706-7bf4-41e6-9f22-03e7b167a2ec	2021-05-26 21:00:14.567+00	2021-05-26 21:01:41.785314+00	827V44jv	[{"words": [{"text": "This", "end_time": 1.56, "highlight": false, "start_time": 1.29, "strikethrough": false}, {"text": " is", "end_time": 1.74, "highlight": false, "start_time": 1.56, "strikethrough": false}, {"text": " video", "end_time": 2.07, "highlight": false, "start_time": 1.74, "strikethrough": false}, {"text": " recording", "end_time": 2.61, "highlight": false, "start_time": 2.07, "strikethrough": false}, {"text": " testing,", "end_time": 3.23, "highlight": false, "start_time": 2.61, "strikethrough": false}, {"text": " this", "end_time": 3.72, "highlight": false, "start_time": 3.48, "strikethrough": false}, {"text": " should", "end_time": 3.93, "highlight": false, "start_time": 3.72, "strikethrough": false}, {"text": " finally", "end_time": 4.32, "highlight": false, "start_time": 3.93, "strikethrough": false}, {"text": " work.", "end_time": 4.64, "highlight": false, "start_time": 4.32, "strikethrough": false}], "speaker": "Speaker1", "end_time": 4.64, "start_time": 1.29}]	completed
57a32694-c4ef-412c-956b-66d5e67dcaa0	2021-07-22 17:50:04.603+00	2021-07-22 17:51:21.242117+00	yvR8qYBx	[{"words": [{"text": "Hey,", "end_time": 1.71, "highlight": false, "start_time": 1.44, "strikethrough": false}, {"text": " guys,", "end_time": 2.04, "highlight": false, "start_time": 1.71, "strikethrough": false}, {"text": " how's", "end_time": 2.19, "highlight": false, "start_time": 2.04, "strikethrough": false}, {"text": " it", "end_time": 2.28, "highlight": false, "start_time": 2.19, "strikethrough": false}, {"text": " going?", "end_time": 2.69, "highlight": false, "start_time": 2.28, "strikethrough": false}, {"text": " Just", "end_time": 3.39, "highlight": false, "start_time": 3.18, "strikethrough": false}, {"text": " wanted", "end_time": 3.6, "highlight": false, "start_time": 3.39, "strikethrough": false}, {"text": " to", "end_time": 3.72, "highlight": false, "start_time": 3.6, "strikethrough": false}, {"text": " check", "end_time": 4.05, "highlight": false, "start_time": 3.72, "strikethrough": false}, {"text": " in", "end_time": 4.23, "highlight": false, "start_time": 4.05, "strikethrough": false}, {"text": " with", "end_time": 4.42, "highlight": false, "start_time": 4.23, "strikethrough": false}, {"text": " the", "end_time": 4.59, "highlight": false, "start_time": 4.43, "strikethrough": false}, {"text": " already", "end_time": 5.01, "highlight": false, "start_time": 4.65, "strikethrough": false}, {"text": " active", "end_time": 5.64, "highlight": false, "start_time": 5.01, "strikethrough": false}, {"text": " on", "end_time": 5.82, "highlight": false, "start_time": 5.64, "strikethrough": false}, {"text": " any", "end_time": 6.12, "highlight": false, "start_time": 5.82, "strikethrough": false}, {"text": " other", "end_time": 6.6, "highlight": false, "start_time": 6.12, "strikethrough": false}, {"text": " rooms", "end_time": 7.23, "highlight": false, "start_time": 6.6, "strikethrough": false}, {"text": " and", "end_time": 8.01, "highlight": false, "start_time": 7.68, "strikethrough": false}, {"text": " whether", "end_time": 8.25, "highlight": false, "start_time": 8.01, "strikethrough": false}, {"text": " you've", "end_time": 8.43, "highlight": false, "start_time": 8.25, "strikethrough": false}, {"text": " tried", "end_time": 8.73, "highlight": false, "start_time": 8.43, "strikethrough": false}, {"text": " out", "end_time": 8.91, "highlight": false, "start_time": 8.73, "strikethrough": false}, {"text": " all", "end_time": 9.06, "highlight": false, "start_time": 8.91, "strikethrough": false}, {"text": " the", "end_time": 9.15, "highlight": false, "start_time": 9.06, "strikethrough": false}, {"text": " different", "end_time": 9.45, "highlight": false, "start_time": 9.15, "strikethrough": false}, {"text": " functions,", "end_time": 10.23, "highlight": false, "start_time": 9.45, "strikethrough": false}, {"text": " if", "end_time": 10.32, "highlight": false, "start_time": 10.23, "strikethrough": false}, {"text": " you", "end_time": 10.38, "highlight": false, "start_time": 10.32, "strikethrough": false}, {"text": " have", "end_time": 10.5, "highlight": false, "start_time": 10.38, "strikethrough": false}, {"text": " any", "end_time": 10.65, "highlight": false, "start_time": 10.5, "strikethrough": false}, {"text": " questions", "end_time": 11.07, "highlight": false, "start_time": 10.65, "strikethrough": false}, {"text": " that", "end_time": 11.19, "highlight": false, "start_time": 11.07, "strikethrough": false}, {"text": " we", "end_time": 11.31, "highlight": false, "start_time": 11.19, "strikethrough": false}, {"text": " know", "end_time": 11.67, "highlight": false, "start_time": 11.31, "strikethrough": false}, {"text": " would", "end_time": 12.34, "highlight": false, "start_time": 12.12, "strikethrough": false}, {"text": " be", "end_time": 12.48, "highlight": false, "start_time": 12.36, "strikethrough": false}, {"text": " great", "end_time": 12.76, "highlight": false, "start_time": 12.48, "strikethrough": false}, {"text": " to", "end_time": 12.87, "highlight": false, "start_time": 12.76, "strikethrough": false}, {"text": " align", "end_time": 13.29, "highlight": false, "start_time": 12.87, "strikethrough": false}, {"text": " on", "end_time": 13.44, "highlight": false, "start_time": 13.29, "strikethrough": false}, {"text": " your", "end_time": 13.53, "highlight": false, "start_time": 13.44, "strikethrough": false}, {"text": " feedback", "end_time": 14.14, "highlight": false, "start_time": 13.53, "strikethrough": false}, {"text": " next", "end_time": 14.85, "highlight": false, "start_time": 14.19, "strikethrough": false}, {"text": " Wednesday,", "end_time": 15.42, "highlight": false, "start_time": 14.85, "strikethrough": false}, {"text": " if", "end_time": 15.51, "highlight": false, "start_time": 15.42, "strikethrough": false}, {"text": " that's", "end_time": 15.69, "highlight": false, "start_time": 15.51, "strikethrough": false}, {"text": " possible.", "end_time": 16.17, "highlight": false, "start_time": 15.69, "strikethrough": false}, {"text": " Thanks.", "end_time": 16.77, "highlight": false, "start_time": 16.2, "strikethrough": false}], "speaker": "Speaker1", "end_time": 16.77, "start_time": 1.44}]	completed
fbc8fa8d-fab5-48c1-851c-f9729525dc11	2021-07-22 17:53:33.71+00	2021-07-22 17:55:40.310069+00	XQlrBGn2	[{"words": [{"text": "Hey,", "end_time": 1.18, "highlight": false, "start_time": 0.94, "strikethrough": false}, {"text": " Tim,", "end_time": 1.57, "highlight": false, "start_time": 1.18, "strikethrough": false}, {"text": " how", "end_time": 1.78, "highlight": false, "start_time": 1.57, "strikethrough": false}, {"text": " are", "end_time": 1.96, "highlight": false, "start_time": 1.78, "strikethrough": false}, {"text": " you?", "end_time": 2.35, "highlight": false, "start_time": 1.96, "strikethrough": false}, {"text": " I", "end_time": 2.86, "highlight": false, "start_time": 2.68, "strikethrough": false}, {"text": " just", "end_time": 3.1, "highlight": false, "start_time": 2.86, "strikethrough": false}, {"text": " wanted", "end_time": 3.34, "highlight": false, "start_time": 3.1, "strikethrough": false}, {"text": " to", "end_time": 3.4, "highlight": false, "start_time": 3.34, "strikethrough": false}, {"text": " quickly", "end_time": 3.97, "highlight": false, "start_time": 3.64, "strikethrough": false}, {"text": " check", "end_time": 4.21, "highlight": false, "start_time": 3.97, "strikethrough": false}, {"text": " in", "end_time": 4.33, "highlight": false, "start_time": 4.21, "strikethrough": false}, {"text": " with", "end_time": 4.54, "highlight": false, "start_time": 4.33, "strikethrough": false}, {"text": " you", "end_time": 4.81, "highlight": false, "start_time": 4.54, "strikethrough": false}, {"text": " because,", "end_time": 5.2, "highlight": false, "start_time": 4.81, "strikethrough": false}, {"text": " you", "end_time": 5.32, "highlight": false, "start_time": 5.2, "strikethrough": false}, {"text": " know,", "end_time": 5.74, "highlight": false, "start_time": 5.32, "strikethrough": false}, {"text": " your", "end_time": 6.16, "highlight": false, "start_time": 5.77, "strikethrough": false}, {"text": " farewell", "end_time": 6.76, "highlight": false, "start_time": 6.16, "strikethrough": false}, {"text": " is", "end_time": 6.88, "highlight": false, "start_time": 6.76, "strikethrough": false}, {"text": " basically", "end_time": 7.33, "highlight": false, "start_time": 6.88, "strikethrough": false}, {"text": " around", "end_time": 7.57, "highlight": false, "start_time": 7.33, "strikethrough": false}, {"text": " the", "end_time": 7.69, "highlight": false, "start_time": 7.57, "strikethrough": false}, {"text": " corner.", "end_time": 8.28, "highlight": false, "start_time": 7.69, "strikethrough": false}, {"text": " As", "end_time": 8.98, "highlight": false, "start_time": 8.77, "strikethrough": false}, {"text": " soon", "end_time": 9.49, "highlight": false, "start_time": 8.98, "strikethrough": false}, {"text": " as", "end_time": 9.88, "highlight": false, "start_time": 9.49, "strikethrough": false}, {"text": " August", "end_time": 10.24, "highlight": false, "start_time": 9.88, "strikethrough": false}, {"text": " starts,", "end_time": 10.96, "highlight": false, "start_time": 10.24, "strikethrough": false}, {"text": " all", "end_time": 11.44, "highlight": false, "start_time": 11.23, "strikethrough": false}, {"text": " of", "end_time": 11.56, "highlight": false, "start_time": 11.44, "strikethrough": false}, {"text": " us", "end_time": 11.71, "highlight": false, "start_time": 11.56, "strikethrough": false}, {"text": " will", "end_time": 11.89, "highlight": false, "start_time": 11.71, "strikethrough": false}, {"text": " be", "end_time": 11.98, "highlight": false, "start_time": 11.89, "strikethrough": false}, {"text": " kind", "end_time": 12.22, "highlight": false, "start_time": 11.98, "strikethrough": false}, {"text": " of", "end_time": 12.34, "highlight": false, "start_time": 12.22, "strikethrough": false}, {"text": " on", "end_time": 12.46, "highlight": false, "start_time": 12.34, "strikethrough": false}, {"text": " vacation.", "end_time": 12.93, "highlight": false, "start_time": 12.46, "strikethrough": false}, {"text": " So", "end_time": 13.07, "highlight": false, "start_time": 12.94, "strikethrough": false}, {"text": " I", "end_time": 13.12, "highlight": false, "start_time": 13.07, "strikethrough": false}, {"text": " don't", "end_time": 13.31, "highlight": false, "start_time": 13.12, "strikethrough": false}, {"text": " want", "end_time": 13.51, "highlight": false, "start_time": 13.31, "strikethrough": false}, {"text": " to", "end_time": 13.66, "highlight": false, "start_time": 13.51, "strikethrough": false}, {"text": " miss", "end_time": 13.93, "highlight": false, "start_time": 13.66, "strikethrough": false}, {"text": " your", "end_time": 14.08, "highlight": false, "start_time": 13.93, "strikethrough": false}, {"text": " big", "end_time": 14.47, "highlight": false, "start_time": 14.08, "strikethrough": false}, {"text": " going", "end_time": 15.55, "highlight": false, "start_time": 15.1, "strikethrough": false}, {"text": " away,", "end_time": 16.27, "highlight": false, "start_time": 15.55, "strikethrough": false}, {"text": " kind", "end_time": 17.68, "highlight": false, "start_time": 17.41, "strikethrough": false}, {"text": " of", "end_time": 17.77, "highlight": false, "start_time": 17.68, "strikethrough": false}, {"text": " celebrating", "end_time": 18.43, "highlight": false, "start_time": 17.77, "strikethrough": false}, {"text": " the", "end_time": 18.49, "highlight": false, "start_time": 18.43, "strikethrough": false}, {"text": " next", "end_time": 18.76, "highlight": false, "start_time": 18.49, "strikethrough": false}, {"text": " chapter", "end_time": 19.15, "highlight": false, "start_time": 18.76, "strikethrough": false}, {"text": " of", "end_time": 19.27, "highlight": false, "start_time": 19.15, "strikethrough": false}, {"text": " your", "end_time": 19.39, "highlight": false, "start_time": 19.27, "strikethrough": false}, {"text": " life", "end_time": 19.81, "highlight": false, "start_time": 19.39, "strikethrough": false}, {"text": " thing.", "end_time": 21.35, "highlight": false, "start_time": 20.86, "strikethrough": false}, {"text": " Should", "end_time": 21.61, "highlight": false, "start_time": 21.37, "strikethrough": false}, {"text": " we", "end_time": 21.73, "highlight": false, "start_time": 21.61, "strikethrough": false}, {"text": " plan", "end_time": 22.06, "highlight": false, "start_time": 21.73, "strikethrough": false}, {"text": " anything", "end_time": 22.78, "highlight": false, "start_time": 22.06, "strikethrough": false}, {"text": " or", "end_time": 23.32, "highlight": false, "start_time": 22.78, "strikethrough": false}, {"text": " do", "end_time": 23.95, "highlight": false, "start_time": 23.83, "strikethrough": false}, {"text": " you", "end_time": 24.04, "highlight": false, "start_time": 23.95, "strikethrough": false}, {"text": " think", "end_time": 24.29, "highlight": false, "start_time": 24.04, "strikethrough": false}, {"text": " you", "end_time": 24.37, "highlight": false, "start_time": 24.29, "strikethrough": false}, {"text": " will", "end_time": 24.49, "highlight": false, "start_time": 24.37, "strikethrough": false}, {"text": " be", "end_time": 24.61, "highlight": false, "start_time": 24.49, "strikethrough": false}, {"text": " gone", "end_time": 25.12, "highlight": false, "start_time": 24.61, "strikethrough": false}, {"text": " basically", "end_time": 26.53, "highlight": false, "start_time": 25.66, "strikethrough": false}, {"text": " end", "end_time": 27.52, "highlight": false, "start_time": 27.2, "strikethrough": false}, {"text": " of", "end_time": 27.73, "highlight": false, "start_time": 27.52, "strikethrough": false}, {"text": " August", "end_time": 28.33, "highlight": false, "start_time": 27.73, "strikethrough": false}, {"text": " and", "end_time": 28.45, "highlight": false, "start_time": 28.33, "strikethrough": false}, {"text": " then", "end_time": 28.6, "highlight": false, "start_time": 28.45, "strikethrough": false}, {"text": " moving", "end_time": 28.9, "highlight": false, "start_time": 28.6, "strikethrough": false}, {"text": " directly", "end_time": 29.44, "highlight": false, "start_time": 28.9, "strikethrough": false}, {"text": " to", "end_time": 29.68, "highlight": false, "start_time": 29.44, "strikethrough": false}, {"text": " the", "end_time": 29.8, "highlight": false, "start_time": 29.68, "strikethrough": false}, {"text": " U.K.,", "end_time": 30.43, "highlight": false, "start_time": 29.8, "strikethrough": false}, {"text": " or", "end_time": 30.82, "highlight": false, "start_time": 30.43, "strikethrough": false}, {"text": " are", "end_time": 31.33, "highlight": false, "start_time": 31.12, "strikethrough": false}, {"text": " you", "end_time": 31.39, "highlight": false, "start_time": 31.33, "strikethrough": false}, {"text": " planning", "end_time": 31.78, "highlight": false, "start_time": 31.39, "strikethrough": false}, {"text": " on", "end_time": 31.96, "highlight": false, "start_time": 31.78, "strikethrough": false}, {"text": " maybe", "end_time": 32.23, "highlight": false, "start_time": 31.96, "strikethrough": false}, {"text": " coming", "end_time": 32.53, "highlight": false, "start_time": 32.23, "strikethrough": false}, {"text": " back", "end_time": 32.83, "highlight": false, "start_time": 32.53, "strikethrough": false}, {"text": " in", "end_time": 32.98, "highlight": false, "start_time": 32.83, "strikethrough": false}, {"text": " September", "end_time": 33.85, "highlight": false, "start_time": 32.98, "strikethrough": false}, {"text": " to", "end_time": 34.72, "highlight": false, "start_time": 34.54, "strikethrough": false}, {"text": " Berlin?", "end_time": 35.11, "highlight": false, "start_time": 34.72, "strikethrough": false}, {"text": " Because", "end_time": 35.95, "highlight": false, "start_time": 35.62, "strikethrough": false}, {"text": " I", "end_time": 36.01, "highlight": false, "start_time": 35.95, "strikethrough": false}, {"text": " think", "end_time": 36.19, "highlight": false, "start_time": 36.01, "strikethrough": false}, {"text": " that", "end_time": 36.34, "highlight": false, "start_time": 36.19, "strikethrough": false}, {"text": " would", "end_time": 36.46, "highlight": false, "start_time": 36.34, "strikethrough": false}, {"text": " be", "end_time": 36.58, "highlight": false, "start_time": 36.46, "strikethrough": false}, {"text": " nice.", "end_time": 37, "highlight": false, "start_time": 36.58, "strikethrough": false}, {"text": " Otherwise,", "end_time": 37.86, "highlight": false, "start_time": 37, "strikethrough": false}, {"text": " the", "end_time": 38.4, "highlight": false, "start_time": 38.26, "strikethrough": false}, {"text": " probably", "end_time": 39.1, "highlight": false, "start_time": 38.41, "strikethrough": false}, {"text": " in-person", "end_time": 39.88, "highlight": false, "start_time": 39.1, "strikethrough": false}, {"text": " farewell", "end_time": 40.48, "highlight": false, "start_time": 39.88, "strikethrough": false}, {"text": " will", "end_time": 40.66, "highlight": false, "start_time": 40.48, "strikethrough": false}, {"text": " already", "end_time": 40.93, "highlight": false, "start_time": 40.66, "strikethrough": false}, {"text": " be", "end_time": 41.08, "highlight": false, "start_time": 40.93, "strikethrough": false}, {"text": " next", "end_time": 41.32, "highlight": false, "start_time": 41.08, "strikethrough": false}, {"text": " for", "end_time": 41.41, "highlight": false, "start_time": 41.32, "strikethrough": false}, {"text": " you,", "end_time": 41.5, "highlight": false, "start_time": 41.41, "strikethrough": false}, {"text": " right?", "end_time": 41.89, "highlight": false, "start_time": 41.5, "strikethrough": false}, {"text": " Let", "end_time": 42.37, "highlight": false, "start_time": 42.22, "strikethrough": false}, {"text": " me", "end_time": 42.46, "highlight": false, "start_time": 42.37, "strikethrough": false}, {"text": " know.", "end_time": 42.76, "highlight": false, "start_time": 42.46, "strikethrough": false}], "speaker": "Speaker1", "end_time": 42.76, "start_time": 0.94}]	completed
d409635b-1c1e-4f2d-bae1-f21c38658584	2021-08-04 16:06:34.002+00	2021-08-04 16:09:35.495751+00	XQlajMnv	[{"words": [{"text": "Hey,", "end_time": 1.02, "highlight": false, "start_time": 0.78, "strikethrough": false}, {"text": " Roland,", "end_time": 1.37, "highlight": false, "start_time": 1.02, "strikethrough": false}, {"text": " sorry", "end_time": 1.95, "highlight": false, "start_time": 1.62, "strikethrough": false}, {"text": " again,", "end_time": 2.25, "highlight": false, "start_time": 1.95, "strikethrough": false}, {"text": " I", "end_time": 2.34, "highlight": false, "start_time": 2.25, "strikethrough": false}, {"text": " don't", "end_time": 2.52, "highlight": false, "start_time": 2.34, "strikethrough": false}, {"text": " know", "end_time": 2.67, "highlight": false, "start_time": 2.52, "strikethrough": false}, {"text": " why", "end_time": 2.82, "highlight": false, "start_time": 2.67, "strikethrough": false}, {"text": " I", "end_time": 2.88, "highlight": false, "start_time": 2.82, "strikethrough": false}, {"text": " didn't", "end_time": 3.12, "highlight": false, "start_time": 2.88, "strikethrough": false}, {"text": " hear", "end_time": 3.39, "highlight": false, "start_time": 3.12, "strikethrough": false}, {"text": " you.", "end_time": 3.78, "highlight": false, "start_time": 3.39, "strikethrough": false}, {"text": " I", "end_time": 4.23, "highlight": false, "start_time": 4.11, "strikethrough": false}, {"text": " will", "end_time": 4.41, "highlight": false, "start_time": 4.23, "strikethrough": false}, {"text": " definitely", "end_time": 5.46, "highlight": false, "start_time": 4.83, "strikethrough": false}, {"text": " I", "end_time": 5.55, "highlight": false, "start_time": 5.46, "strikethrough": false}, {"text": " will", "end_time": 5.67, "highlight": false, "start_time": 5.55, "strikethrough": false}, {"text": " have", "end_time": 5.85, "highlight": false, "start_time": 5.67, "strikethrough": false}, {"text": " to", "end_time": 5.94, "highlight": false, "start_time": 5.85, "strikethrough": false}, {"text": " check", "end_time": 6.24, "highlight": false, "start_time": 5.94, "strikethrough": false}, {"text": " the", "end_time": 6.66, "highlight": false, "start_time": 6.24, "strikethrough": false}, {"text": " slack", "end_time": 7.11, "highlight": false, "start_time": 6.66, "strikethrough": false}, {"text": " and", "end_time": 7.2, "highlight": false, "start_time": 7.11, "strikethrough": false}, {"text": " even", "end_time": 7.41, "highlight": false, "start_time": 7.2, "strikethrough": false}, {"text": " your", "end_time": 7.56, "highlight": false, "start_time": 7.41, "strikethrough": false}, {"text": " latest", "end_time": 7.92, "highlight": false, "start_time": 7.56, "strikethrough": false}, {"text": " message", "end_time": 8.34, "highlight": false, "start_time": 7.92, "strikethrough": false}, {"text": " I", "end_time": 8.49, "highlight": false, "start_time": 8.34, "strikethrough": false}, {"text": " didn't", "end_time": 8.82, "highlight": false, "start_time": 8.49, "strikethrough": false}, {"text": " hear.", "end_time": 9.09, "highlight": false, "start_time": 8.82, "strikethrough": false}, {"text": " But", "end_time": 9.96, "highlight": false, "start_time": 9.57, "strikethrough": false}, {"text": " so", "end_time": 10.2, "highlight": false, "start_time": 9.96, "strikethrough": false}, {"text": " now", "end_time": 10.44, "highlight": false, "start_time": 10.2, "strikethrough": false}, {"text": " quickly", "end_time": 11.07, "highlight": false, "start_time": 10.44, "strikethrough": false}, {"text": " on", "end_time": 11.52, "highlight": false, "start_time": 11.1, "strikethrough": false}, {"text": " the", "end_time": 11.64, "highlight": false, "start_time": 11.52, "strikethrough": false}, {"text": " bug.", "end_time": 11.97, "highlight": false, "start_time": 11.64, "strikethrough": false}, {"text": " So", "end_time": 12.23, "highlight": false, "start_time": 12, "strikethrough": false}, {"text": " actually,", "end_time": 12.6, "highlight": false, "start_time": 12.24, "strikethrough": false}, {"text": " after", "end_time": 12.96, "highlight": false, "start_time": 12.6, "strikethrough": false}, {"text": " our", "end_time": 13.32, "highlight": false, "start_time": 12.96, "strikethrough": false}, {"text": " call", "end_time": 13.56, "highlight": false, "start_time": 13.32, "strikethrough": false}, {"text": " in", "end_time": 13.65, "highlight": false, "start_time": 13.56, "strikethrough": false}, {"text": " the", "end_time": 13.74, "highlight": false, "start_time": 13.65, "strikethrough": false}, {"text": " morning,", "end_time": 14.16, "highlight": false, "start_time": 13.74, "strikethrough": false}, {"text": " I", "end_time": 14.34, "highlight": false, "start_time": 14.16, "strikethrough": false}, {"text": " checked", "end_time": 14.64, "highlight": false, "start_time": 14.34, "strikethrough": false}, {"text": " the", "end_time": 14.73, "highlight": false, "start_time": 14.64, "strikethrough": false}, {"text": " bugs", "end_time": 15.09, "highlight": false, "start_time": 14.73, "strikethrough": false}, {"text": " and", "end_time": 15.39, "highlight": false, "start_time": 15.09, "strikethrough": false}, {"text": " bugs", "end_time": 16.08, "highlight": false, "start_time": 15.81, "strikethrough": false}, {"text": " list.", "end_time": 16.27, "highlight": false, "start_time": 16.09, "strikethrough": false}, {"text": " And", "end_time": 16.62, "highlight": false, "start_time": 16.32, "strikethrough": false}, {"text": " if", "end_time": 16.89, "highlight": false, "start_time": 16.62, "strikethrough": false}, {"text": " I'm", "end_time": 17.07, "highlight": false, "start_time": 16.89, "strikethrough": false}, {"text": " honest,", "end_time": 17.43, "highlight": false, "start_time": 17.07, "strikethrough": false}, {"text": " not", "end_time": 17.7, "highlight": false, "start_time": 17.43, "strikethrough": false}, {"text": " that", "end_time": 17.97, "highlight": false, "start_time": 17.7, "strikethrough": false}, {"text": " much", "end_time": 18.42, "highlight": false, "start_time": 17.97, "strikethrough": false}, {"text": " has", "end_time": 18.81, "highlight": false, "start_time": 18.42, "strikethrough": false}, {"text": " improved.", "end_time": 19.35, "highlight": false, "start_time": 18.81, "strikethrough": false}, {"text": " One", "end_time": 20.64, "highlight": false, "start_time": 20.31, "strikethrough": false}, {"text": " thing", "end_time": 21.06, "highlight": false, "start_time": 20.64, "strikethrough": false}, {"text": " I", "end_time": 22.35, "highlight": false, "start_time": 22.14, "strikethrough": false}, {"text": " have", "end_time": 22.56, "highlight": false, "start_time": 22.35, "strikethrough": false}, {"text": " closed", "end_time": 22.92, "highlight": false, "start_time": 22.56, "strikethrough": false}, {"text": " the", "end_time": 24.03, "highlight": false, "start_time": 22.92, "strikethrough": false}, {"text": " bug", "end_time": 24.36, "highlight": false, "start_time": 24.03, "strikethrough": false}, {"text": " eye", "end_time": 24.48, "highlight": false, "start_time": 24.36, "strikethrough": false}, {"text": " open", "end_time": 24.78, "highlight": false, "start_time": 24.48, "strikethrough": false}, {"text": " for", "end_time": 25.14, "highlight": false, "start_time": 24.78, "strikethrough": false}, {"text": " collapsing", "end_time": 25.89, "highlight": false, "start_time": 25.14, "strikethrough": false}, {"text": " them", "end_time": 26.31, "highlight": false, "start_time": 25.89, "strikethrough": false}, {"text": " and", "end_time": 27.6, "highlight": false, "start_time": 27, "strikethrough": false}, {"text": " the", "end_time": 28.52, "highlight": false, "start_time": 28.42, "strikethrough": false}, {"text": " room", "end_time": 28.77, "highlight": false, "start_time": 28.53, "strikethrough": false}, {"text": " card", "end_time": 29.08, "highlight": false, "start_time": 28.77, "strikethrough": false}, {"text": " in", "end_time": 29.25, "highlight": false, "start_time": 29.1, "strikethrough": false}, {"text": " the", "end_time": 29.34, "highlight": false, "start_time": 29.25, "strikethrough": false}, {"text": " homepage.", "end_time": 29.76, "highlight": false, "start_time": 29.34, "strikethrough": false}, {"text": " Right.", "end_time": 29.96, "highlight": false, "start_time": 29.76, "strikethrough": false}, {"text": " But", "end_time": 30.09, "highlight": false, "start_time": 29.97, "strikethrough": false}, {"text": " I", "end_time": 30.18, "highlight": false, "start_time": 30.09, "strikethrough": false}, {"text": " think", "end_time": 30.39, "highlight": false, "start_time": 30.18, "strikethrough": false}, {"text": " I", "end_time": 30.48, "highlight": false, "start_time": 30.39, "strikethrough": false}, {"text": " mentioned", "end_time": 30.87, "highlight": false, "start_time": 30.48, "strikethrough": false}, {"text": " this", "end_time": 31.05, "highlight": false, "start_time": 30.87, "strikethrough": false}, {"text": " to", "end_time": 31.17, "highlight": false, "start_time": 31.05, "strikethrough": false}, {"text": " you.", "end_time": 31.4, "highlight": false, "start_time": 31.17, "strikethrough": false}, {"text": " Another", "end_time": 32.31, "highlight": false, "start_time": 31.83, "strikethrough": false}, {"text": " one", "end_time": 32.61, "highlight": false, "start_time": 32.31, "strikethrough": false}, {"text": " is", "end_time": 32.97, "highlight": false, "start_time": 32.61, "strikethrough": false}, {"text": " that", "end_time": 33.99, "highlight": false, "start_time": 33.75, "strikethrough": false}, {"text": " improved.", "end_time": 34.53, "highlight": false, "start_time": 33.99, "strikethrough": false}, {"text": " It", "end_time": 34.74, "highlight": false, "start_time": 34.53, "strikethrough": false}, {"text": " is", "end_time": 34.91, "highlight": false, "start_time": 34.74, "strikethrough": false}, {"text": " new.", "end_time": 35.1, "highlight": false, "start_time": 34.92, "strikethrough": false}, {"text": " Top", "end_time": 35.34, "highlight": false, "start_time": 35.1, "strikethrough": false}, {"text": " of", "end_time": 35.4, "highlight": false, "start_time": 35.34, "strikethrough": false}, {"text": " creation", "end_time": 35.94, "highlight": false, "start_time": 35.41, "strikethrough": false}, {"text": " in", "end_time": 36.15, "highlight": false, "start_time": 35.97, "strikethrough": false}, {"text": " the", "end_time": 36.24, "highlight": false, "start_time": 36.15, "strikethrough": false}, {"text": " top", "end_time": 36.52, "highlight": false, "start_time": 36.24, "strikethrough": false}, {"text": " container.", "end_time": 37.26, "highlight": false, "start_time": 36.54, "strikethrough": false}, {"text": " I", "end_time": 38.58, "highlight": false, "start_time": 38.34, "strikethrough": false}, {"text": " won't", "end_time": 38.76, "highlight": false, "start_time": 38.58, "strikethrough": false}, {"text": " click", "end_time": 39.09, "highlight": false, "start_time": 38.76, "strikethrough": false}, {"text": " it", "end_time": 39.36, "highlight": false, "start_time": 39.09, "strikethrough": false}, {"text": " here", "end_time": 39.87, "highlight": false, "start_time": 39.6, "strikethrough": false}, {"text": " because", "end_time": 40.2, "highlight": false, "start_time": 39.87, "strikethrough": false}, {"text": " now", "end_time": 40.41, "highlight": false, "start_time": 40.2, "strikethrough": false}, {"text": " this", "end_time": 40.59, "highlight": false, "start_time": 40.41, "strikethrough": false}, {"text": " is", "end_time": 40.68, "highlight": false, "start_time": 40.59, "strikethrough": false}, {"text": " my", "end_time": 40.83, "highlight": false, "start_time": 40.68, "strikethrough": false}, {"text": " second", "end_time": 41.28, "highlight": false, "start_time": 40.83, "strikethrough": false}, {"text": " recording,", "end_time": 42.39, "highlight": false, "start_time": 41.7, "strikethrough": false}, {"text": " because", "end_time": 42.9, "highlight": false, "start_time": 42.39, "strikethrough": false}, {"text": " if", "end_time": 43.5, "highlight": false, "start_time": 43.29, "strikethrough": false}, {"text": " I", "end_time": 43.65, "highlight": false, "start_time": 43.5, "strikethrough": false}, {"text": " create", "end_time": 44.04, "highlight": false, "start_time": 43.65, "strikethrough": false}, {"text": " a", "end_time": 44.27, "highlight": false, "start_time": 44.04, "strikethrough": false}, {"text": " new", "end_time": 44.52, "highlight": false, "start_time": 44.31, "strikethrough": false}, {"text": " new", "end_time": 45.06, "highlight": false, "start_time": 44.88, "strikethrough": false}, {"text": " topic", "end_time": 45.42, "highlight": false, "start_time": 45.06, "strikethrough": false}, {"text": " during", "end_time": 45.78, "highlight": false, "start_time": 45.42, "strikethrough": false}, {"text": " recording,", "end_time": 46.47, "highlight": false, "start_time": 45.8, "strikethrough": false}, {"text": " it", "end_time": 46.86, "highlight": false, "start_time": 46.47, "strikethrough": false}, {"text": " turns", "end_time": 47.22, "highlight": false, "start_time": 46.86, "strikethrough": false}, {"text": " off", "end_time": 47.4, "highlight": false, "start_time": 47.22, "strikethrough": false}, {"text": " the", "end_time": 47.55, "highlight": false, "start_time": 47.4, "strikethrough": false}, {"text": " recording.", "end_time": 48.06, "highlight": false, "start_time": 47.55, "strikethrough": false}, {"text": " So", "end_time": 48.26, "highlight": false, "start_time": 48.1, "strikethrough": false}, {"text": " but", "end_time": 48.44, "highlight": false, "start_time": 48.27, "strikethrough": false}, {"text": " basically", "end_time": 48.96, "highlight": false, "start_time": 48.45, "strikethrough": false}, {"text": " new", "end_time": 49.17, "highlight": false, "start_time": 48.96, "strikethrough": false}, {"text": " topic", "end_time": 49.62, "highlight": false, "start_time": 49.17, "strikethrough": false}, {"text": " creation,", "end_time": 50.58, "highlight": false, "start_time": 49.92, "strikethrough": false}, {"text": " the", "end_time": 50.73, "highlight": false, "start_time": 50.58, "strikethrough": false}, {"text": " editing,", "end_time": 51.21, "highlight": false, "start_time": 50.73, "strikethrough": false}, {"text": " I", "end_time": 51.3, "highlight": false, "start_time": 51.21, "strikethrough": false}, {"text": " mean,", "end_time": 51.49, "highlight": false, "start_time": 51.3, "strikethrough": false}, {"text": " or", "end_time": 51.57, "highlight": false, "start_time": 51.51, "strikethrough": false}, {"text": " renaming", "end_time": 52.29, "highlight": false, "start_time": 51.6, "strikethrough": false}, {"text": " inside", "end_time": 52.71, "highlight": false, "start_time": 52.29, "strikethrough": false}, {"text": " the", "end_time": 52.77, "highlight": false, "start_time": 52.71, "strikethrough": false}, {"text": " topic", "end_time": 53.21, "highlight": false, "start_time": 52.77, "strikethrough": false}, {"text": " of", "end_time": 53.34, "highlight": false, "start_time": 53.22, "strikethrough": false}, {"text": " with", "end_time": 53.52, "highlight": false, "start_time": 53.43, "strikethrough": false}, {"text": " the", "end_time": 53.64, "highlight": false, "start_time": 53.55, "strikethrough": false}, {"text": " cursor.", "end_time": 54.1, "highlight": false, "start_time": 53.64, "strikethrough": false}, {"text": " It", "end_time": 54.3, "highlight": false, "start_time": 54.12, "strikethrough": false}, {"text": " works", "end_time": 54.75, "highlight": false, "start_time": 54.3, "strikethrough": false}, {"text": " as", "end_time": 55.2, "highlight": false, "start_time": 54.99, "strikethrough": false}, {"text": " expected.", "end_time": 55.83, "highlight": false, "start_time": 55.2, "strikethrough": false}, {"text": " So", "end_time": 56.61, "highlight": false, "start_time": 56.31, "strikethrough": false}, {"text": " with", "end_time": 56.73, "highlight": false, "start_time": 56.62, "strikethrough": false}, {"text": " that", "end_time": 57.06, "highlight": false, "start_time": 56.73, "strikethrough": false}, {"text": " one", "end_time": 57.48, "highlight": false, "start_time": 57.06, "strikethrough": false}, {"text": " and", "end_time": 58.23, "highlight": false, "start_time": 58.05, "strikethrough": false}, {"text": " then", "end_time": 58.41, "highlight": false, "start_time": 58.23, "strikethrough": false}, {"text": " the", "end_time": 58.53, "highlight": false, "start_time": 58.41, "strikethrough": false}, {"text": " drag,", "end_time": 58.98, "highlight": false, "start_time": 58.53, "strikethrough": false}, {"text": " drag", "end_time": 59.28, "highlight": false, "start_time": 58.98, "strikethrough": false}, {"text": " and", "end_time": 59.37, "highlight": false, "start_time": 59.28, "strikethrough": false}, {"text": " drop", "end_time": 59.61, "highlight": false, "start_time": 59.37, "strikethrough": false}, {"text": " stuff", "end_time": 59.91, "highlight": false, "start_time": 59.61, "strikethrough": false}, {"text": " also", "end_time": 60.27, "highlight": false, "start_time": 59.91, "strikethrough": false}, {"text": " has", "end_time": 60.48, "highlight": false, "start_time": 60.27, "strikethrough": false}, {"text": " been", "end_time": 60.66, "highlight": false, "start_time": 60.48, "strikethrough": false}, {"text": " fixed.", "end_time": 61.03, "highlight": false, "start_time": 60.66, "strikethrough": false}, {"text": " The", "end_time": 61.68, "highlight": false, "start_time": 61.5, "strikethrough": false}, {"text": " thing", "end_time": 61.92, "highlight": false, "start_time": 61.68, "strikethrough": false}, {"text": " is", "end_time": 62.07, "highlight": false, "start_time": 61.92, "strikethrough": false}, {"text": " that", "end_time": 62.31, "highlight": false, "start_time": 62.07, "strikethrough": false}, {"text": " I", "end_time": 62.55, "highlight": false, "start_time": 62.31, "strikethrough": false}, {"text": " entered", "end_time": 63.09, "highlight": false, "start_time": 62.67, "strikethrough": false}, {"text": " here", "end_time": 63.27, "highlight": false, "start_time": 63.09, "strikethrough": false}, {"text": " two", "end_time": 63.51, "highlight": false, "start_time": 63.27, "strikethrough": false}, {"text": " points.", "end_time": 63.93, "highlight": false, "start_time": 63.51, "strikethrough": false}, {"text": " Right.", "end_time": 64.2, "highlight": false, "start_time": 63.93, "strikethrough": false}, {"text": " But", "end_time": 64.62, "highlight": false, "start_time": 64.2, "strikethrough": false}, {"text": " the", "end_time": 64.8, "highlight": false, "start_time": 64.62, "strikethrough": false}, {"text": " fixed", "end_time": 65.19, "highlight": false, "start_time": 64.8, "strikethrough": false}, {"text": " date", "end_time": 65.67, "highlight": false, "start_time": 65.49, "strikethrough": false}, {"text": " fixed", "end_time": 65.94, "highlight": false, "start_time": 65.67, "strikethrough": false}, {"text": " only", "end_time": 66.21, "highlight": false, "start_time": 65.94, "strikethrough": false}, {"text": " the", "end_time": 66.3, "highlight": false, "start_time": 66.21, "strikethrough": false}, {"text": " first", "end_time": 66.57, "highlight": false, "start_time": 66.3, "strikethrough": false}, {"text": " one.", "end_time": 66.75, "highlight": false, "start_time": 66.57, "strikethrough": false}, {"text": " So", "end_time": 66.96, "highlight": false, "start_time": 66.76, "strikethrough": false}, {"text": " the", "end_time": 67.08, "highlight": false, "start_time": 66.96, "strikethrough": false}, {"text": " drag", "end_time": 67.35, "highlight": false, "start_time": 67.08, "strikethrough": false}, {"text": " and", "end_time": 67.47, "highlight": false, "start_time": 67.35, "strikethrough": false}, {"text": " drop", "end_time": 67.74, "highlight": false, "start_time": 67.47, "strikethrough": false}, {"text": " now", "end_time": 67.98, "highlight": false, "start_time": 67.74, "strikethrough": false}, {"text": " works", "end_time": 68.43, "highlight": false, "start_time": 67.98, "strikethrough": false}, {"text": " as", "end_time": 69.27, "highlight": false, "start_time": 69.03, "strikethrough": false}, {"text": " expected.", "end_time": 69.84, "highlight": false, "start_time": 69.27, "strikethrough": false}, {"text": " But", "end_time": 70.11, "highlight": false, "start_time": 69.84, "strikethrough": false}, {"text": " three", "end_time": 70.38, "highlight": false, "start_time": 70.11, "strikethrough": false}, {"text": " dots", "end_time": 70.68, "highlight": false, "start_time": 70.38, "strikethrough": false}, {"text": " are", "end_time": 70.8, "highlight": false, "start_time": 70.68, "strikethrough": false}, {"text": " the", "end_time": 70.92, "highlight": false, "start_time": 70.8, "strikethrough": false}, {"text": " drag", "end_time": 71.16, "highlight": false, "start_time": 70.92, "strikethrough": false}, {"text": " and", "end_time": 71.28, "highlight": false, "start_time": 71.16, "strikethrough": false}, {"text": " drop.", "end_time": 71.48, "highlight": false, "start_time": 71.28, "strikethrough": false}, {"text": " I", "end_time": 71.67, "highlight": false, "start_time": 71.49, "strikethrough": false}, {"text": " can", "end_time": 71.88, "highlight": false, "start_time": 71.67, "strikethrough": false}, {"text": " still", "end_time": 72.36, "highlight": false, "start_time": 71.88, "strikethrough": false}, {"text": " doesn't", "end_time": 73.14, "highlight": false, "start_time": 72.75, "strikethrough": false}, {"text": " work", "end_time": 73.38, "highlight": false, "start_time": 73.14, "strikethrough": false}, {"text": " as", "end_time": 73.5, "highlight": false, "start_time": 73.38, "strikethrough": false}, {"text": " expected.", "end_time": 74.09, "highlight": false, "start_time": 73.5, "strikethrough": false}, {"text": " The", "end_time": 74.61, "highlight": false, "start_time": 74.37, "strikethrough": false}, {"text": " rest,", "end_time": 75.05, "highlight": false, "start_time": 74.61, "strikethrough": false}, {"text": " honestly,", "end_time": 75.72, "highlight": false, "start_time": 75.06, "strikethrough": false}, {"text": " it's", "end_time": 76.02, "highlight": false, "start_time": 75.72, "strikethrough": false}, {"text": " pretty", "end_time": 76.38, "highlight": false, "start_time": 76.02, "strikethrough": false}, {"text": " much", "end_time": 76.86, "highlight": false, "start_time": 76.38, "strikethrough": false}, {"text": " the", "end_time": 78.15, "highlight": false, "start_time": 78, "strikethrough": false}, {"text": " same.", "end_time": 78.6, "highlight": false, "start_time": 78.15, "strikethrough": false}, {"text": " And", "end_time": 78.96, "highlight": false, "start_time": 78.6, "strikethrough": false}, {"text": " I", "end_time": 79.17, "highlight": false, "start_time": 78.96, "strikethrough": false}, {"text": " wouldn't", "end_time": 79.53, "highlight": false, "start_time": 79.17, "strikethrough": false}, {"text": " say", "end_time": 79.74, "highlight": false, "start_time": 79.53, "strikethrough": false}, {"text": " that", "end_time": 79.92, "highlight": false, "start_time": 79.74, "strikethrough": false}, {"text": " there", "end_time": 80.1, "highlight": false, "start_time": 79.92, "strikethrough": false}, {"text": " is", "end_time": 80.22, "highlight": false, "start_time": 80.1, "strikethrough": false}, {"text": " much", "end_time": 80.61, "highlight": false, "start_time": 80.22, "strikethrough": false}, {"text": " improvement", "end_time": 81.33, "highlight": false, "start_time": 80.61, "strikethrough": false}, {"text": " at", "end_time": 81.54, "highlight": false, "start_time": 81.33, "strikethrough": false}, {"text": " this", "end_time": 81.96, "highlight": false, "start_time": 81.54, "strikethrough": false}, {"text": " point.", "end_time": 82.58, "highlight": false, "start_time": 81.96, "strikethrough": false}, {"text": " So", "end_time": 83.49, "highlight": false, "start_time": 83.25, "strikethrough": false}, {"text": " that's", "end_time": 83.82, "highlight": false, "start_time": 83.49, "strikethrough": false}, {"text": " in", "end_time": 84.33, "highlight": false, "start_time": 83.82, "strikethrough": false}, {"text": " terms", "end_time": 85.02, "highlight": false, "start_time": 84.33, "strikethrough": false}, {"text": " of", "end_time": 85.59, "highlight": false, "start_time": 85.02, "strikethrough": false}, {"text": " bugs.", "end_time": 86.48, "highlight": false, "start_time": 85.92, "strikethrough": false}, {"text": " So", "end_time": 86.82, "highlight": false, "start_time": 86.49, "strikethrough": false}, {"text": " I'm", "end_time": 87.06, "highlight": false, "start_time": 86.82, "strikethrough": false}, {"text": " now", "end_time": 87.28, "highlight": false, "start_time": 87.06, "strikethrough": false}, {"text": " uploading", "end_time": 87.87, "highlight": false, "start_time": 87.3, "strikethrough": false}, {"text": " this", "end_time": 88.17, "highlight": false, "start_time": 87.87, "strikethrough": false}, {"text": " video.", "end_time": 88.8, "highlight": false, "start_time": 88.17, "strikethrough": false}], "speaker": "Speaker1", "end_time": 88.8, "start_time": 0.78}]	completed
58858411-10c3-432e-8e6b-40a6af1cabaa	2021-08-04 16:11:46.975+00	2021-08-04 16:14:29.66341+00	VvAzowM2	[{"words": [{"text": "Next", "end_time": 1.92, "highlight": false, "start_time": 1.53, "strikethrough": false}, {"text": " thing", "end_time": 2.22, "highlight": false, "start_time": 1.92, "strikethrough": false}, {"text": " on", "end_time": 2.43, "highlight": false, "start_time": 2.22, "strikethrough": false}, {"text": " the", "end_time": 2.55, "highlight": false, "start_time": 2.43, "strikethrough": false}, {"text": " aha", "end_time": 2.88, "highlight": false, "start_time": 2.55, "strikethrough": false}, {"text": " moment,", "end_time": 3.33, "highlight": false, "start_time": 2.88, "strikethrough": false}, {"text": " on", "end_time": 3.48, "highlight": false, "start_time": 3.33, "strikethrough": false}, {"text": " this", "end_time": 3.87, "highlight": false, "start_time": 3.49, "strikethrough": false}, {"text": " special", "end_time": 4.8, "highlight": false, "start_time": 4.35, "strikethrough": false}, {"text": " moment,", "end_time": 5.25, "highlight": false, "start_time": 4.8, "strikethrough": false}, {"text": " I", "end_time": 5.7, "highlight": false, "start_time": 5.49, "strikethrough": false}, {"text": " actually", "end_time": 6.03, "highlight": false, "start_time": 5.7, "strikethrough": false}, {"text": " spent", "end_time": 6.36, "highlight": false, "start_time": 6.03, "strikethrough": false}, {"text": " most", "end_time": 6.63, "highlight": false, "start_time": 6.36, "strikethrough": false}, {"text": " of", "end_time": 6.75, "highlight": false, "start_time": 6.63, "strikethrough": false}, {"text": " the", "end_time": 6.84, "highlight": false, "start_time": 6.75, "strikethrough": false}, {"text": " day", "end_time": 7.2, "highlight": false, "start_time": 6.84, "strikethrough": false}, {"text": " working", "end_time": 7.98, "highlight": false, "start_time": 7.5, "strikethrough": false}, {"text": " on", "end_time": 8.16, "highlight": false, "start_time": 7.98, "strikethrough": false}, {"text": " this", "end_time": 8.46, "highlight": false, "start_time": 8.16, "strikethrough": false}, {"text": " one,", "end_time": 8.85, "highlight": false, "start_time": 8.46, "strikethrough": false}, {"text": " basically", "end_time": 10.57, "highlight": false, "start_time": 9.87, "strikethrough": false}, {"text": " I", "end_time": 11.34, "highlight": false, "start_time": 10.57, "strikethrough": false}, {"text": " created", "end_time": 12, "highlight": false, "start_time": 11.43, "strikethrough": false}, {"text": " this", "end_time": 12.42, "highlight": false, "start_time": 12, "strikethrough": false}, {"text": " document", "end_time": 13.44, "highlight": false, "start_time": 12.84, "strikethrough": false}, {"text": " and", "end_time": 13.74, "highlight": false, "start_time": 13.44, "strikethrough": false}, {"text": " in", "end_time": 14.22, "highlight": false, "start_time": 13.98, "strikethrough": false}, {"text": " Sigma,", "end_time": 14.78, "highlight": false, "start_time": 14.3, "strikethrough": false}, {"text": " I", "end_time": 15.93, "highlight": false, "start_time": 15.69, "strikethrough": false}, {"text": " know", "end_time": 16.11, "highlight": false, "start_time": 15.93, "strikethrough": false}, {"text": " that", "end_time": 16.26, "highlight": false, "start_time": 16.11, "strikethrough": false}, {"text": " you", "end_time": 16.35, "highlight": false, "start_time": 16.26, "strikethrough": false}, {"text": " prefer", "end_time": 16.68, "highlight": false, "start_time": 16.36, "strikethrough": false}, {"text": " having", "end_time": 16.98, "highlight": false, "start_time": 16.68, "strikethrough": false}, {"text": " the", "end_time": 17.17, "highlight": false, "start_time": 17.11, "strikethrough": false}, {"text": " notion", "end_time": 17.61, "highlight": false, "start_time": 17.17, "strikethrough": false}, {"text": " I", "end_time": 17.73, "highlight": false, "start_time": 17.61, "strikethrough": false}, {"text": " can", "end_time": 17.91, "highlight": false, "start_time": 17.73, "strikethrough": false}, {"text": " copy", "end_time": 18.18, "highlight": false, "start_time": 17.91, "strikethrough": false}, {"text": " paste", "end_time": 18.45, "highlight": false, "start_time": 18.18, "strikethrough": false}, {"text": " it,", "end_time": 18.54, "highlight": false, "start_time": 18.45, "strikethrough": false}, {"text": " the", "end_time": 18.6, "highlight": false, "start_time": 18.54, "strikethrough": false}, {"text": " notion", "end_time": 18.99, "highlight": false, "start_time": 18.6, "strikethrough": false}, {"text": " it", "end_time": 19.14, "highlight": false, "start_time": 18.99, "strikethrough": false}, {"text": " was", "end_time": 19.32, "highlight": false, "start_time": 19.14, "strikethrough": false}, {"text": " just", "end_time": 19.56, "highlight": false, "start_time": 19.32, "strikethrough": false}, {"text": " my", "end_time": 19.74, "highlight": false, "start_time": 19.56, "strikethrough": false}, {"text": " working", "end_time": 20.07, "highlight": false, "start_time": 19.74, "strikethrough": false}, {"text": " file.", "end_time": 20.49, "highlight": false, "start_time": 20.07, "strikethrough": false}, {"text": " So", "end_time": 21.81, "highlight": false, "start_time": 20.88, "strikethrough": false}, {"text": " I", "end_time": 22.08, "highlight": false, "start_time": 21.81, "strikethrough": false}, {"text": " went", "end_time": 22.32, "highlight": false, "start_time": 22.08, "strikethrough": false}, {"text": " through", "end_time": 22.56, "highlight": false, "start_time": 22.32, "strikethrough": false}, {"text": " some", "end_time": 22.8, "highlight": false, "start_time": 22.56, "strikethrough": false}, {"text": " feedback", "end_time": 23.19, "highlight": false, "start_time": 22.8, "strikethrough": false}, {"text": " from", "end_time": 23.46, "highlight": false, "start_time": 23.19, "strikethrough": false}, {"text": " vision", "end_time": 23.88, "highlight": false, "start_time": 23.46, "strikethrough": false}, {"text": " errors.", "end_time": 24.18, "highlight": false, "start_time": 23.88, "strikethrough": false}, {"text": " I", "end_time": 24.3, "highlight": false, "start_time": 24.18, "strikethrough": false}, {"text": " went", "end_time": 24.51, "highlight": false, "start_time": 24.3, "strikethrough": false}, {"text": " through", "end_time": 24.72, "highlight": false, "start_time": 24.51, "strikethrough": false}, {"text": " through", "end_time": 25.17, "highlight": false, "start_time": 24.96, "strikethrough": false}, {"text": " our", "end_time": 25.5, "highlight": false, "start_time": 25.17, "strikethrough": false}, {"text": " last", "end_time": 26.07, "highlight": false, "start_time": 25.5, "strikethrough": false}, {"text": " session,", "end_time": 27.21, "highlight": false, "start_time": 26.55, "strikethrough": false}, {"text": " the", "end_time": 27.33, "highlight": false, "start_time": 27.21, "strikethrough": false}, {"text": " product", "end_time": 27.69, "highlight": false, "start_time": 27.39, "strikethrough": false}, {"text": " session", "end_time": 28.14, "highlight": false, "start_time": 27.7, "strikethrough": false}, {"text": " where", "end_time": 28.65, "highlight": false, "start_time": 28.14, "strikethrough": false}, {"text": " Omar", "end_time": 30.24, "highlight": false, "start_time": 29.85, "strikethrough": false}, {"text": " opened", "end_time": 30.81, "highlight": false, "start_time": 30.24, "strikethrough": false}, {"text": " the", "end_time": 30.99, "highlight": false, "start_time": 30.81, "strikethrough": false}, {"text": " topic", "end_time": 31.38, "highlight": false, "start_time": 30.99, "strikethrough": false}, {"text": " about", "end_time": 31.74, "highlight": false, "start_time": 31.38, "strikethrough": false}, {"text": " incentives", "end_time": 32.46, "highlight": false, "start_time": 31.74, "strikethrough": false}, {"text": " for", "end_time": 33.36, "highlight": false, "start_time": 33.12, "strikethrough": false}, {"text": " closing", "end_time": 33.75, "highlight": false, "start_time": 33.36, "strikethrough": false}, {"text": " the", "end_time": 33.84, "highlight": false, "start_time": 33.75, "strikethrough": false}, {"text": " room.", "end_time": 34.05, "highlight": false, "start_time": 33.84, "strikethrough": false}, {"text": " And", "end_time": 34.17, "highlight": false, "start_time": 34.05, "strikethrough": false}, {"text": " generally.", "end_time": 34.62, "highlight": false, "start_time": 34.17, "strikethrough": false}, {"text": " So,", "end_time": 35.04, "highlight": false, "start_time": 34.62, "strikethrough": false}, {"text": " I", "end_time": 36.42, "highlight": false, "start_time": 36.21, "strikethrough": false}, {"text": " mean,", "end_time": 36.75, "highlight": false, "start_time": 36.42, "strikethrough": false}, {"text": " yeah,", "end_time": 38.1, "highlight": false, "start_time": 37.74, "strikethrough": false}, {"text": " the", "end_time": 38.97, "highlight": false, "start_time": 38.85, "strikethrough": false}, {"text": " most", "end_time": 39.33, "highlight": false, "start_time": 39, "strikethrough": false}, {"text": " part", "end_time": 39.63, "highlight": false, "start_time": 39.33, "strikethrough": false}, {"text": " for", "end_time": 40.05, "highlight": false, "start_time": 39.81, "strikethrough": false}, {"text": " me", "end_time": 40.35, "highlight": false, "start_time": 40.05, "strikethrough": false}, {"text": " is", "end_time": 40.5, "highlight": false, "start_time": 40.35, "strikethrough": false}, {"text": " actually", "end_time": 40.88, "highlight": false, "start_time": 40.5, "strikethrough": false}, {"text": " this", "end_time": 41.37, "highlight": false, "start_time": 40.89, "strikethrough": false}, {"text": " redefining", "end_time": 42.3, "highlight": false, "start_time": 41.49, "strikethrough": false}, {"text": " maybe", "end_time": 42.6, "highlight": false, "start_time": 42.3, "strikethrough": false}, {"text": " some", "end_time": 42.84, "highlight": false, "start_time": 42.6, "strikethrough": false}, {"text": " logic,", "end_time": 43.26, "highlight": false, "start_time": 42.84, "strikethrough": false}, {"text": " but", "end_time": 43.44, "highlight": false, "start_time": 43.26, "strikethrough": false}, {"text": " it's", "end_time": 43.59, "highlight": false, "start_time": 43.44, "strikethrough": false}, {"text": " again,", "end_time": 43.86, "highlight": false, "start_time": 43.59, "strikethrough": false}, {"text": " just", "end_time": 44.13, "highlight": false, "start_time": 43.86, "strikethrough": false}, {"text": " my", "end_time": 44.34, "highlight": false, "start_time": 44.13, "strikethrough": false}, {"text": " perspective.", "end_time": 44.97, "highlight": false, "start_time": 44.34, "strikethrough": false}, {"text": " Right.", "end_time": 45.3, "highlight": false, "start_time": 44.97, "strikethrough": false}, {"text": " And", "end_time": 45.57, "highlight": false, "start_time": 45.3, "strikethrough": false}, {"text": " based", "end_time": 46.32, "highlight": false, "start_time": 45.9, "strikethrough": false}, {"text": " on", "end_time": 46.47, "highlight": false, "start_time": 46.32, "strikethrough": false}, {"text": " that,", "end_time": 46.83, "highlight": false, "start_time": 46.47, "strikethrough": false}, {"text": " I", "end_time": 47.37, "highlight": false, "start_time": 47.19, "strikethrough": false}, {"text": " thought", "end_time": 47.72, "highlight": false, "start_time": 47.37, "strikethrough": false}, {"text": " maybe", "end_time": 48.42, "highlight": false, "start_time": 47.82, "strikethrough": false}, {"text": " what", "end_time": 50.22, "highlight": false, "start_time": 49.56, "strikethrough": false}, {"text": " possible", "end_time": 50.82, "highlight": false, "start_time": 50.22, "strikethrough": false}, {"text": " way", "end_time": 51.09, "highlight": false, "start_time": 50.82, "strikethrough": false}, {"text": " could", "end_time": 51.48, "highlight": false, "start_time": 51.27, "strikethrough": false}, {"text": " we", "end_time": 51.72, "highlight": false, "start_time": 51.48, "strikethrough": false}, {"text": " redefine", "end_time": 52.53, "highlight": false, "start_time": 51.72, "strikethrough": false}, {"text": " the", "end_time": 52.95, "highlight": false, "start_time": 52.53, "strikethrough": false}, {"text": " a", "end_time": 53.62, "highlight": false, "start_time": 53.51, "strikethrough": false}, {"text": " cappella", "end_time": 54.39, "highlight": false, "start_time": 53.82, "strikethrough": false}, {"text": " or", "end_time": 54.54, "highlight": false, "start_time": 54.39, "strikethrough": false}, {"text": " at", "end_time": 54.66, "highlight": false, "start_time": 54.54, "strikethrough": false}, {"text": " least", "end_time": 54.9, "highlight": false, "start_time": 54.66, "strikethrough": false}, {"text": " for", "end_time": 55.11, "highlight": false, "start_time": 54.9, "strikethrough": false}, {"text": " this", "end_time": 55.44, "highlight": false, "start_time": 55.11, "strikethrough": false}, {"text": " very,", "end_time": 56.13, "highlight": false, "start_time": 55.71, "strikethrough": false}, {"text": " very", "end_time": 56.52, "highlight": false, "start_time": 56.13, "strikethrough": false}, {"text": " simplistic", "end_time": 57.48, "highlight": false, "start_time": 56.79, "strikethrough": false}, {"text": " one", "end_time": 57.96, "highlight": false, "start_time": 57.48, "strikethrough": false}, {"text": " use", "end_time": 58.32, "highlight": false, "start_time": 57.99, "strikethrough": false}, {"text": " case", "end_time": 58.68, "highlight": false, "start_time": 58.32, "strikethrough": false}, {"text": " right", "end_time": 59.04, "highlight": false, "start_time": 58.68, "strikethrough": false}, {"text": " here", "end_time": 60.04, "highlight": false, "start_time": 59.76, "strikethrough": false}, {"text": " is", "end_time": 60.12, "highlight": false, "start_time": 60.04, "strikethrough": false}, {"text": " the", "end_time": 60.27, "highlight": false, "start_time": 60.12, "strikethrough": false}, {"text": " entire", "end_time": 60.99, "highlight": false, "start_time": 60.27, "strikethrough": false}, {"text": " entire", "end_time": 63.21, "highlight": false, "start_time": 62.46, "strikethrough": false}, {"text": " idea.", "end_time": 64.05, "highlight": false, "start_time": 63.66, "strikethrough": false}, {"text": " Put", "end_time": 64.71, "highlight": false, "start_time": 64.5, "strikethrough": false}, {"text": " the", "end_time": 64.86, "highlight": false, "start_time": 64.71, "strikethrough": false}, {"text": " words", "end_time": 65.22, "highlight": false, "start_time": 64.86, "strikethrough": false}, {"text": " right.", "end_time": 65.51, "highlight": false, "start_time": 65.22, "strikethrough": false}, {"text": " I", "end_time": 66.03, "highlight": false, "start_time": 65.79, "strikethrough": false}, {"text": " think", "end_time": 66.57, "highlight": false, "start_time": 66.03, "strikethrough": false}, {"text": " I", "end_time": 66.99, "highlight": false, "start_time": 66.81, "strikethrough": false}, {"text": " will", "end_time": 67.08, "highlight": false, "start_time": 66.99, "strikethrough": false}, {"text": " just", "end_time": 67.26, "highlight": false, "start_time": 67.08, "strikethrough": false}, {"text": " put", "end_time": 67.44, "highlight": false, "start_time": 67.26, "strikethrough": false}, {"text": " the", "end_time": 67.56, "highlight": false, "start_time": 67.44, "strikethrough": false}, {"text": " link", "end_time": 67.8, "highlight": false, "start_time": 67.56, "strikethrough": false}, {"text": " here", "end_time": 68.13, "highlight": false, "start_time": 67.8, "strikethrough": false}, {"text": " in", "end_time": 68.53, "highlight": false, "start_time": 68.37, "strikethrough": false}, {"text": " a", "end_time": 68.61, "highlight": false, "start_time": 68.55, "strikethrough": false}, {"text": " cappella.", "end_time": 69.2, "highlight": false, "start_time": 68.61, "strikethrough": false}, {"text": " If", "end_time": 69.43, "highlight": false, "start_time": 69.21, "strikethrough": false}, {"text": " you", "end_time": 69.51, "highlight": false, "start_time": 69.43, "strikethrough": false}, {"text": " if", "end_time": 69.87, "highlight": false, "start_time": 69.69, "strikethrough": false}, {"text": " you", "end_time": 69.99, "highlight": false, "start_time": 69.87, "strikethrough": false}, {"text": " have", "end_time": 70.23, "highlight": false, "start_time": 69.99, "strikethrough": false}, {"text": " time", "end_time": 70.77, "highlight": false, "start_time": 70.23, "strikethrough": false}, {"text": " to", "end_time": 71.04, "highlight": false, "start_time": 71.01, "strikethrough": false}, {"text": " review", "end_time": 71.52, "highlight": false, "start_time": 71.07, "strikethrough": false}, {"text": " it,", "end_time": 71.73, "highlight": false, "start_time": 71.52, "strikethrough": false}, {"text": " I", "end_time": 72.24, "highlight": false, "start_time": 72, "strikethrough": false}, {"text": " would", "end_time": 72.36, "highlight": false, "start_time": 72.24, "strikethrough": false}, {"text": " prefer", "end_time": 72.81, "highlight": false, "start_time": 72.36, "strikethrough": false}, {"text": " to", "end_time": 73.2, "highlight": false, "start_time": 72.81, "strikethrough": false}, {"text": " maybe", "end_time": 73.74, "highlight": false, "start_time": 73.2, "strikethrough": false}, {"text": " discuss", "end_time": 74.4, "highlight": false, "start_time": 73.77, "strikethrough": false}, {"text": " it", "end_time": 74.55, "highlight": false, "start_time": 74.4, "strikethrough": false}, {"text": " with", "end_time": 74.82, "highlight": false, "start_time": 74.55, "strikethrough": false}, {"text": " you.", "end_time": 75.24, "highlight": false, "start_time": 74.82, "strikethrough": false}, {"text": " If", "end_time": 75.81, "highlight": false, "start_time": 75.66, "strikethrough": false}, {"text": " I", "end_time": 75.93, "highlight": false, "start_time": 75.81, "strikethrough": false}, {"text": " see", "end_time": 76.14, "highlight": false, "start_time": 75.93, "strikethrough": false}, {"text": " the", "end_time": 76.26, "highlight": false, "start_time": 76.14, "strikethrough": false}, {"text": " problems", "end_time": 77.1, "highlight": false, "start_time": 76.26, "strikethrough": false}, {"text": " and", "end_time": 77.58, "highlight": false, "start_time": 77.43, "strikethrough": false}, {"text": " you", "end_time": 77.76, "highlight": false, "start_time": 77.64, "strikethrough": false}, {"text": " see", "end_time": 77.97, "highlight": false, "start_time": 77.76, "strikethrough": false}, {"text": " the", "end_time": 78.09, "highlight": false, "start_time": 77.97, "strikethrough": false}, {"text": " problems", "end_time": 78.54, "highlight": false, "start_time": 78.09, "strikethrough": false}, {"text": " in", "end_time": 78.87, "highlight": false, "start_time": 78.54, "strikethrough": false}, {"text": " the", "end_time": 78.96, "highlight": false, "start_time": 78.87, "strikethrough": false}, {"text": " same", "end_time": 79.26, "highlight": false, "start_time": 78.96, "strikethrough": false}, {"text": " way,", "end_time": 79.44, "highlight": false, "start_time": 79.26, "strikethrough": false}, {"text": " if", "end_time": 79.53, "highlight": false, "start_time": 79.44, "strikethrough": false}, {"text": " there", "end_time": 79.71, "highlight": false, "start_time": 79.56, "strikethrough": false}, {"text": " is", "end_time": 79.86, "highlight": false, "start_time": 79.71, "strikethrough": false}, {"text": " ideas", "end_time": 80.88, "highlight": false, "start_time": 80.31, "strikethrough": false}, {"text": " worth", "end_time": 81.24, "highlight": false, "start_time": 80.88, "strikethrough": false}, {"text": " of", "end_time": 81.54, "highlight": false, "start_time": 81.24, "strikethrough": false}, {"text": " developing", "end_time": 82.74, "highlight": false, "start_time": 81.81, "strikethrough": false}, {"text": " and", "end_time": 84.54, "highlight": false, "start_time": 83.07, "strikethrough": false}, {"text": " building", "end_time": 85.38, "highlight": false, "start_time": 84.87, "strikethrough": false}, {"text": " further,", "end_time": 85.89, "highlight": false, "start_time": 85.38, "strikethrough": false}, {"text": " if", "end_time": 87.54, "highlight": false, "start_time": 87.27, "strikethrough": false}, {"text": " you", "end_time": 87.63, "highlight": false, "start_time": 87.54, "strikethrough": false}, {"text": " will", "end_time": 87.84, "highlight": false, "start_time": 87.63, "strikethrough": false}, {"text": " see", "end_time": 88.11, "highlight": false, "start_time": 87.84, "strikethrough": false}, {"text": " here", "end_time": 88.56, "highlight": false, "start_time": 88.11, "strikethrough": false}, {"text": " again,", "end_time": 89.43, "highlight": false, "start_time": 88.95, "strikethrough": false}, {"text": " it's", "end_time": 89.69, "highlight": false, "start_time": 89.43, "strikethrough": false}, {"text": " I", "end_time": 89.94, "highlight": false, "start_time": 89.76, "strikethrough": false}, {"text": " would", "end_time": 90.12, "highlight": false, "start_time": 89.94, "strikethrough": false}, {"text": " call", "end_time": 90.42, "highlight": false, "start_time": 90.12, "strikethrough": false}, {"text": " it", "end_time": 90.69, "highlight": false, "start_time": 90.42, "strikethrough": false}, {"text": " what", "end_time": 91.05, "highlight": false, "start_time": 90.69, "strikethrough": false}, {"text": " you", "end_time": 91.2, "highlight": false, "start_time": 91.05, "strikethrough": false}, {"text": " mentioned", "end_time": 91.56, "highlight": false, "start_time": 91.2, "strikethrough": false}, {"text": " some", "end_time": 91.74, "highlight": false, "start_time": 91.56, "strikethrough": false}, {"text": " time", "end_time": 92.01, "highlight": false, "start_time": 91.74, "strikethrough": false}, {"text": " ago,", "end_time": 92.28, "highlight": false, "start_time": 92.01, "strikethrough": false}, {"text": " that", "end_time": 92.55, "highlight": false, "start_time": 92.28, "strikethrough": false}, {"text": " let's", "end_time": 92.85, "highlight": false, "start_time": 92.55, "strikethrough": false}, {"text": " have", "end_time": 93.03, "highlight": false, "start_time": 92.85, "strikethrough": false}, {"text": " some", "end_time": 93.24, "highlight": false, "start_time": 93.03, "strikethrough": false}, {"text": " experiments.", "end_time": 93.9, "highlight": false, "start_time": 93.24, "strikethrough": false}, {"text": " Right.", "end_time": 94.22, "highlight": false, "start_time": 93.9, "strikethrough": false}, {"text": " I", "end_time": 95.1, "highlight": false, "start_time": 94.8, "strikethrough": false}, {"text": " would", "end_time": 95.25, "highlight": false, "start_time": 95.1, "strikethrough": false}, {"text": " say", "end_time": 95.61, "highlight": false, "start_time": 95.25, "strikethrough": false}, {"text": " it", "end_time": 95.76, "highlight": false, "start_time": 95.61, "strikethrough": false}, {"text": " would", "end_time": 95.94, "highlight": false, "start_time": 95.76, "strikethrough": false}, {"text": " go", "end_time": 96.33, "highlight": false, "start_time": 95.94, "strikethrough": false}, {"text": " more", "end_time": 97.17, "highlight": false, "start_time": 96.75, "strikethrough": false}, {"text": " towards", "end_time": 97.68, "highlight": false, "start_time": 97.17, "strikethrough": false}, {"text": " experiments", "end_time": 98.49, "highlight": false, "start_time": 97.68, "strikethrough": false}, {"text": " here.", "end_time": 98.88, "highlight": false, "start_time": 98.49, "strikethrough": false}, {"text": " The", "end_time": 99.72, "highlight": false, "start_time": 99.6, "strikethrough": false}, {"text": " user", "end_time": 100.02, "highlight": false, "start_time": 99.72, "strikethrough": false}, {"text": " flow", "end_time": 100.23, "highlight": false, "start_time": 100.02, "strikethrough": false}, {"text": " is", "end_time": 100.32, "highlight": false, "start_time": 100.23, "strikethrough": false}, {"text": " not", "end_time": 100.53, "highlight": false, "start_time": 100.32, "strikethrough": false}, {"text": " finished", "end_time": 100.98, "highlight": false, "start_time": 100.53, "strikethrough": false}, {"text": " yet.", "end_time": 101.34, "highlight": false, "start_time": 100.98, "strikethrough": false}, {"text": " I", "end_time": 102, "highlight": false, "start_time": 101.76, "strikethrough": false}, {"text": " hope", "end_time": 102.27, "highlight": false, "start_time": 102, "strikethrough": false}, {"text": " to", "end_time": 102.42, "highlight": false, "start_time": 102.27, "strikethrough": false}, {"text": " have", "end_time": 102.63, "highlight": false, "start_time": 102.42, "strikethrough": false}, {"text": " it", "end_time": 102.96, "highlight": false, "start_time": 102.63, "strikethrough": false}, {"text": " finished", "end_time": 103.38, "highlight": false, "start_time": 102.96, "strikethrough": false}, {"text": " maybe", "end_time": 103.71, "highlight": false, "start_time": 103.38, "strikethrough": false}, {"text": " by", "end_time": 104.01, "highlight": false, "start_time": 103.71, "strikethrough": false}, {"text": " today", "end_time": 104.4, "highlight": false, "start_time": 104.01, "strikethrough": false}, {"text": " or", "end_time": 104.55, "highlight": false, "start_time": 104.4, "strikethrough": false}, {"text": " tomorrow", "end_time": 105.27, "highlight": false, "start_time": 104.55, "strikethrough": false}, {"text": " morning.", "end_time": 106.08, "highlight": false, "start_time": 105.51, "strikethrough": false}, {"text": " But", "end_time": 107.1, "highlight": false, "start_time": 106.83, "strikethrough": false}, {"text": " now", "end_time": 107.4, "highlight": false, "start_time": 107.1, "strikethrough": false}, {"text": " the", "end_time": 107.49, "highlight": false, "start_time": 107.4, "strikethrough": false}, {"text": " flow", "end_time": 107.73, "highlight": false, "start_time": 107.49, "strikethrough": false}, {"text": " is", "end_time": 107.91, "highlight": false, "start_time": 107.82, "strikethrough": false}, {"text": " not", "end_time": 108.09, "highlight": false, "start_time": 107.91, "strikethrough": false}, {"text": " the", "end_time": 108.18, "highlight": false, "start_time": 108.09, "strikethrough": false}, {"text": " most", "end_time": 108.45, "highlight": false, "start_time": 108.18, "strikethrough": false}, {"text": " important", "end_time": 108.9, "highlight": false, "start_time": 108.45, "strikethrough": false}, {"text": " thing.", "end_time": 109.08, "highlight": false, "start_time": 108.9, "strikethrough": false}, {"text": " I", "end_time": 109.17, "highlight": false, "start_time": 109.08, "strikethrough": false}, {"text": " think", "end_time": 109.59, "highlight": false, "start_time": 109.17, "strikethrough": false}, {"text": " what", "end_time": 110.07, "highlight": false, "start_time": 109.62, "strikethrough": false}, {"text": " could", "end_time": 110.55, "highlight": false, "start_time": 110.07, "strikethrough": false}, {"text": " define", "end_time": 112.41, "highlight": false, "start_time": 111.81, "strikethrough": false}, {"text": " a", "end_time": 112.47, "highlight": false, "start_time": 112.41, "strikethrough": false}, {"text": " little", "end_time": 112.74, "highlight": false, "start_time": 112.47, "strikethrough": false}, {"text": " bit", "end_time": 112.92, "highlight": false, "start_time": 112.74, "strikethrough": false}, {"text": " cappella", "end_time": 113.58, "highlight": false, "start_time": 112.98, "strikethrough": false}, {"text": " is", "end_time": 114.18, "highlight": false, "start_time": 113.82, "strikethrough": false}, {"text": " most", "end_time": 114.51, "highlight": false, "start_time": 114.18, "strikethrough": false}, {"text": " important", "end_time": 115.17, "highlight": false, "start_time": 114.51, "strikethrough": false}, {"text": " here", "end_time": 115.59, "highlight": false, "start_time": 115.23, "strikethrough": false}, {"text": " and", "end_time": 116.29, "highlight": false, "start_time": 116.12, "strikethrough": false}, {"text": " the", "end_time": 116.55, "highlight": false, "start_time": 116.52, "strikethrough": false}, {"text": " ideas", "end_time": 117.3, "highlight": false, "start_time": 116.58, "strikethrough": false}, {"text": " and", "end_time": 117.45, "highlight": false, "start_time": 117.3, "strikethrough": false}, {"text": " pain", "end_time": 117.84, "highlight": false, "start_time": 117.45, "strikethrough": false}, {"text": " points", "end_time": 118.62, "highlight": false, "start_time": 117.84, "strikethrough": false}, {"text": " and", "end_time": 119.08, "highlight": false, "start_time": 118.83, "strikethrough": false}, {"text": " goal", "end_time": 119.82, "highlight": false, "start_time": 119.28, "strikethrough": false}, {"text": " subgoals.", "end_time": 120.57, "highlight": false, "start_time": 119.82, "strikethrough": false}, {"text": " You", "end_time": 120.66, "highlight": false, "start_time": 120.57, "strikethrough": false}, {"text": " know", "end_time": 121.05, "highlight": false, "start_time": 120.66, "strikethrough": false}, {"text": " what", "end_time": 121.56, "highlight": false, "start_time": 121.2, "strikethrough": false}, {"text": " our", "end_time": 122.88, "highlight": false, "start_time": 122.58, "strikethrough": false}, {"text": " users", "end_time": 123.24, "highlight": false, "start_time": 122.88, "strikethrough": false}, {"text": " might", "end_time": 123.45, "highlight": false, "start_time": 123.24, "strikethrough": false}, {"text": " have", "end_time": 123.66, "highlight": false, "start_time": 123.45, "strikethrough": false}, {"text": " or", "end_time": 123.78, "highlight": false, "start_time": 123.66, "strikethrough": false}, {"text": " what", "end_time": 124.06, "highlight": false, "start_time": 123.78, "strikethrough": false}, {"text": " the", "end_time": 124.2, "highlight": false, "start_time": 124.1, "strikethrough": false}, {"text": " goal", "end_time": 124.5, "highlight": false, "start_time": 124.2, "strikethrough": false}, {"text": " of", "end_time": 124.68, "highlight": false, "start_time": 124.5, "strikethrough": false}, {"text": " the", "end_time": 124.8, "highlight": false, "start_time": 124.68, "strikethrough": false}, {"text": " application", "end_time": 125.64, "highlight": false, "start_time": 124.8, "strikethrough": false}, {"text": " of", "end_time": 126, "highlight": false, "start_time": 125.64, "strikethrough": false}, {"text": " the", "end_time": 126.09, "highlight": false, "start_time": 126, "strikethrough": false}, {"text": " acappella.", "end_time": 126.68, "highlight": false, "start_time": 126.09, "strikethrough": false}, {"text": " Right?", "end_time": 126.93, "highlight": false, "start_time": 126.69, "strikethrough": false}, {"text": " So", "end_time": 127.26, "highlight": false, "start_time": 126.96, "strikethrough": false}, {"text": " just", "end_time": 128.24, "highlight": false, "start_time": 127.92, "strikethrough": false}, {"text": " review", "end_time": 128.64, "highlight": false, "start_time": 128.26, "strikethrough": false}, {"text": " it.", "end_time": 128.94, "highlight": false, "start_time": 128.64, "strikethrough": false}, {"text": " And", "end_time": 129.75, "highlight": false, "start_time": 129.51, "strikethrough": false}, {"text": " yet", "end_time": 129.9, "highlight": false, "start_time": 129.75, "strikethrough": false}, {"text": " we", "end_time": 130.08, "highlight": false, "start_time": 129.93, "strikethrough": false}, {"text": " can", "end_time": 130.29, "highlight": false, "start_time": 130.08, "strikethrough": false}, {"text": " have", "end_time": 130.53, "highlight": false, "start_time": 130.29, "strikethrough": false}, {"text": " the", "end_time": 130.62, "highlight": false, "start_time": 130.53, "strikethrough": false}, {"text": " further", "end_time": 130.98, "highlight": false, "start_time": 130.62, "strikethrough": false}, {"text": " discussion", "end_time": 131.73, "highlight": false, "start_time": 130.98, "strikethrough": false}, {"text": " maybe", "end_time": 132.96, "highlight": false, "start_time": 132.69, "strikethrough": false}, {"text": " tomorrow,", "end_time": 133.59, "highlight": false, "start_time": 132.96, "strikethrough": false}, {"text": " I", "end_time": 134.88, "highlight": false, "start_time": 134.68, "strikethrough": false}, {"text": " don't", "end_time": 135, "highlight": false, "start_time": 134.88, "strikethrough": false}, {"text": " know,", "end_time": 135.13, "highlight": false, "start_time": 135, "strikethrough": false}, {"text": " in", "end_time": 135.39, "highlight": false, "start_time": 135.18, "strikethrough": false}, {"text": " the", "end_time": 135.48, "highlight": false, "start_time": 135.39, "strikethrough": false}, {"text": " morning", "end_time": 135.87, "highlight": false, "start_time": 135.48, "strikethrough": false}, {"text": " on", "end_time": 136.11, "highlight": false, "start_time": 135.87, "strikethrough": false}, {"text": " our", "end_time": 136.38, "highlight": false, "start_time": 136.11, "strikethrough": false}, {"text": " thing.", "end_time": 136.8, "highlight": false, "start_time": 136.38, "strikethrough": false}, {"text": " So,", "end_time": 138, "highlight": false, "start_time": 137.76, "strikethrough": false}, {"text": " yeah,", "end_time": 138.23, "highlight": false, "start_time": 138, "strikethrough": false}, {"text": " that", "end_time": 138.78, "highlight": false, "start_time": 138.45, "strikethrough": false}, {"text": " that", "end_time": 139.05, "highlight": false, "start_time": 138.78, "strikethrough": false}, {"text": " would", "end_time": 139.2, "highlight": false, "start_time": 139.05, "strikethrough": false}, {"text": " be", "end_time": 139.47, "highlight": false, "start_time": 139.2, "strikethrough": false}, {"text": " that", "end_time": 139.71, "highlight": false, "start_time": 139.47, "strikethrough": false}, {"text": " would", "end_time": 139.86, "highlight": false, "start_time": 139.71, "strikethrough": false}, {"text": " be", "end_time": 140.22, "highlight": false, "start_time": 139.86, "strikethrough": false}, {"text": " it", "end_time": 140.76, "highlight": false, "start_time": 140.55, "strikethrough": false}, {"text": " for", "end_time": 141.15, "highlight": false, "start_time": 140.76, "strikethrough": false}, {"text": " now.", "end_time": 141.69, "highlight": false, "start_time": 141.27, "strikethrough": false}], "speaker": "Speaker1", "end_time": 141.69, "start_time": 1.53}]	completed
5860cf9f-4413-4a14-9471-e02fc0ef90e8	2021-05-27 13:43:32.729+00	2021-05-27 13:44:45.136093+00	J2aLOmov	[{"words": [{"text": "This", "end_time": 1.35, "highlight": false, "start_time": 1.05, "strikethrough": false}, {"text": " is", "end_time": 1.45, "highlight": false, "start_time": 1.35, "strikethrough": false}, {"text": " the", "end_time": 1.53, "highlight": false, "start_time": 1.45, "strikethrough": false}, {"text": " voice", "end_time": 1.89, "highlight": false, "start_time": 1.53, "strikethrough": false}, {"text": " message", "end_time": 2.34, "highlight": false, "start_time": 1.89, "strikethrough": false}, {"text": " to", "end_time": 2.52, "highlight": false, "start_time": 2.34, "strikethrough": false}, {"text": " see", "end_time": 3.03, "highlight": false, "start_time": 2.52, "strikethrough": false}, {"text": " if", "end_time": 3.78, "highlight": false, "start_time": 3.03, "strikethrough": false}, {"text": " any", "end_time": 4.83, "highlight": false, "start_time": 4.38, "strikethrough": false}, {"text": " of", "end_time": 5.07, "highlight": false, "start_time": 4.83, "strikethrough": false}, {"text": " the", "end_time": 5.55, "highlight": false, "start_time": 5.07, "strikethrough": false}, {"text": " audio", "end_time": 6.42, "highlight": false, "start_time": 5.91, "strikethrough": false}, {"text": " message", "end_time": 6.96, "highlight": false, "start_time": 6.42, "strikethrough": false}, {"text": " gets", "end_time": 7.29, "highlight": false, "start_time": 6.96, "strikethrough": false}, {"text": " transcribed.", "end_time": 8.28, "highlight": false, "start_time": 7.29, "strikethrough": false}], "speaker": "Speaker1", "end_time": 8.28, "start_time": 1.05}]	completed
82f96229-e4c5-4523-b559-606706cd1325	2021-05-27 13:55:53.506+00	2021-05-27 13:57:27.490394+00	VQ8W1pLx	[{"words": [{"text": "This", "end_time": 1.59, "highlight": false, "start_time": 1.38, "strikethrough": false}, {"text": " is", "end_time": 1.71, "highlight": false, "start_time": 1.59, "strikethrough": false}, {"text": " another", "end_time": 2.4, "highlight": false, "start_time": 1.71, "strikethrough": false}, {"text": " voice", "end_time": 2.73, "highlight": false, "start_time": 2.43, "strikethrough": false}, {"text": " message", "end_time": 3.13, "highlight": false, "start_time": 2.73, "strikethrough": false}, {"text": " to", "end_time": 3.24, "highlight": false, "start_time": 3.13, "strikethrough": false}, {"text": " see", "end_time": 3.6, "highlight": false, "start_time": 3.24, "strikethrough": false}, {"text": " how", "end_time": 3.87, "highlight": false, "start_time": 3.6, "strikethrough": false}, {"text": " good", "end_time": 4.14, "highlight": false, "start_time": 3.87, "strikethrough": false}, {"text": " the", "end_time": 4.23, "highlight": false, "start_time": 4.14, "strikethrough": false}, {"text": " transcription", "end_time": 4.8, "highlight": false, "start_time": 4.23, "strikethrough": false}, {"text": " actually", "end_time": 5.13, "highlight": false, "start_time": 4.8, "strikethrough": false}, {"text": " is", "end_time": 5.43, "highlight": false, "start_time": 5.13, "strikethrough": false}, {"text": " and", "end_time": 5.55, "highlight": false, "start_time": 5.43, "strikethrough": false}, {"text": " whether", "end_time": 6.27, "highlight": false, "start_time": 5.55, "strikethrough": false}, {"text": " it", "end_time": 7.11, "highlight": false, "start_time": 6.3, "strikethrough": false}, {"text": " detects", "end_time": 7.83, "highlight": false, "start_time": 7.11, "strikethrough": false}, {"text": " even", "end_time": 8.46, "highlight": false, "start_time": 7.83, "strikethrough": false}, {"text": " quickly", "end_time": 9.21, "highlight": false, "start_time": 8.82, "strikethrough": false}, {"text": " spoken", "end_time": 9.69, "highlight": false, "start_time": 9.21, "strikethrough": false}, {"text": " elements", "end_time": 10.35, "highlight": false, "start_time": 9.69, "strikethrough": false}, {"text": " that", "end_time": 10.62, "highlight": false, "start_time": 10.35, "strikethrough": false}, {"text": " try", "end_time": 11.49, "highlight": false, "start_time": 10.95, "strikethrough": false}, {"text": " to", "end_time": 11.94, "highlight": false, "start_time": 11.49, "strikethrough": false}, {"text": " provide", "end_time": 12.44, "highlight": false, "start_time": 11.94, "strikethrough": false}, {"text": " now,", "end_time": 12.84, "highlight": false, "start_time": 12.45, "strikethrough": false}, {"text": " I", "end_time": 13.77, "highlight": false, "start_time": 13.56, "strikethrough": false}, {"text": " think", "end_time": 14.1, "highlight": false, "start_time": 13.77, "strikethrough": false}, {"text": " overall", "end_time": 14.61, "highlight": false, "start_time": 14.1, "strikethrough": false}, {"text": " the", "end_time": 14.73, "highlight": false, "start_time": 14.61, "strikethrough": false}, {"text": " transcription", "end_time": 15.33, "highlight": false, "start_time": 14.73, "strikethrough": false}, {"text": " feature", "end_time": 15.96, "highlight": false, "start_time": 15.33, "strikethrough": false}, {"text": " looks", "end_time": 16.62, "highlight": false, "start_time": 16.26, "strikethrough": false}, {"text": " good", "end_time": 16.8, "highlight": false, "start_time": 16.62, "strikethrough": false}, {"text": " so", "end_time": 16.95, "highlight": false, "start_time": 16.8, "strikethrough": false}, {"text": " far.", "end_time": 17.34, "highlight": false, "start_time": 16.95, "strikethrough": false}], "speaker": "Speaker1", "end_time": 17.34, "start_time": 1.38}]	completed
18af57b1-ead1-44a8-85a5-2fde8797838d	2021-05-27 14:16:07.191+00	2021-05-27 14:17:27.614147+00	VQ8Wy78x	[{"words": [{"text": "Ok,", "end_time": 0.72, "highlight": false, "start_time": 0.42, "strikethrough": false}, {"text": " second,", "end_time": 1.17, "highlight": false, "start_time": 0.84, "strikethrough": false}, {"text": " try", "end_time": 1.76, "highlight": false, "start_time": 1.17, "strikethrough": false}, {"text": " let's", "end_time": 2.16, "highlight": false, "start_time": 1.8, "strikethrough": false}, {"text": " see", "end_time": 2.55, "highlight": false, "start_time": 2.16, "strikethrough": false}, {"text": " whether", "end_time": 3.15, "highlight": false, "start_time": 2.55, "strikethrough": false}, {"text": " this", "end_time": 3.81, "highlight": false, "start_time": 3.51, "strikethrough": false}, {"text": " time", "end_time": 4.23, "highlight": false, "start_time": 3.81, "strikethrough": false}, {"text": " my", "end_time": 4.86, "highlight": false, "start_time": 4.23, "strikethrough": false}, {"text": " worlds", "end_time": 5.67, "highlight": false, "start_time": 4.86, "strikethrough": false}, {"text": " are", "end_time": 6.33, "highlight": false, "start_time": 6.06, "strikethrough": false}, {"text": " going", "end_time": 6.63, "highlight": false, "start_time": 6.33, "strikethrough": false}, {"text": " to", "end_time": 6.78, "highlight": false, "start_time": 6.63, "strikethrough": false}, {"text": " be", "end_time": 6.99, "highlight": false, "start_time": 6.78, "strikethrough": false}, {"text": " correctly", "end_time": 7.53, "highlight": false, "start_time": 6.99, "strikethrough": false}, {"text": " transferred.", "end_time": 8.19, "highlight": false, "start_time": 7.53, "strikethrough": false}], "speaker": "Speaker1", "end_time": 8.19, "start_time": 0.42}]	completed
cac758c0-e213-49bc-9f56-40d1ba41c2f3	2021-05-27 17:32:31.263+00	2021-05-27 17:33:24.624142+00	ax1y3rqx	[]	completed
d0a9b23a-334e-4e41-bda9-26333936d14f	2021-05-28 17:35:05.77+00	2021-05-28 17:36:16.322211+00	VQ8W8JMx	[{"words": [{"text": "I", "end_time": 0.15, "highlight": false, "start_time": 0.06, "strikethrough": false}, {"text": " think", "end_time": 0.42, "highlight": false, "start_time": 0.15, "strikethrough": false}, {"text": " the", "end_time": 0.57, "highlight": false, "start_time": 0.42, "strikethrough": false}, {"text": " audio", "end_time": 1.02, "highlight": false, "start_time": 0.57, "strikethrough": false}, {"text": " should", "end_time": 1.29, "highlight": false, "start_time": 1.02, "strikethrough": false}, {"text": " work", "end_time": 1.8, "highlight": false, "start_time": 1.29, "strikethrough": false}, {"text": " rather", "end_time": 2.34, "highlight": false, "start_time": 1.98, "strikethrough": false}, {"text": " well", "end_time": 2.58, "highlight": false, "start_time": 2.34, "strikethrough": false}, {"text": " right", "end_time": 2.88, "highlight": false, "start_time": 2.58, "strikethrough": false}, {"text": " now.", "end_time": 3.24, "highlight": false, "start_time": 2.88, "strikethrough": false}], "speaker": "Speaker1", "end_time": 3.24, "start_time": 0.06}]	completed
cb69fd63-473c-42e2-b4b5-297b718bed5c	2021-06-01 07:24:01.439+00	2021-06-01 07:24:56.165689+00	qvYrAYa2	[]	completed
8ef456b2-c84a-4a38-b6bc-c4dae089b4de	2021-06-01 16:40:30.855+00	2021-06-01 16:41:57.306028+00	PQBdgPX2	[{"words": [{"text": "I'm", "end_time": 1.62, "highlight": false, "start_time": 1.32, "strikethrough": false}, {"text": " trying", "end_time": 1.96, "highlight": false, "start_time": 1.62, "strikethrough": false}, {"text": " to", "end_time": 2.36, "highlight": false, "start_time": 2.16, "strikethrough": false}, {"text": " record", "end_time": 2.82, "highlight": false, "start_time": 2.43, "strikethrough": false}, {"text": " some", "end_time": 3.09, "highlight": false, "start_time": 2.82, "strikethrough": false}, {"text": " of", "end_time": 3.27, "highlight": false, "start_time": 3.09, "strikethrough": false}, {"text": " you", "end_time": 3.42, "highlight": false, "start_time": 3.32, "strikethrough": false}, {"text": " know", "end_time": 3.74, "highlight": false, "start_time": 3.42, "strikethrough": false}, {"text": " as", "end_time": 3.96, "highlight": false, "start_time": 3.75, "strikethrough": false}, {"text": " well", "end_time": 4.32, "highlight": false, "start_time": 3.96, "strikethrough": false}, {"text": " and", "end_time": 4.5, "highlight": false, "start_time": 4.32, "strikethrough": false}, {"text": " see", "end_time": 4.71, "highlight": false, "start_time": 4.5, "strikethrough": false}, {"text": " if", "end_time": 4.83, "highlight": false, "start_time": 4.71, "strikethrough": false}, {"text": " it", "end_time": 4.95, "highlight": false, "start_time": 4.83, "strikethrough": false}, {"text": " works.", "end_time": 5.43, "highlight": false, "start_time": 4.95, "strikethrough": false}], "speaker": "Speaker1", "end_time": 5.43, "start_time": 1.32}]	completed
3e62151d-30e9-43a6-94a2-1f67e5ff68eb	2021-06-03 15:17:33.652+00	2021-06-03 15:18:36.426791+00	ax1yyarx	[]	completed
7ce2e8f4-0027-4a8b-9bd4-c062c1a8af61	2021-06-03 15:18:02.526+00	2021-06-03 15:19:22.88903+00	JvNmmJjQ	[]	completed
16bc6bde-4c43-41fa-8cbe-fe1db94cb086	2021-07-22 17:41:56.023+00	2021-07-22 17:43:28.31211+00	oxy3o1Kv	[{"words": [{"text": "That's", "end_time": 1.25, "highlight": false, "start_time": 0.9, "strikethrough": false}, {"text": " in", "end_time": 1.37, "highlight": false, "start_time": 1.26, "strikethrough": false}, {"text": " just.", "end_time": 2.1, "highlight": false, "start_time": 1.56, "strikethrough": false}], "speaker": "Speaker1", "end_time": 2.1, "start_time": 0.9}]	completed
6ce253e1-5954-4f7e-89f3-e2c7b0423dda	2021-06-05 10:47:52.282+00	2021-06-05 10:49:16.340769+00	j2gdz6Vx	[{"words": [{"text": "Sending", "end_time": 0.96, "highlight": false, "start_time": 0.36, "strikethrough": false}, {"text": " a", "end_time": 1.35, "highlight": false, "start_time": 0.96, "strikethrough": false}, {"text": " quick", "end_time": 1.71, "highlight": false, "start_time": 1.35, "strikethrough": false}, {"text": " audio", "end_time": 2.07, "highlight": false, "start_time": 1.71, "strikethrough": false}, {"text": " message", "end_time": 2.58, "highlight": false, "start_time": 2.07, "strikethrough": false}, {"text": " which", "end_time": 2.82, "highlight": false, "start_time": 2.58, "strikethrough": false}, {"text": " will", "end_time": 3, "highlight": false, "start_time": 2.82, "strikethrough": false}, {"text": " also", "end_time": 3.42, "highlight": false, "start_time": 3, "strikethrough": false}, {"text": " later", "end_time": 3.96, "highlight": false, "start_time": 3.42, "strikethrough": false}, {"text": " be", "end_time": 4.41, "highlight": false, "start_time": 3.96, "strikethrough": false}, {"text": " transcribed", "end_time": 5.07, "highlight": false, "start_time": 4.41, "strikethrough": false}, {"text": " the", "end_time": 5.13, "highlight": false, "start_time": 5.07, "strikethrough": false}, {"text": " trees.", "end_time": 5.52, "highlight": false, "start_time": 5.13, "strikethrough": false}], "speaker": "Speaker1", "end_time": 5.52, "start_time": 0.36}]	completed
cd3b1bda-83c3-4cec-b5c4-998c1124857d	2021-06-07 12:29:40.352+00	2021-06-07 12:31:07.238072+00	XQl8glBQ	[{"words": [{"text": "Over", "end_time": 1.76, "highlight": false, "start_time": 1.31, "strikethrough": false}, {"text": " 3000", "end_time": 2.65, "highlight": false, "start_time": 1.77, "strikethrough": false}, {"text": " bumblebees", "end_time": 3.48, "highlight": false, "start_time": 2.81, "strikethrough": false}, {"text": " on", "end_time": 3.95, "highlight": false, "start_time": 3.74, "strikethrough": false}, {"text": " its.", "end_time": 4.99, "highlight": false, "start_time": 4.31, "strikethrough": false}], "speaker": "Speaker1", "end_time": 4.99, "start_time": 1.31}]	completed
91860073-9c8d-4bc2-94e7-e8192a6ba094	2021-06-07 12:32:10.767+00	2021-06-07 12:33:27.808728+00	4vK9k6lx	[{"words": [{"text": "On", "end_time": 1.2, "highlight": false, "start_time": 1.07, "strikethrough": false}, {"text": " the", "end_time": 2.33, "highlight": false, "start_time": 1.98, "strikethrough": false}, {"text": " Monday", "end_time": 3.21, "highlight": false, "start_time": 2.4, "strikethrough": false}, {"text": " I", "end_time": 4.91, "highlight": false, "start_time": 4.67, "strikethrough": false}, {"text": " am", "end_time": 5.47, "highlight": false, "start_time": 5.16, "strikethrough": false}, {"text": " here", "end_time": 5.91, "highlight": false, "start_time": 5.64, "strikethrough": false}, {"text": " doing", "end_time": 6.38, "highlight": false, "start_time": 6.2, "strikethrough": false}, {"text": " my", "end_time": 6.84, "highlight": false, "start_time": 6.48, "strikethrough": false}, {"text": " parents", "end_time": 7.53, "highlight": false, "start_time": 6.9, "strikethrough": false}, {"text": " or", "end_time": 7.97, "highlight": false, "start_time": 7.65, "strikethrough": false}, {"text": " they", "end_time": 8.69, "highlight": false, "start_time": 8.49, "strikethrough": false}, {"text": " met", "end_time": 8.96, "highlight": false, "start_time": 8.73, "strikethrough": false}, {"text": " with", "end_time": 9.16, "highlight": false, "start_time": 8.97, "strikethrough": false}, {"text": " veterans", "end_time": 9.67, "highlight": false, "start_time": 9.2, "strikethrough": false}, {"text": " of.", "end_time": 10.46, "highlight": false, "start_time": 9.96, "strikethrough": false}], "speaker": "Speaker1", "end_time": 10.46, "start_time": 1.07}]	completed
4850df07-ed7d-4b08-bb1b-4b92e1785af0	2021-06-07 12:39:23.071+00	2021-06-07 12:40:20.439098+00	JvPyZL02	[]	completed
00ffd00d-93fc-45a1-ae66-7fbbae641241	2021-06-07 13:35:08.396+00	2021-06-07 13:37:17.041905+00	VvA408pQ	[{"words": [{"text": "It's", "end_time": 29.12, "highlight": false, "start_time": 28.82, "strikethrough": false}, {"text": " the.", "end_time": 33.5, "highlight": false, "start_time": 33.24, "strikethrough": false}, {"text": " It's.", "end_time": 46.63, "highlight": false, "start_time": 46.36, "strikethrough": false}, {"text": " OK.", "end_time": 69.9, "highlight": false, "start_time": 69.57, "strikethrough": false}, {"text": " And.", "end_time": 102.73, "highlight": false, "start_time": 102.4, "strikethrough": false}, {"text": " It's.", "end_time": 117.89, "highlight": false, "start_time": 117.56, "strikethrough": false}, {"text": " It's.", "end_time": 188.17, "highlight": false, "start_time": 187.92, "strikethrough": false}], "speaker": "Speaker1", "end_time": 188.17, "start_time": 28.82}]	completed
091b5a2e-be10-49fa-a0d0-d229c4f05d2f	2021-06-07 13:44:05.658+00	2021-06-07 13:45:17.7095+00	qvYRkDa2	[]	completed
7f07cf64-aa4f-4833-a004-6fa96864fdf1	2021-06-07 14:32:26.515+00	2021-06-07 14:32:26.515+00	p2p8VYK2	\N	preparing
beb13a1a-b860-456d-9da2-c9afedce049c	2021-06-07 15:03:46.126+00	2021-06-07 15:04:45.266112+00	XQl8g59Q	[]	completed
31a0a208-9dad-4462-b1bb-6fa523637cb5	2021-06-07 15:04:07.907+00	2021-06-07 15:05:20.029078+00	j2g8mZJx	[{"words": [{"text": "Test,", "end_time": 2.87, "highlight": false, "start_time": 2.57, "strikethrough": false}, {"text": " test,", "end_time": 3.17, "highlight": false, "start_time": 2.87, "strikethrough": false}, {"text": " test.", "end_time": 3.47, "highlight": false, "start_time": 3.17, "strikethrough": false}], "speaker": "Speaker1", "end_time": 3.47, "start_time": 2.57}]	completed
29347bc6-5a0e-4d49-a797-c64ab2b4ee7b	2021-06-09 09:59:06.173+00	2021-06-09 10:00:23.454555+00	z2GGMbN2	[]	completed
0a45974c-3326-4e45-a99b-8573a935ad59	2021-07-22 17:45:40.25+00	2021-07-22 17:46:58.499114+00	qvYGq8Xx	[{"words": [{"text": "Hey,", "end_time": 1.9, "highlight": false, "start_time": 1.65, "strikethrough": false}, {"text": " Julia,", "end_time": 2.57, "highlight": false, "start_time": 1.92, "strikethrough": false}, {"text": " and", "end_time": 3.54, "highlight": false, "start_time": 3.18, "strikethrough": false}, {"text": " that's", "end_time": 5.07, "highlight": false, "start_time": 4.74, "strikethrough": false}, {"text": " also", "end_time": 5.28, "highlight": false, "start_time": 5.07, "strikethrough": false}, {"text": " just", "end_time": 5.47, "highlight": false, "start_time": 5.28, "strikethrough": false}, {"text": " like", "end_time": 5.59, "highlight": false, "start_time": 5.47, "strikethrough": false}, {"text": " another", "end_time": 5.94, "highlight": false, "start_time": 5.61, "strikethrough": false}, {"text": " test,", "end_time": 6.27, "highlight": false, "start_time": 5.94, "strikethrough": false}, {"text": " just", "end_time": 6.58, "highlight": false, "start_time": 6.27, "strikethrough": false}, {"text": " wanted", "end_time": 7.14, "highlight": false, "start_time": 6.91, "strikethrough": false}, {"text": " to", "end_time": 7.23, "highlight": false, "start_time": 7.14, "strikethrough": false}, {"text": " check", "end_time": 7.53, "highlight": false, "start_time": 7.23, "strikethrough": false}, {"text": " in,", "end_time": 7.71, "highlight": false, "start_time": 7.53, "strikethrough": false}, {"text": " thank", "end_time": 8.13, "highlight": false, "start_time": 7.77, "strikethrough": false}, {"text": " you.", "end_time": 8.54, "highlight": false, "start_time": 8.13, "strikethrough": false}], "speaker": "Speaker1", "end_time": 8.54, "start_time": 1.65}]	completed
d7a2d010-8811-432c-9e9a-bf0578113361	2021-06-15 14:15:49.209+00	2021-06-15 14:17:16.211272+00	827EldBQ	[{"words": [{"text": "Recording", "end_time": 0.84, "highlight": false, "start_time": 0.18, "strikethrough": false}, {"text": " a", "end_time": 1.08, "highlight": false, "start_time": 0.84, "strikethrough": false}, {"text": " quick", "end_time": 1.41, "highlight": false, "start_time": 1.08, "strikethrough": false}, {"text": " audio", "end_time": 1.68, "highlight": false, "start_time": 1.41, "strikethrough": false}, {"text": " message", "end_time": 2.07, "highlight": false, "start_time": 1.68, "strikethrough": false}, {"text": " just", "end_time": 2.28, "highlight": false, "start_time": 2.07, "strikethrough": false}, {"text": " to", "end_time": 2.4, "highlight": false, "start_time": 2.28, "strikethrough": false}, {"text": " see", "end_time": 2.82, "highlight": false, "start_time": 2.4, "strikethrough": false}, {"text": " how", "end_time": 3.09, "highlight": false, "start_time": 2.82, "strikethrough": false}, {"text": " well", "end_time": 3.61, "highlight": false, "start_time": 3.09, "strikethrough": false}, {"text": " what", "end_time": 4.08, "highlight": false, "start_time": 3.81, "strikethrough": false}, {"text": " the", "end_time": 4.17, "highlight": false, "start_time": 4.08, "strikethrough": false}, {"text": " player", "end_time": 4.47, "highlight": false, "start_time": 4.17, "strikethrough": false}, {"text": " looks", "end_time": 4.74, "highlight": false, "start_time": 4.47, "strikethrough": false}, {"text": " like.", "end_time": 5.07, "highlight": false, "start_time": 4.74, "strikethrough": false}], "speaker": "Speaker1", "end_time": 5.07, "start_time": 0.18}]	completed
c01498b5-7ad3-4017-abd4-6604781eae38	2021-06-15 14:16:48.274+00	2021-06-15 14:19:15.561678+00	bQn8k0w2	[{"words": [{"text": "Let's", "end_time": 1.17, "highlight": false, "start_time": 0.87, "strikethrough": false}, {"text": " see", "end_time": 1.38, "highlight": false, "start_time": 1.17, "strikethrough": false}, {"text": " how", "end_time": 1.56, "highlight": false, "start_time": 1.38, "strikethrough": false}, {"text": " well", "end_time": 1.86, "highlight": false, "start_time": 1.56, "strikethrough": false}, {"text": " the", "end_time": 2.1, "highlight": false, "start_time": 1.86, "strikethrough": false}, {"text": " video", "end_time": 2.4, "highlight": false, "start_time": 2.1, "strikethrough": false}, {"text": " recording", "end_time": 2.88, "highlight": false, "start_time": 2.4, "strikethrough": false}, {"text": " will", "end_time": 3.03, "highlight": false, "start_time": 2.88, "strikethrough": false}, {"text": " actually", "end_time": 3.39, "highlight": false, "start_time": 3.03, "strikethrough": false}, {"text": " work.", "end_time": 3.64, "highlight": false, "start_time": 3.39, "strikethrough": false}], "speaker": "Speaker1", "end_time": 3.64, "start_time": 0.87}]	completed
a3a20ac2-42ff-4b09-a430-ae9188ebcf42	2021-07-05 12:54:04.297+00	2021-07-05 12:55:15.323412+00	VvMaAPPv	[{"words": [{"text": "I", "end_time": 0.84, "highlight": false, "start_time": 0.69, "strikethrough": false}, {"text": " think", "end_time": 1.08, "highlight": false, "start_time": 0.84, "strikethrough": false}, {"text": " the", "end_time": 1.17, "highlight": false, "start_time": 1.08, "strikethrough": false}, {"text": " main", "end_time": 1.44, "highlight": false, "start_time": 1.17, "strikethrough": false}, {"text": " point", "end_time": 1.8, "highlight": false, "start_time": 1.44, "strikethrough": false}, {"text": " for", "end_time": 2.01, "highlight": false, "start_time": 1.8, "strikethrough": false}, {"text": " the", "end_time": 2.1, "highlight": false, "start_time": 2.01, "strikethrough": false}, {"text": " developers", "end_time": 2.76, "highlight": false, "start_time": 2.1, "strikethrough": false}, {"text": " was", "end_time": 3.21, "highlight": false, "start_time": 2.76, "strikethrough": false}, {"text": " that", "end_time": 3.75, "highlight": false, "start_time": 3.21, "strikethrough": false}, {"text": " the", "end_time": 4.83, "highlight": false, "start_time": 4.32, "strikethrough": false}, {"text": " names", "end_time": 5.52, "highlight": false, "start_time": 4.86, "strikethrough": false}, {"text": " in", "end_time": 5.64, "highlight": false, "start_time": 5.52, "strikethrough": false}, {"text": " the", "end_time": 5.79, "highlight": false, "start_time": 5.64, "strikethrough": false}, {"text": " Fatema", "end_time": 6.57, "highlight": false, "start_time": 5.79, "strikethrough": false}, {"text": " should", "end_time": 7.41, "highlight": false, "start_time": 6.87, "strikethrough": false}, {"text": " be", "end_time": 8.07, "highlight": false, "start_time": 7.41, "strikethrough": false}, {"text": " the", "end_time": 8.4, "highlight": false, "start_time": 8.22, "strikethrough": false}, {"text": " same", "end_time": 9.15, "highlight": false, "start_time": 8.4, "strikethrough": false}, {"text": " with", "end_time": 9.57, "highlight": false, "start_time": 9.36, "strikethrough": false}, {"text": " the", "end_time": 9.66, "highlight": false, "start_time": 9.57, "strikethrough": false}, {"text": " names", "end_time": 10.08, "highlight": false, "start_time": 9.66, "strikethrough": false}, {"text": " that", "end_time": 10.23, "highlight": false, "start_time": 10.08, "strikethrough": false}, {"text": " we", "end_time": 10.35, "highlight": false, "start_time": 10.23, "strikethrough": false}, {"text": " use", "end_time": 10.59, "highlight": false, "start_time": 10.35, "strikethrough": false}, {"text": " in", "end_time": 10.71, "highlight": false, "start_time": 10.59, "strikethrough": false}, {"text": " development.", "end_time": 11.57, "highlight": false, "start_time": 10.71, "strikethrough": false}, {"text": " And", "end_time": 12.18, "highlight": false, "start_time": 11.88, "strikethrough": false}, {"text": " so", "end_time": 12.48, "highlight": false, "start_time": 12.18, "strikethrough": false}, {"text": " that's", "end_time": 12.96, "highlight": false, "start_time": 12.48, "strikethrough": false}, {"text": " that's", "end_time": 13.26, "highlight": false, "start_time": 12.96, "strikethrough": false}, {"text": " sort", "end_time": 13.47, "highlight": false, "start_time": 13.26, "strikethrough": false}, {"text": " of", "end_time": 13.56, "highlight": false, "start_time": 13.47, "strikethrough": false}, {"text": " the", "end_time": 13.89, "highlight": false, "start_time": 13.56, "strikethrough": false}, {"text": " main", "end_time": 14.19, "highlight": false, "start_time": 13.89, "strikethrough": false}, {"text": " thing", "end_time": 14.49, "highlight": false, "start_time": 14.19, "strikethrough": false}, {"text": " that", "end_time": 14.73, "highlight": false, "start_time": 14.49, "strikethrough": false}, {"text": " we", "end_time": 14.91, "highlight": false, "start_time": 14.73, "strikethrough": false}, {"text": " are", "end_time": 15.12, "highlight": false, "start_time": 14.91, "strikethrough": false}, {"text": " trying", "end_time": 15.48, "highlight": false, "start_time": 15.12, "strikethrough": false}, {"text": " to", "end_time": 15.6, "highlight": false, "start_time": 15.48, "strikethrough": false}, {"text": " achieve", "end_time": 16.08, "highlight": false, "start_time": 15.6, "strikethrough": false}, {"text": " here.", "end_time": 16.38, "highlight": false, "start_time": 16.08, "strikethrough": false}, {"text": " So", "end_time": 17.31, "highlight": false, "start_time": 16.86, "strikethrough": false}, {"text": " the", "end_time": 17.76, "highlight": false, "start_time": 17.58, "strikethrough": false}, {"text": " second", "end_time": 18.15, "highlight": false, "start_time": 17.76, "strikethrough": false}, {"text": " problem", "end_time": 18.87, "highlight": false, "start_time": 18.15, "strikethrough": false}, {"text": " is", "end_time": 19.2, "highlight": false, "start_time": 18.87, "strikethrough": false}, {"text": " exactly", "end_time": 20.04, "highlight": false, "start_time": 19.2, "strikethrough": false}, {"text": " how", "end_time": 20.82, "highlight": false, "start_time": 20.37, "strikethrough": false}, {"text": " are", "end_time": 21, "highlight": false, "start_time": 20.82, "strikethrough": false}, {"text": " we", "end_time": 21.15, "highlight": false, "start_time": 21, "strikethrough": false}, {"text": " going", "end_time": 21.48, "highlight": false, "start_time": 21.15, "strikethrough": false}, {"text": " to", "end_time": 21.63, "highlight": false, "start_time": 21.48, "strikethrough": false}, {"text": " call", "end_time": 22.38, "highlight": false, "start_time": 21.63, "strikethrough": false}, {"text": " the", "end_time": 22.83, "highlight": false, "start_time": 22.65, "strikethrough": false}, {"text": " colors", "end_time": 23.73, "highlight": false, "start_time": 22.83, "strikethrough": false}, {"text": " when", "end_time": 24.57, "highlight": false, "start_time": 24.36, "strikethrough": false}, {"text": " it", "end_time": 24.66, "highlight": false, "start_time": 24.57, "strikethrough": false}, {"text": " comes", "end_time": 25.05, "highlight": false, "start_time": 24.66, "strikethrough": false}, {"text": " to", "end_time": 25.35, "highlight": false, "start_time": 25.05, "strikethrough": false}, {"text": " using", "end_time": 25.74, "highlight": false, "start_time": 25.35, "strikethrough": false}, {"text": " the", "end_time": 25.86, "highlight": false, "start_time": 25.74, "strikethrough": false}, {"text": " same", "end_time": 26.16, "highlight": false, "start_time": 25.86, "strikethrough": false}, {"text": " colors", "end_time": 26.61, "highlight": false, "start_time": 26.16, "strikethrough": false}, {"text": " in", "end_time": 26.73, "highlight": false, "start_time": 26.61, "strikethrough": false}, {"text": " many", "end_time": 27, "highlight": false, "start_time": 26.73, "strikethrough": false}, {"text": " different", "end_time": 27.81, "highlight": false, "start_time": 27, "strikethrough": false}, {"text": " the", "end_time": 28.29, "highlight": false, "start_time": 27.81, "strikethrough": false}, {"text": " many", "end_time": 29.58, "highlight": false, "start_time": 29.31, "strikethrough": false}, {"text": " different", "end_time": 30.18, "highlight": false, "start_time": 29.58, "strikethrough": false}, {"text": " contexts?", "end_time": 30.96, "highlight": false, "start_time": 30.3, "strikethrough": false}], "speaker": "Speaker1", "end_time": 30.96, "start_time": 0.69}]	completed
5ba8793d-5517-4778-90ab-782f6e99e170	2021-07-06 10:11:03.807+00	2021-07-06 10:13:09.873268+00	8vXqabD2	[{"words": [{"text": "Hey,", "end_time": 1.07, "highlight": false, "start_time": 0.68, "strikethrough": false}, {"text": " so", "end_time": 1.55, "highlight": false, "start_time": 1.07, "strikethrough": false}, {"text": " I", "end_time": 1.76, "highlight": false, "start_time": 1.55, "strikethrough": false}, {"text": " hope", "end_time": 2.12, "highlight": false, "start_time": 1.76, "strikethrough": false}, {"text": " this", "end_time": 2.39, "highlight": false, "start_time": 2.12, "strikethrough": false}, {"text": " will", "end_time": 2.54, "highlight": false, "start_time": 2.39, "strikethrough": false}, {"text": " work.", "end_time": 3.2, "highlight": false, "start_time": 2.54, "strikethrough": false}, {"text": " So", "end_time": 3.89, "highlight": false, "start_time": 3.65, "strikethrough": false}, {"text": " here's", "end_time": 4.25, "highlight": false, "start_time": 3.89, "strikethrough": false}, {"text": " a", "end_time": 4.58, "highlight": false, "start_time": 4.25, "strikethrough": false}, {"text": " short", "end_time": 5.84, "highlight": false, "start_time": 5.15, "strikethrough": false}, {"text": " overview", "end_time": 6.53, "highlight": false, "start_time": 5.84, "strikethrough": false}, {"text": " of", "end_time": 7.25, "highlight": false, "start_time": 6.53, "strikethrough": false}, {"text": " the", "end_time": 8.12, "highlight": false, "start_time": 7.43, "strikethrough": false}, {"text": " survey", "end_time": 10.31, "highlight": false, "start_time": 9.89, "strikethrough": false}, {"text": " results.", "end_time": 11.05, "highlight": false, "start_time": 10.31, "strikethrough": false}, {"text": " So", "end_time": 11.32, "highlight": false, "start_time": 11.06, "strikethrough": false}, {"text": " just", "end_time": 11.63, "highlight": false, "start_time": 11.33, "strikethrough": false}, {"text": " as", "end_time": 11.78, "highlight": false, "start_time": 11.63, "strikethrough": false}, {"text": " a", "end_time": 11.81, "highlight": false, "start_time": 11.78, "strikethrough": false}, {"text": " quick", "end_time": 12.08, "highlight": false, "start_time": 11.81, "strikethrough": false}, {"text": " recap", "end_time": 12.69, "highlight": false, "start_time": 12.09, "strikethrough": false}, {"text": " of", "end_time": 13.07, "highlight": false, "start_time": 12.92, "strikethrough": false}, {"text": " the", "end_time": 13.76, "highlight": false, "start_time": 13.61, "strikethrough": false}, {"text": " method", "end_time": 14.15, "highlight": false, "start_time": 13.76, "strikethrough": false}, {"text": " was", "end_time": 14.57, "highlight": false, "start_time": 14.15, "strikethrough": false}, {"text": " to", "end_time": 15.71, "highlight": false, "start_time": 15.56, "strikethrough": false}, {"text": " make", "end_time": 15.89, "highlight": false, "start_time": 15.71, "strikethrough": false}, {"text": " a", "end_time": 15.95, "highlight": false, "start_time": 15.89, "strikethrough": false}, {"text": " survey", "end_time": 16.55, "highlight": false, "start_time": 15.95, "strikethrough": false}, {"text": " on", "end_time": 16.76, "highlight": false, "start_time": 16.55, "strikethrough": false}, {"text": " type", "end_time": 17.03, "highlight": false, "start_time": 16.76, "strikethrough": false}, {"text": " form", "end_time": 17.42, "highlight": false, "start_time": 17.03, "strikethrough": false}, {"text": " 25,", "end_time": 18.05, "highlight": false, "start_time": 17.42, "strikethrough": false}, {"text": " participants", "end_time": 18.89, "highlight": false, "start_time": 18.05, "strikethrough": false}, {"text": " were", "end_time": 19.22, "highlight": false, "start_time": 18.89, "strikethrough": false}, {"text": " recruited", "end_time": 19.82, "highlight": false, "start_time": 19.22, "strikethrough": false}, {"text": " with", "end_time": 20.09, "highlight": false, "start_time": 19.82, "strikethrough": false}, {"text": " testing", "end_time": 20.51, "highlight": false, "start_time": 20.09, "strikethrough": false}, {"text": " time.", "end_time": 20.93, "highlight": false, "start_time": 20.51, "strikethrough": false}, {"text": " And", "end_time": 21.11, "highlight": false, "start_time": 20.93, "strikethrough": false}, {"text": " the", "end_time": 21.2, "highlight": false, "start_time": 21.11, "strikethrough": false}, {"text": " criteria", "end_time": 21.92, "highlight": false, "start_time": 21.2, "strikethrough": false}, {"text": " for", "end_time": 22.28, "highlight": false, "start_time": 21.92, "strikethrough": false}, {"text": " people", "end_time": 22.58, "highlight": false, "start_time": 22.28, "strikethrough": false}, {"text": " were", "end_time": 22.79, "highlight": false, "start_time": 22.58, "strikethrough": false}, {"text": " that", "end_time": 23.03, "highlight": false, "start_time": 22.79, "strikethrough": false}, {"text": " they", "end_time": 23.33, "highlight": false, "start_time": 23.03, "strikethrough": false}, {"text": " work", "end_time": 23.72, "highlight": false, "start_time": 23.33, "strikethrough": false}, {"text": " in", "end_time": 23.87, "highlight": false, "start_time": 23.72, "strikethrough": false}, {"text": " a", "end_time": 24.25, "highlight": false, "start_time": 24.19, "strikethrough": false}, {"text": " hybrid", "end_time": 24.62, "highlight": false, "start_time": 24.29, "strikethrough": false}, {"text": " team", "end_time": 25.01, "highlight": false, "start_time": 24.62, "strikethrough": false}, {"text": " and", "end_time": 25.49, "highlight": false, "start_time": 25.28, "strikethrough": false}, {"text": " that", "end_time": 25.64, "highlight": false, "start_time": 25.49, "strikethrough": false}, {"text": " they", "end_time": 25.76, "highlight": false, "start_time": 25.64, "strikethrough": false}, {"text": " use", "end_time": 26.07, "highlight": false, "start_time": 25.76, "strikethrough": false}, {"text": " room", "end_time": 26.59, "highlight": false, "start_time": 26.23, "strikethrough": false}, {"text": " for", "end_time": 26.81, "highlight": false, "start_time": 26.6, "strikethrough": false}, {"text": " internal", "end_time": 27.26, "highlight": false, "start_time": 26.81, "strikethrough": false}, {"text": " collaboration.", "end_time": 28.09, "highlight": false, "start_time": 27.26, "strikethrough": false}, {"text": " So", "end_time": 29.21, "highlight": false, "start_time": 28.55, "strikethrough": false}, {"text": " maybe", "end_time": 30.17, "highlight": false, "start_time": 29.84, "strikethrough": false}, {"text": " just", "end_time": 30.5, "highlight": false, "start_time": 30.17, "strikethrough": false}, {"text": " quickly", "end_time": 31.58, "highlight": false, "start_time": 30.83, "strikethrough": false}, {"text": " show", "end_time": 31.85, "highlight": false, "start_time": 31.58, "strikethrough": false}, {"text": " you", "end_time": 31.94, "highlight": false, "start_time": 31.85, "strikethrough": false}, {"text": " the", "end_time": 32.03, "highlight": false, "start_time": 31.94, "strikethrough": false}, {"text": " questions", "end_time": 32.72, "highlight": false, "start_time": 32.03, "strikethrough": false}, {"text": " or", "end_time": 32.87, "highlight": false, "start_time": 32.72, "strikethrough": false}, {"text": " the", "end_time": 32.99, "highlight": false, "start_time": 32.87, "strikethrough": false}, {"text": " role", "end_time": 33.35, "highlight": false, "start_time": 32.99, "strikethrough": false}, {"text": " in", "end_time": 33.47, "highlight": false, "start_time": 33.35, "strikethrough": false}, {"text": " the", "end_time": 33.56, "highlight": false, "start_time": 33.47, "strikethrough": false}, {"text": " company,", "end_time": 34.36, "highlight": false, "start_time": 33.56, "strikethrough": false}, {"text": " how", "end_time": 34.97, "highlight": false, "start_time": 34.79, "strikethrough": false}, {"text": " many", "end_time": 35.69, "highlight": false, "start_time": 35.39, "strikethrough": false}, {"text": " team", "end_time": 35.96, "highlight": false, "start_time": 35.69, "strikethrough": false}, {"text": " members,", "end_time": 36.89, "highlight": false, "start_time": 35.96, "strikethrough": false}, {"text": " how", "end_time": 37.46, "highlight": false, "start_time": 37.34, "strikethrough": false}, {"text": " often", "end_time": 37.76, "highlight": false, "start_time": 37.46, "strikethrough": false}, {"text": " they", "end_time": 37.88, "highlight": false, "start_time": 37.76, "strikethrough": false}, {"text": " use", "end_time": 38.15, "highlight": false, "start_time": 37.88, "strikethrough": false}, {"text": " the", "end_time": 38.42, "highlight": false, "start_time": 38.15, "strikethrough": false}, {"text": " video", "end_time": 38.78, "highlight": false, "start_time": 38.42, "strikethrough": false}, {"text": " recording", "end_time": 39.2, "highlight": false, "start_time": 38.78, "strikethrough": false}, {"text": " software,", "end_time": 39.83, "highlight": false, "start_time": 39.2, "strikethrough": false}, {"text": " which", "end_time": 41.75, "highlight": false, "start_time": 41.18, "strikethrough": false}, {"text": " tools", "end_time": 42.14, "highlight": false, "start_time": 41.75, "strikethrough": false}, {"text": " they", "end_time": 42.29, "highlight": false, "start_time": 42.14, "strikethrough": false}, {"text": " use.", "end_time": 42.57, "highlight": false, "start_time": 42.29, "strikethrough": false}, {"text": " So,", "end_time": 43.02, "highlight": false, "start_time": 42.57, "strikethrough": false}, {"text": " of", "end_time": 43.25, "highlight": false, "start_time": 43.04, "strikethrough": false}, {"text": " course,", "end_time": 43.55, "highlight": false, "start_time": 43.25, "strikethrough": false}, {"text": " obviously", "end_time": 44.27, "highlight": false, "start_time": 43.7, "strikethrough": false}, {"text": " everyone", "end_time": 44.69, "highlight": false, "start_time": 44.27, "strikethrough": false}, {"text": " goes", "end_time": 44.92, "highlight": false, "start_time": 44.69, "strikethrough": false}, {"text": " along,", "end_time": 45.3, "highlight": false, "start_time": 44.93, "strikethrough": false}, {"text": " but", "end_time": 45.53, "highlight": false, "start_time": 45.32, "strikethrough": false}, {"text": " then", "end_time": 45.77, "highlight": false, "start_time": 45.53, "strikethrough": false}, {"text": " also", "end_time": 46.49, "highlight": false, "start_time": 45.77, "strikethrough": false}, {"text": " others", "end_time": 48.26, "highlight": false, "start_time": 47.51, "strikethrough": false}, {"text": " as", "end_time": 49.19, "highlight": false, "start_time": 48.71, "strikethrough": false}, {"text": " options.", "end_time": 50.18, "highlight": false, "start_time": 49.46, "strikethrough": false}, {"text": " Then", "end_time": 51.32, "highlight": false, "start_time": 50.96, "strikethrough": false}, {"text": " the", "end_time": 51.41, "highlight": false, "start_time": 51.32, "strikethrough": false}, {"text": " question", "end_time": 52.01, "highlight": false, "start_time": 51.41, "strikethrough": false}, {"text": " what", "end_time": 52.31, "highlight": false, "start_time": 52.01, "strikethrough": false}, {"text": " they", "end_time": 52.61, "highlight": false, "start_time": 52.31, "strikethrough": false}, {"text": " use", "end_time": 52.88, "highlight": false, "start_time": 52.61, "strikethrough": false}, {"text": " the", "end_time": 52.97, "highlight": false, "start_time": 52.88, "strikethrough": false}, {"text": " video", "end_time": 53.33, "highlight": false, "start_time": 52.97, "strikethrough": false}, {"text": " recordings", "end_time": 53.93, "highlight": false, "start_time": 53.33, "strikethrough": false}, {"text": " for", "end_time": 54.32, "highlight": false, "start_time": 53.93, "strikethrough": false}, {"text": " to", "end_time": 54.47, "highlight": false, "start_time": 54.32, "strikethrough": false}, {"text": " maybe", "end_time": 54.71, "highlight": false, "start_time": 54.47, "strikethrough": false}, {"text": " find", "end_time": 55.01, "highlight": false, "start_time": 54.71, "strikethrough": false}, {"text": " out", "end_time": 55.31, "highlight": false, "start_time": 55.01, "strikethrough": false}, {"text": " certain", "end_time": 56.24, "highlight": false, "start_time": 55.79, "strikethrough": false}, {"text": " use", "end_time": 56.48, "highlight": false, "start_time": 56.24, "strikethrough": false}, {"text": " cases,", "end_time": 57.17, "highlight": false, "start_time": 56.48, "strikethrough": false}, {"text": " satisfaction", "end_time": 60.02, "highlight": false, "start_time": 59.27, "strikethrough": false}, {"text": " rating", "end_time": 60.5, "highlight": false, "start_time": 60.02, "strikethrough": false}, {"text": " from", "end_time": 60.95, "highlight": false, "start_time": 60.5, "strikethrough": false}, {"text": " a", "end_time": 61.82, "highlight": false, "start_time": 61.49, "strikethrough": false}, {"text": " process", "end_time": 62.54, "highlight": false, "start_time": 61.98, "strikethrough": false}, {"text": " of", "end_time": 62.66, "highlight": false, "start_time": 62.54, "strikethrough": false}, {"text": " collaborating,", "end_time": 63.62, "highlight": false, "start_time": 62.66, "strikethrough": false}, {"text": " zero,", "end_time": 64.52, "highlight": false, "start_time": 63.86, "strikethrough": false}, {"text": " not", "end_time": 65.57, "highlight": false, "start_time": 65.33, "strikethrough": false}, {"text": " satisfied", "end_time": 66.05, "highlight": false, "start_time": 65.57, "strikethrough": false}, {"text": " at", "end_time": 66.2, "highlight": false, "start_time": 66.05, "strikethrough": false}, {"text": " all", "end_time": 66.4, "highlight": false, "start_time": 66.2, "strikethrough": false}, {"text": " to", "end_time": 66.56, "highlight": false, "start_time": 66.42, "strikethrough": false}, {"text": " 10", "end_time": 67.4, "highlight": false, "start_time": 66.86, "strikethrough": false}, {"text": " super", "end_time": 67.85, "highlight": false, "start_time": 67.4, "strikethrough": false}, {"text": " satisfied.", "end_time": 68.63, "highlight": false, "start_time": 67.85, "strikethrough": false}, {"text": " And", "end_time": 70.4, "highlight": false, "start_time": 70.19, "strikethrough": false}, {"text": " then", "end_time": 70.73, "highlight": false, "start_time": 70.4, "strikethrough": false}, {"text": " also", "end_time": 71.12, "highlight": false, "start_time": 70.73, "strikethrough": false}, {"text": " here,", "end_time": 71.6, "highlight": false, "start_time": 71.12, "strikethrough": false}, {"text": " that", "end_time": 71.84, "highlight": false, "start_time": 71.6, "strikethrough": false}, {"text": " was", "end_time": 72.02, "highlight": false, "start_time": 71.84, "strikethrough": false}, {"text": " the", "end_time": 72.13, "highlight": false, "start_time": 72.02, "strikethrough": false}, {"text": " essential", "end_time": 72.62, "highlight": false, "start_time": 72.13, "strikethrough": false}, {"text": " question,", "end_time": 73.34, "highlight": false, "start_time": 72.62, "strikethrough": false}, {"text": " just", "end_time": 73.67, "highlight": false, "start_time": 73.34, "strikethrough": false}, {"text": " free", "end_time": 73.91, "highlight": false, "start_time": 73.67, "strikethrough": false}, {"text": " text,", "end_time": 74.51, "highlight": false, "start_time": 73.91, "strikethrough": false}, {"text": " which", "end_time": 75.14, "highlight": false, "start_time": 74.84, "strikethrough": false}, {"text": " things", "end_time": 75.8, "highlight": false, "start_time": 75.14, "strikethrough": false}, {"text": " people", "end_time": 76.97, "highlight": false, "start_time": 76.52, "strikethrough": false}, {"text": " would", "end_time": 77.18, "highlight": false, "start_time": 76.97, "strikethrough": false}, {"text": " have", "end_time": 77.42, "highlight": false, "start_time": 77.18, "strikethrough": false}, {"text": " liked", "end_time": 77.69, "highlight": false, "start_time": 77.42, "strikethrough": false}, {"text": " to", "end_time": 77.75, "highlight": false, "start_time": 77.69, "strikethrough": false}, {"text": " have", "end_time": 77.9, "highlight": false, "start_time": 77.75, "strikethrough": false}, {"text": " improved", "end_time": 78.32, "highlight": false, "start_time": 77.9, "strikethrough": false}, {"text": " in", "end_time": 78.44, "highlight": false, "start_time": 78.32, "strikethrough": false}, {"text": " their", "end_time": 78.53, "highlight": false, "start_time": 78.44, "strikethrough": false}, {"text": " current", "end_time": 78.92, "highlight": false, "start_time": 78.53, "strikethrough": false}, {"text": " workflow,", "end_time": 80.03, "highlight": false, "start_time": 79.25, "strikethrough": false}, {"text": " but", "end_time": 80.63, "highlight": false, "start_time": 80.42, "strikethrough": false}, {"text": " collaborative.", "end_time": 81.34, "highlight": false, "start_time": 80.67, "strikethrough": false}, {"text": " OK,", "end_time": 82.25, "highlight": false, "start_time": 81.8, "strikethrough": false}, {"text": " I'll", "end_time": 82.58, "highlight": false, "start_time": 82.28, "strikethrough": false}, {"text": " come", "end_time": 82.97, "highlight": false, "start_time": 82.59, "strikethrough": false}, {"text": " to", "end_time": 83.09, "highlight": false, "start_time": 82.97, "strikethrough": false}, {"text": " the", "end_time": 83.21, "highlight": false, "start_time": 83.09, "strikethrough": false}, {"text": " results", "end_time": 83.66, "highlight": false, "start_time": 83.21, "strikethrough": false}, {"text": " in", "end_time": 83.78, "highlight": false, "start_time": 83.66, "strikethrough": false}, {"text": " a", "end_time": 83.84, "highlight": false, "start_time": 83.78, "strikethrough": false}, {"text": " second.", "end_time": 84.26, "highlight": false, "start_time": 83.84, "strikethrough": false}, {"text": " But", "end_time": 84.68, "highlight": false, "start_time": 84.26, "strikethrough": false}, {"text": " just", "end_time": 85.34, "highlight": false, "start_time": 85.04, "strikethrough": false}, {"text": " to", "end_time": 85.46, "highlight": false, "start_time": 85.34, "strikethrough": false}, {"text": " be", "end_time": 85.7, "highlight": false, "start_time": 85.46, "strikethrough": false}, {"text": " on", "end_time": 85.88, "highlight": false, "start_time": 85.7, "strikethrough": false}, {"text": " the", "end_time": 85.97, "highlight": false, "start_time": 85.88, "strikethrough": false}, {"text": " safe", "end_time": 86.33, "highlight": false, "start_time": 85.97, "strikethrough": false}, {"text": " side,", "end_time": 86.69, "highlight": false, "start_time": 86.33, "strikethrough": false}, {"text": " stop", "end_time": 87.05, "highlight": false, "start_time": 86.69, "strikethrough": false}, {"text": " the", "end_time": 87.17, "highlight": false, "start_time": 87.05, "strikethrough": false}, {"text": " recording", "end_time": 87.71, "highlight": false, "start_time": 87.17, "strikethrough": false}, {"text": " here.", "end_time": 88.1, "highlight": false, "start_time": 87.71, "strikethrough": false}], "speaker": "Speaker1", "end_time": 88.1, "start_time": 0.68}]	completed
5c5ffda1-4bf0-4643-8a80-522481d6b015	2021-07-06 10:15:28.848+00	2021-07-06 10:18:44.198404+00	ovq9bMqv	[{"words": [{"text": "Great,", "end_time": 2.03, "highlight": false, "start_time": 1.59, "strikethrough": false}, {"text": " it", "end_time": 2.22, "highlight": false, "start_time": 2.04, "strikethrough": false}, {"text": " worked.", "end_time": 2.62, "highlight": false, "start_time": 2.22, "strikethrough": false}, {"text": " So", "end_time": 3.06, "highlight": false, "start_time": 2.67, "strikethrough": false}, {"text": " let's", "end_time": 3.84, "highlight": false, "start_time": 3.54, "strikethrough": false}, {"text": " go", "end_time": 3.99, "highlight": false, "start_time": 3.84, "strikethrough": false}, {"text": " to", "end_time": 4.14, "highlight": false, "start_time": 3.99, "strikethrough": false}, {"text": " the", "end_time": 4.41, "highlight": false, "start_time": 4.14, "strikethrough": false}, {"text": " survey", "end_time": 4.77, "highlight": false, "start_time": 4.41, "strikethrough": false}, {"text": " results,", "end_time": 5.46, "highlight": false, "start_time": 4.77, "strikethrough": false}, {"text": " average", "end_time": 6.27, "highlight": false, "start_time": 5.88, "strikethrough": false}, {"text": " satisfaction", "end_time": 7.23, "highlight": false, "start_time": 6.27, "strikethrough": false}, {"text": " rating", "end_time": 7.92, "highlight": false, "start_time": 7.23, "strikethrough": false}, {"text": " with", "end_time": 8.22, "highlight": false, "start_time": 7.92, "strikethrough": false}, {"text": " the", "end_time": 8.34, "highlight": false, "start_time": 8.22, "strikethrough": false}, {"text": " collaboration", "end_time": 8.94, "highlight": false, "start_time": 8.34, "strikethrough": false}, {"text": " process", "end_time": 9.42, "highlight": false, "start_time": 8.94, "strikethrough": false}, {"text": " was", "end_time": 9.84, "highlight": false, "start_time": 9.42, "strikethrough": false}, {"text": " superhigh,", "end_time": 10.74, "highlight": false, "start_time": 9.84, "strikethrough": false}, {"text": " I", "end_time": 10.86, "highlight": false, "start_time": 10.74, "strikethrough": false}, {"text": " would", "end_time": 11.01, "highlight": false, "start_time": 10.86, "strikethrough": false}, {"text": " say", "end_time": 11.37, "highlight": false, "start_time": 11.01, "strikethrough": false}, {"text": " so.", "end_time": 12.66, "highlight": false, "start_time": 12.45, "strikethrough": false}, {"text": " On", "end_time": 12.81, "highlight": false, "start_time": 12.66, "strikethrough": false}, {"text": " a", "end_time": 12.84, "highlight": false, "start_time": 12.81, "strikethrough": false}, {"text": " scale", "end_time": 13.08, "highlight": false, "start_time": 12.84, "strikethrough": false}, {"text": " from", "end_time": 13.29, "highlight": false, "start_time": 13.08, "strikethrough": false}, {"text": " zero", "end_time": 13.59, "highlight": false, "start_time": 13.29, "strikethrough": false}, {"text": " to", "end_time": 13.77, "highlight": false, "start_time": 13.59, "strikethrough": false}, {"text": " 10,", "end_time": 14.1, "highlight": false, "start_time": 13.77, "strikethrough": false}, {"text": " the", "end_time": 14.22, "highlight": false, "start_time": 14.1, "strikethrough": false}, {"text": " average", "end_time": 14.64, "highlight": false, "start_time": 14.22, "strikethrough": false}, {"text": " rating", "end_time": 14.97, "highlight": false, "start_time": 14.64, "strikethrough": false}, {"text": " was", "end_time": 15.27, "highlight": false, "start_time": 14.97, "strikethrough": false}, {"text": " eight", "end_time": 15.66, "highlight": false, "start_time": 15.27, "strikethrough": false}, {"text": " point", "end_time": 16.02, "highlight": false, "start_time": 15.66, "strikethrough": false}, {"text": " two.", "end_time": 16.68, "highlight": false, "start_time": 16.02, "strikethrough": false}, {"text": " Then", "end_time": 19.11, "highlight": false, "start_time": 18.81, "strikethrough": false}, {"text": " here", "end_time": 19.83, "highlight": false, "start_time": 19.11, "strikethrough": false}, {"text": " you", "end_time": 20.34, "highlight": false, "start_time": 20.13, "strikethrough": false}, {"text": " can", "end_time": 20.52, "highlight": false, "start_time": 20.34, "strikethrough": false}, {"text": " go", "end_time": 20.7, "highlight": false, "start_time": 20.52, "strikethrough": false}, {"text": " through", "end_time": 20.88, "highlight": false, "start_time": 20.7, "strikethrough": false}, {"text": " that", "end_time": 21.18, "highlight": false, "start_time": 20.88, "strikethrough": false}, {"text": " data.", "end_time": 21.62, "highlight": false, "start_time": 21.18, "strikethrough": false}, {"text": " But", "end_time": 21.87, "highlight": false, "start_time": 21.63, "strikethrough": false}, {"text": " that's", "end_time": 22.35, "highlight": false, "start_time": 21.87, "strikethrough": false}, {"text": " these", "end_time": 22.83, "highlight": false, "start_time": 22.56, "strikethrough": false}, {"text": " are", "end_time": 22.92, "highlight": false, "start_time": 22.83, "strikethrough": false}, {"text": " the", "end_time": 22.98, "highlight": false, "start_time": 22.92, "strikethrough": false}, {"text": " most", "end_time": 23.31, "highlight": false, "start_time": 22.98, "strikethrough": false}, {"text": " common", "end_time": 23.64, "highlight": false, "start_time": 23.31, "strikethrough": false}, {"text": " things", "end_time": 24.03, "highlight": false, "start_time": 23.64, "strikethrough": false}, {"text": " that", "end_time": 24.21, "highlight": false, "start_time": 24.03, "strikethrough": false}, {"text": " people", "end_time": 24.54, "highlight": false, "start_time": 24.21, "strikethrough": false}, {"text": " use", "end_time": 24.93, "highlight": false, "start_time": 24.54, "strikethrough": false}, {"text": " the", "end_time": 25.02, "highlight": false, "start_time": 24.93, "strikethrough": false}, {"text": " video", "end_time": 25.35, "highlight": false, "start_time": 25.02, "strikethrough": false}, {"text": " recordings", "end_time": 25.98, "highlight": false, "start_time": 25.35, "strikethrough": false}, {"text": " for,", "end_time": 26.61, "highlight": false, "start_time": 25.98, "strikethrough": false}, {"text": " I", "end_time": 27.9, "highlight": false, "start_time": 27.63, "strikethrough": false}, {"text": " think", "end_time": 28.53, "highlight": false, "start_time": 27.9, "strikethrough": false}, {"text": " for", "end_time": 28.84, "highlight": false, "start_time": 28.53, "strikethrough": false}, {"text": " now", "end_time": 29.24, "highlight": false, "start_time": 28.87, "strikethrough": false}, {"text": " that", "end_time": 29.55, "highlight": false, "start_time": 29.25, "strikethrough": false}, {"text": " I", "end_time": 30.48, "highlight": false, "start_time": 30.33, "strikethrough": false}, {"text": " would", "end_time": 30.63, "highlight": false, "start_time": 30.48, "strikethrough": false}, {"text": " say", "end_time": 30.87, "highlight": false, "start_time": 30.63, "strikethrough": false}, {"text": " expected.", "end_time": 31.68, "highlight": false, "start_time": 30.87, "strikethrough": false}, {"text": " And", "end_time": 33.39, "highlight": false, "start_time": 33.12, "strikethrough": false}, {"text": " then", "end_time": 33.87, "highlight": false, "start_time": 33.39, "strikethrough": false}, {"text": " the", "end_time": 35.04, "highlight": false, "start_time": 34.8, "strikethrough": false}, {"text": " open", "end_time": 35.37, "highlight": false, "start_time": 35.04, "strikethrough": false}, {"text": " question,", "end_time": 35.76, "highlight": false, "start_time": 35.37, "strikethrough": false}, {"text": " which", "end_time": 36.06, "highlight": false, "start_time": 35.76, "strikethrough": false}, {"text": " things", "end_time": 36.45, "highlight": false, "start_time": 36.06, "strikethrough": false}, {"text": " people", "end_time": 36.72, "highlight": false, "start_time": 36.45, "strikethrough": false}, {"text": " would", "end_time": 36.87, "highlight": false, "start_time": 36.72, "strikethrough": false}, {"text": " like", "end_time": 37.02, "highlight": false, "start_time": 36.87, "strikethrough": false}, {"text": " to", "end_time": 37.12, "highlight": false, "start_time": 37.02, "strikethrough": false}, {"text": " have", "end_time": 37.26, "highlight": false, "start_time": 37.12, "strikethrough": false}, {"text": " improved", "end_time": 37.73, "highlight": false, "start_time": 37.26, "strikethrough": false}, {"text": " in", "end_time": 37.83, "highlight": false, "start_time": 37.74, "strikethrough": false}, {"text": " the", "end_time": 37.89, "highlight": false, "start_time": 37.83, "strikethrough": false}, {"text": " current", "end_time": 38.16, "highlight": false, "start_time": 37.89, "strikethrough": false}, {"text": " workflow", "end_time": 38.7, "highlight": false, "start_time": 38.16, "strikethrough": false}, {"text": " when", "end_time": 38.94, "highlight": false, "start_time": 38.7, "strikethrough": false}, {"text": " collaborating.", "end_time": 39.69, "highlight": false, "start_time": 38.94, "strikethrough": false}, {"text": " So", "end_time": 40.65, "highlight": false, "start_time": 40.35, "strikethrough": false}, {"text": " most", "end_time": 40.95, "highlight": false, "start_time": 40.65, "strikethrough": false}, {"text": " of", "end_time": 41.04, "highlight": false, "start_time": 40.95, "strikethrough": false}, {"text": " the", "end_time": 41.16, "highlight": false, "start_time": 41.04, "strikethrough": false}, {"text": " people", "end_time": 41.76, "highlight": false, "start_time": 41.16, "strikethrough": false}, {"text": " one", "end_time": 42.45, "highlight": false, "start_time": 42.15, "strikethrough": false}, {"text": " third", "end_time": 42.84, "highlight": false, "start_time": 42.45, "strikethrough": false}, {"text": " said", "end_time": 43.17, "highlight": false, "start_time": 42.84, "strikethrough": false}, {"text": " audio", "end_time": 43.62, "highlight": false, "start_time": 43.17, "strikethrough": false}, {"text": " or", "end_time": 43.77, "highlight": false, "start_time": 43.62, "strikethrough": false}, {"text": " video", "end_time": 44.16, "highlight": false, "start_time": 43.77, "strikethrough": false}, {"text": " quality,", "end_time": 44.94, "highlight": false, "start_time": 44.16, "strikethrough": false}, {"text": " then", "end_time": 45.72, "highlight": false, "start_time": 45.36, "strikethrough": false}, {"text": " something", "end_time": 46.17, "highlight": false, "start_time": 45.72, "strikethrough": false}, {"text": " around", "end_time": 46.5, "highlight": false, "start_time": 46.17, "strikethrough": false}, {"text": " collaboration,", "end_time": 47.58, "highlight": false, "start_time": 46.5, "strikethrough": false}, {"text": " 20", "end_time": 48.81, "highlight": false, "start_time": 48.39, "strikethrough": false}, {"text": " percent.", "end_time": 49.56, "highlight": false, "start_time": 48.81, "strikethrough": false}, {"text": " That", "end_time": 50.82, "highlight": false, "start_time": 50.61, "strikethrough": false}, {"text": " is", "end_time": 50.97, "highlight": false, "start_time": 50.85, "strikethrough": false}, {"text": " the", "end_time": 51.09, "highlight": false, "start_time": 50.97, "strikethrough": false}, {"text": " part", "end_time": 51.42, "highlight": false, "start_time": 51.09, "strikethrough": false}, {"text": " that", "end_time": 51.63, "highlight": false, "start_time": 51.42, "strikethrough": false}, {"text": " interested", "end_time": 52.11, "highlight": false, "start_time": 51.63, "strikethrough": false}, {"text": " US", "end_time": 52.56, "highlight": false, "start_time": 52.11, "strikethrough": false}, {"text": " video,", "end_time": 53.07, "highlight": false, "start_time": 52.56, "strikethrough": false}, {"text": " but", "end_time": 53.28, "highlight": false, "start_time": 53.07, "strikethrough": false}, {"text": " a", "end_time": 53.34, "highlight": false, "start_time": 53.28, "strikethrough": false}, {"text": " video", "end_time": 53.7, "highlight": false, "start_time": 53.34, "strikethrough": false}, {"text": " editing,", "end_time": 54.69, "highlight": false, "start_time": 53.7, "strikethrough": false}, {"text": " nothing", "end_time": 55.32, "highlight": false, "start_time": 54.84, "strikethrough": false}, {"text": " at", "end_time": 55.44, "highlight": false, "start_time": 55.32, "strikethrough": false}, {"text": " all", "end_time": 55.86, "highlight": false, "start_time": 55.44, "strikethrough": false}, {"text": " but", "end_time": 56.07, "highlight": false, "start_time": 55.86, "strikethrough": false}, {"text": " a", "end_time": 56.25, "highlight": false, "start_time": 56.07, "strikethrough": false}, {"text": " user", "end_time": 56.64, "highlight": false, "start_time": 56.28, "strikethrough": false}, {"text": " interface.", "end_time": 57.63, "highlight": false, "start_time": 56.64, "strikethrough": false}, {"text": " The", "end_time": 58.08, "highlight": false, "start_time": 57.9, "strikethrough": false}, {"text": " long", "end_time": 58.38, "highlight": false, "start_time": 58.08, "strikethrough": false}, {"text": " video", "end_time": 58.71, "highlight": false, "start_time": 58.38, "strikethrough": false}, {"text": " problem", "end_time": 59.37, "highlight": false, "start_time": 58.71, "strikethrough": false}, {"text": " drawing", "end_time": 59.79, "highlight": false, "start_time": 59.37, "strikethrough": false}, {"text": " to", "end_time": 60.03, "highlight": false, "start_time": 59.79, "strikethrough": false}, {"text": " a", "end_time": 60.09, "highlight": false, "start_time": 60.03, "strikethrough": false}, {"text": " recording.", "end_time": 60.71, "highlight": false, "start_time": 60.09, "strikethrough": false}, {"text": " So", "end_time": 61.11, "highlight": false, "start_time": 60.9, "strikethrough": false}, {"text": " all", "end_time": 61.23, "highlight": false, "start_time": 61.11, "strikethrough": false}, {"text": " these", "end_time": 61.47, "highlight": false, "start_time": 61.23, "strikethrough": false}, {"text": " things", "end_time": 61.92, "highlight": false, "start_time": 61.47, "strikethrough": false}, {"text": " in", "end_time": 62.16, "highlight": false, "start_time": 61.92, "strikethrough": false}, {"text": " the", "end_time": 62.25, "highlight": false, "start_time": 62.16, "strikethrough": false}, {"text": " video", "end_time": 62.61, "highlight": false, "start_time": 62.25, "strikethrough": false}, {"text": " recording", "end_time": 63.18, "highlight": false, "start_time": 62.61, "strikethrough": false}, {"text": " and", "end_time": 63.3, "highlight": false, "start_time": 63.18, "strikethrough": false}, {"text": " editing", "end_time": 63.75, "highlight": false, "start_time": 63.3, "strikethrough": false}, {"text": " process", "end_time": 64.32, "highlight": false, "start_time": 63.75, "strikethrough": false}, {"text": " that", "end_time": 64.59, "highlight": false, "start_time": 64.32, "strikethrough": false}, {"text": " doesn't", "end_time": 64.95, "highlight": false, "start_time": 64.59, "strikethrough": false}, {"text": " interest", "end_time": 65.33, "highlight": false, "start_time": 64.95, "strikethrough": false}, {"text": " don't", "end_time": 65.67, "highlight": false, "start_time": 65.34, "strikethrough": false}, {"text": " interest", "end_time": 66.09, "highlight": false, "start_time": 65.67, "strikethrough": false}, {"text": " at", "end_time": 66.27, "highlight": false, "start_time": 66.09, "strikethrough": false}, {"text": " all", "end_time": 66.56, "highlight": false, "start_time": 66.27, "strikethrough": false}, {"text": " us", "end_time": 66.84, "highlight": false, "start_time": 66.58, "strikethrough": false}, {"text": " at", "end_time": 66.96, "highlight": false, "start_time": 66.84, "strikethrough": false}, {"text": " all", "end_time": 67.29, "highlight": false, "start_time": 66.96, "strikethrough": false}, {"text": " where", "end_time": 68.16, "highlight": false, "start_time": 67.68, "strikethrough": false}, {"text": " the", "end_time": 68.64, "highlight": false, "start_time": 68.49, "strikethrough": false}, {"text": " rest", "end_time": 68.97, "highlight": false, "start_time": 68.64, "strikethrough": false}, {"text": " of", "end_time": 69.18, "highlight": false, "start_time": 68.97, "strikethrough": false}, {"text": " the", "end_time": 69.63, "highlight": false, "start_time": 69.18, "strikethrough": false}, {"text": " answers.", "end_time": 70.53, "highlight": false, "start_time": 69.78, "strikethrough": false}, {"text": " OK,", "end_time": 72.61, "highlight": false, "start_time": 72.21, "strikethrough": false}, {"text": " so", "end_time": 73.02, "highlight": false, "start_time": 72.63, "strikethrough": false}, {"text": " five", "end_time": 73.62, "highlight": false, "start_time": 73.02, "strikethrough": false}, {"text": " out", "end_time": 73.89, "highlight": false, "start_time": 73.62, "strikethrough": false}, {"text": " of", "end_time": 74.28, "highlight": false, "start_time": 73.89, "strikethrough": false}, {"text": " twenty", "end_time": 74.82, "highlight": false, "start_time": 74.4, "strikethrough": false}, {"text": " five", "end_time": 75.36, "highlight": false, "start_time": 74.82, "strikethrough": false}, {"text": " people", "end_time": 76.32, "highlight": false, "start_time": 75.6, "strikethrough": false}, {"text": " said", "end_time": 76.68, "highlight": false, "start_time": 76.35, "strikethrough": false}, {"text": " that", "end_time": 76.86, "highlight": false, "start_time": 76.68, "strikethrough": false}, {"text": " they", "end_time": 77.04, "highlight": false, "start_time": 76.86, "strikethrough": false}, {"text": " would", "end_time": 77.34, "highlight": false, "start_time": 77.04, "strikethrough": false}, {"text": " like", "end_time": 77.61, "highlight": false, "start_time": 77.34, "strikethrough": false}, {"text": " to", "end_time": 77.7, "highlight": false, "start_time": 77.61, "strikethrough": false}, {"text": " have", "end_time": 77.82, "highlight": false, "start_time": 77.7, "strikethrough": false}, {"text": " a", "end_time": 77.88, "highlight": false, "start_time": 77.82, "strikethrough": false}, {"text": " better", "end_time": 78.09, "highlight": false, "start_time": 77.88, "strikethrough": false}, {"text": " collaboration.", "end_time": 78.93, "highlight": false, "start_time": 78.09, "strikethrough": false}, {"text": " And", "end_time": 79.47, "highlight": false, "start_time": 79.23, "strikethrough": false}, {"text": " here", "end_time": 79.74, "highlight": false, "start_time": 79.47, "strikethrough": false}, {"text": " are", "end_time": 79.89, "highlight": false, "start_time": 79.74, "strikethrough": false}, {"text": " the", "end_time": 80.07, "highlight": false, "start_time": 79.89, "strikethrough": false}, {"text": " answers", "end_time": 80.49, "highlight": false, "start_time": 80.07, "strikethrough": false}, {"text": " and", "end_time": 80.58, "highlight": false, "start_time": 80.49, "strikethrough": false}, {"text": " details", "end_time": 81.21, "highlight": false, "start_time": 80.58, "strikethrough": false}, {"text": " of", "end_time": 81.27, "highlight": false, "start_time": 81.21, "strikethrough": false}, {"text": " one", "end_time": 81.45, "highlight": false, "start_time": 81.27, "strikethrough": false}, {"text": " person", "end_time": 81.81, "highlight": false, "start_time": 81.45, "strikethrough": false}, {"text": " wanted", "end_time": 81.99, "highlight": false, "start_time": 81.81, "strikethrough": false}, {"text": " to", "end_time": 82.11, "highlight": false, "start_time": 82, "strikethrough": false}, {"text": " combine", "end_time": 82.53, "highlight": false, "start_time": 82.11, "strikethrough": false}, {"text": " it", "end_time": 82.62, "highlight": false, "start_time": 82.53, "strikethrough": false}, {"text": " with", "end_time": 82.8, "highlight": false, "start_time": 82.62, "strikethrough": false}, {"text": " quizzes", "end_time": 83.25, "highlight": false, "start_time": 82.8, "strikethrough": false}, {"text": " and", "end_time": 83.37, "highlight": false, "start_time": 83.25, "strikethrough": false}, {"text": " other", "end_time": 84, "highlight": false, "start_time": 83.7, "strikethrough": false}, {"text": " interactive", "end_time": 84.57, "highlight": false, "start_time": 84, "strikethrough": false}, {"text": " parts,", "end_time": 85.14, "highlight": false, "start_time": 84.57, "strikethrough": false}, {"text": " improve", "end_time": 85.85, "highlight": false, "start_time": 85.55, "strikethrough": false}, {"text": " integration", "end_time": 86.37, "highlight": false, "start_time": 85.86, "strikethrough": false}, {"text": " with", "end_time": 86.55, "highlight": false, "start_time": 86.37, "strikethrough": false}, {"text": " CRM", "end_time": 87.26, "highlight": false, "start_time": 86.55, "strikethrough": false}, {"text": " interactive", "end_time": 87.81, "highlight": false, "start_time": 87.27, "strikethrough": false}, {"text": " functions,", "end_time": 88.68, "highlight": false, "start_time": 87.81, "strikethrough": false}, {"text": " quality", "end_time": 89.76, "highlight": false, "start_time": 89.28, "strikethrough": false}, {"text": " of", "end_time": 89.88, "highlight": false, "start_time": 89.76, "strikethrough": false}, {"text": " videos", "end_time": 90.36, "highlight": false, "start_time": 89.88, "strikethrough": false}, {"text": " and", "end_time": 90.54, "highlight": false, "start_time": 90.36, "strikethrough": false}, {"text": " integrate", "end_time": 91.02, "highlight": false, "start_time": 90.54, "strikethrough": false}, {"text": " tools", "end_time": 91.83, "highlight": false, "start_time": 91.02, "strikethrough": false}, {"text": " and", "end_time": 92.55, "highlight": false, "start_time": 92.13, "strikethrough": false}, {"text": " video", "end_time": 92.88, "highlight": false, "start_time": 92.55, "strikethrough": false}, {"text": " sharing", "end_time": 93.39, "highlight": false, "start_time": 92.88, "strikethrough": false}, {"text": " process.", "end_time": 94.32, "highlight": false, "start_time": 93.39, "strikethrough": false}, {"text": " OK,", "end_time": 95.69, "highlight": false, "start_time": 95.4, "strikethrough": false}, {"text": " so", "end_time": 95.91, "highlight": false, "start_time": 95.73, "strikethrough": false}, {"text": " for", "end_time": 96.06, "highlight": false, "start_time": 95.91, "strikethrough": false}, {"text": " me", "end_time": 96.33, "highlight": false, "start_time": 96.06, "strikethrough": false}, {"text": " now", "end_time": 96.57, "highlight": false, "start_time": 96.33, "strikethrough": false}, {"text": " the", "end_time": 96.66, "highlight": false, "start_time": 96.57, "strikethrough": false}, {"text": " question", "end_time": 97.08, "highlight": false, "start_time": 96.66, "strikethrough": false}, {"text": " is.", "end_time": 97.41, "highlight": false, "start_time": 97.08, "strikethrough": false}, {"text": " How", "end_time": 100.71, "highlight": false, "start_time": 100.05, "strikethrough": false}, {"text": " who", "end_time": 101.12, "highlight": false, "start_time": 100.89, "strikethrough": false}, {"text": " were", "end_time": 101.37, "highlight": false, "start_time": 101.13, "strikethrough": false}, {"text": " these", "end_time": 101.64, "highlight": false, "start_time": 101.37, "strikethrough": false}, {"text": " five", "end_time": 101.88, "highlight": false, "start_time": 101.64, "strikethrough": false}, {"text": " users", "end_time": 102.3, "highlight": false, "start_time": 101.88, "strikethrough": false}, {"text": " that", "end_time": 102.51, "highlight": false, "start_time": 102.3, "strikethrough": false}, {"text": " one", "end_time": 102.72, "highlight": false, "start_time": 102.51, "strikethrough": false}, {"text": " of", "end_time": 102.81, "highlight": false, "start_time": 102.72, "strikethrough": false}, {"text": " the", "end_time": 103.08, "highlight": false, "start_time": 102.81, "strikethrough": false}, {"text": " functionality,", "end_time": 103.89, "highlight": false, "start_time": 103.08, "strikethrough": false}, {"text": " so", "end_time": 104.22, "highlight": false, "start_time": 103.91, "strikethrough": false}, {"text": " most", "end_time": 105.21, "highlight": false, "start_time": 104.85, "strikethrough": false}, {"text": " of", "end_time": 105.3, "highlight": false, "start_time": 105.21, "strikethrough": false}, {"text": " them", "end_time": 105.48, "highlight": false, "start_time": 105.3, "strikethrough": false}, {"text": " collaborated", "end_time": 106.29, "highlight": false, "start_time": 105.48, "strikethrough": false}, {"text": " with", "end_time": 107.07, "highlight": false, "start_time": 106.65, "strikethrough": false}, {"text": " one", "end_time": 107.7, "highlight": false, "start_time": 107.4, "strikethrough": false}, {"text": " to", "end_time": 107.85, "highlight": false, "start_time": 107.7, "strikethrough": false}, {"text": " four", "end_time": 108.09, "highlight": false, "start_time": 107.85, "strikethrough": false}, {"text": " videos", "end_time": 108.54, "highlight": false, "start_time": 108.09, "strikethrough": false}, {"text": " per", "end_time": 108.78, "highlight": false, "start_time": 108.54, "strikethrough": false}, {"text": " week,", "end_time": 109.29, "highlight": false, "start_time": 108.78, "strikethrough": false}, {"text": " so", "end_time": 109.86, "highlight": false, "start_time": 109.32, "strikethrough": false}, {"text": " not", "end_time": 110.9, "highlight": false, "start_time": 110.22, "strikethrough": false}, {"text": " yeah,", "end_time": 111.56, "highlight": false, "start_time": 111.15, "strikethrough": false}, {"text": " not", "end_time": 112.35, "highlight": false, "start_time": 112.05, "strikethrough": false}, {"text": " super", "end_time": 112.84, "highlight": false, "start_time": 112.35, "strikethrough": false}, {"text": " rare", "end_time": 113.19, "highlight": false, "start_time": 112.84, "strikethrough": false}, {"text": " usage,", "end_time": 113.7, "highlight": false, "start_time": 113.19, "strikethrough": false}, {"text": " but", "end_time": 114.03, "highlight": false, "start_time": 113.7, "strikethrough": false}, {"text": " also", "end_time": 114.33, "highlight": false, "start_time": 114.03, "strikethrough": false}, {"text": " not", "end_time": 114.63, "highlight": false, "start_time": 114.33, "strikethrough": false}, {"text": " super", "end_time": 115.44, "highlight": false, "start_time": 114.99, "strikethrough": false}, {"text": " often.", "end_time": 115.98, "highlight": false, "start_time": 115.44, "strikethrough": false}], "speaker": "Speaker1", "end_time": 115.98, "start_time": 1.59}, {"words": [{"text": "They", "end_time": 116.61, "highlight": false, "start_time": 116.37, "strikethrough": false}, {"text": " all", "end_time": 116.76, "highlight": false, "start_time": 116.61, "strikethrough": false}, {"text": " use", "end_time": 117.12, "highlight": false, "start_time": 116.76, "strikethrough": false}, {"text": " you", "end_time": 117.6, "highlight": false, "start_time": 117.12, "strikethrough": false}, {"text": " room", "end_time": 117.99, "highlight": false, "start_time": 117.69, "strikethrough": false}, {"text": " and", "end_time": 118.47, "highlight": false, "start_time": 118.05, "strikethrough": false}, {"text": " another", "end_time": 118.83, "highlight": false, "start_time": 118.47, "strikethrough": false}, {"text": " tool.", "end_time": 119.49, "highlight": false, "start_time": 118.83, "strikethrough": false}, {"text": " And", "end_time": 121.08, "highlight": false, "start_time": 120.81, "strikethrough": false}, {"text": " also", "end_time": 121.35, "highlight": false, "start_time": 121.08, "strikethrough": false}, {"text": " their", "end_time": 121.59, "highlight": false, "start_time": 121.35, "strikethrough": false}, {"text": " average", "end_time": 122.04, "highlight": false, "start_time": 121.59, "strikethrough": false}, {"text": " rating", "end_time": 122.4, "highlight": false, "start_time": 122.04, "strikethrough": false}, {"text": " was", "end_time": 122.58, "highlight": false, "start_time": 122.4, "strikethrough": false}, {"text": " not", "end_time": 122.82, "highlight": false, "start_time": 122.58, "strikethrough": false}, {"text": " different", "end_time": 123.66, "highlight": false, "start_time": 122.82, "strikethrough": false}, {"text": " from", "end_time": 124.38, "highlight": false, "start_time": 123.75, "strikethrough": false}, {"text": " the", "end_time": 125.04, "highlight": false, "start_time": 124.53, "strikethrough": false}, {"text": " rating", "end_time": 125.91, "highlight": false, "start_time": 125.34, "strikethrough": false}, {"text": " of", "end_time": 126.24, "highlight": false, "start_time": 125.91, "strikethrough": false}, {"text": " the", "end_time": 126.39, "highlight": false, "start_time": 126.24, "strikethrough": false}, {"text": " whole", "end_time": 126.69, "highlight": false, "start_time": 126.39, "strikethrough": false}, {"text": " group.", "end_time": 127.05, "highlight": false, "start_time": 126.69, "strikethrough": false}, {"text": " So", "end_time": 127.5, "highlight": false, "start_time": 127.08, "strikethrough": false}, {"text": " basically", "end_time": 128.55, "highlight": false, "start_time": 127.89, "strikethrough": false}, {"text": " exactly", "end_time": 129.18, "highlight": false, "start_time": 128.58, "strikethrough": false}, {"text": " the", "end_time": 129.33, "highlight": false, "start_time": 129.18, "strikethrough": false}, {"text": " same", "end_time": 129.66, "highlight": false, "start_time": 129.33, "strikethrough": false}, {"text": " rating,", "end_time": 130.14, "highlight": false, "start_time": 129.66, "strikethrough": false}, {"text": " eight", "end_time": 130.41, "highlight": false, "start_time": 130.14, "strikethrough": false}, {"text": " point", "end_time": 130.68, "highlight": false, "start_time": 130.41, "strikethrough": false}, {"text": " two,", "end_time": 131.07, "highlight": false, "start_time": 130.68, "strikethrough": false}, {"text": " eight", "end_time": 131.28, "highlight": false, "start_time": 131.07, "strikethrough": false}, {"text": " point", "end_time": 131.55, "highlight": false, "start_time": 131.28, "strikethrough": false}, {"text": " two.", "end_time": 131.82, "highlight": false, "start_time": 131.55, "strikethrough": false}, {"text": " So", "end_time": 132.21, "highlight": false, "start_time": 132.03, "strikethrough": false}, {"text": " you", "end_time": 132.33, "highlight": false, "start_time": 132.21, "strikethrough": false}, {"text": " couldn't", "end_time": 132.6, "highlight": false, "start_time": 132.33, "strikethrough": false}, {"text": " say", "end_time": 132.96, "highlight": false, "start_time": 132.6, "strikethrough": false}, {"text": " people", "end_time": 133.56, "highlight": false, "start_time": 133.23, "strikethrough": false}, {"text": " who", "end_time": 133.8, "highlight": false, "start_time": 133.56, "strikethrough": false}, {"text": " were", "end_time": 134.51, "highlight": false, "start_time": 134.22, "strikethrough": false}, {"text": " have", "end_time": 134.97, "highlight": false, "start_time": 134.64, "strikethrough": false}, {"text": " this", "end_time": 135.24, "highlight": false, "start_time": 135, "strikethrough": false}, {"text": " problem", "end_time": 135.78, "highlight": false, "start_time": 135.24, "strikethrough": false}, {"text": " are", "end_time": 136.11, "highlight": false, "start_time": 135.78, "strikethrough": false}, {"text": " especially", "end_time": 137.43, "highlight": false, "start_time": 136.11, "strikethrough": false}, {"text": " unsatisfied", "end_time": 138.33, "highlight": false, "start_time": 137.55, "strikethrough": false}, {"text": " with", "end_time": 138.48, "highlight": false, "start_time": 138.33, "strikethrough": false}, {"text": " something.", "end_time": 139.02, "highlight": false, "start_time": 138.48, "strikethrough": false}, {"text": " Roads", "end_time": 140.2, "highlight": false, "start_time": 140, "strikethrough": false}, {"text": " of", "end_time": 140.58, "highlight": false, "start_time": 140.43, "strikethrough": false}, {"text": " the", "end_time": 140.76, "highlight": false, "start_time": 140.58, "strikethrough": false}, {"text": " people", "end_time": 141.09, "highlight": false, "start_time": 140.76, "strikethrough": false}, {"text": " who", "end_time": 141.24, "highlight": false, "start_time": 141.09, "strikethrough": false}, {"text": " answer,", "end_time": 141.66, "highlight": false, "start_time": 141.24, "strikethrough": false}, {"text": " they", "end_time": 141.96, "highlight": false, "start_time": 141.67, "strikethrough": false}, {"text": " want", "end_time": 142.14, "highlight": false, "start_time": 141.96, "strikethrough": false}, {"text": " to", "end_time": 142.2, "highlight": false, "start_time": 142.14, "strikethrough": false}, {"text": " have", "end_time": 142.32, "highlight": false, "start_time": 142.2, "strikethrough": false}, {"text": " better", "end_time": 142.53, "highlight": false, "start_time": 142.32, "strikethrough": false}, {"text": " collaboration", "end_time": 143.22, "highlight": false, "start_time": 142.53, "strikethrough": false}, {"text": " with", "end_time": 143.37, "highlight": false, "start_time": 143.22, "strikethrough": false}, {"text": " sales", "end_time": 143.73, "highlight": false, "start_time": 143.37, "strikethrough": false}, {"text": " representatives,", "end_time": 144.66, "highlight": false, "start_time": 143.73, "strikethrough": false}, {"text": " finance", "end_time": 145.44, "highlight": false, "start_time": 145.02, "strikethrough": false}, {"text": " manager,", "end_time": 145.83, "highlight": false, "start_time": 145.44, "strikethrough": false}, {"text": " H.R.", "end_time": 146.29, "highlight": false, "start_time": 145.92, "strikethrough": false}, {"text": " manager,", "end_time": 146.94, "highlight": false, "start_time": 146.31, "strikethrough": false}, {"text": " and", "end_time": 147.09, "highlight": false, "start_time": 146.94, "strikethrough": false}, {"text": " then", "end_time": 147.36, "highlight": false, "start_time": 147.09, "strikethrough": false}, {"text": " the", "end_time": 147.51, "highlight": false, "start_time": 147.36, "strikethrough": false}, {"text": " use", "end_time": 147.78, "highlight": false, "start_time": 147.51, "strikethrough": false}, {"text": " cases", "end_time": 148.29, "highlight": false, "start_time": 147.78, "strikethrough": false}, {"text": " that", "end_time": 148.53, "highlight": false, "start_time": 148.29, "strikethrough": false}, {"text": " they", "end_time": 149.1, "highlight": false, "start_time": 148.68, "strikethrough": false}, {"text": " told", "end_time": 150.54, "highlight": false, "start_time": 150.15, "strikethrough": false}, {"text": " me.", "end_time": 150.78, "highlight": false, "start_time": 150.54, "strikethrough": false}, {"text": " So", "end_time": 152.46, "highlight": false, "start_time": 152.28, "strikethrough": false}, {"text": " maybe", "end_time": 152.88, "highlight": false, "start_time": 152.46, "strikethrough": false}, {"text": " interesting", "end_time": 153.69, "highlight": false, "start_time": 152.88, "strikethrough": false}, {"text": " or", "end_time": 154.01, "highlight": false, "start_time": 153.69, "strikethrough": false}, {"text": " really", "end_time": 154.38, "highlight": false, "start_time": 154.02, "strikethrough": false}, {"text": " important", "end_time": 154.74, "highlight": false, "start_time": 154.38, "strikethrough": false}, {"text": " constraint.", "end_time": 155.52, "highlight": false, "start_time": 154.74, "strikethrough": false}, {"text": " If", "end_time": 156.57, "highlight": false, "start_time": 156.21, "strikethrough": false}, {"text": " we", "end_time": 156.87, "highlight": false, "start_time": 156.57, "strikethrough": false}, {"text": " say", "end_time": 157.35, "highlight": false, "start_time": 157.02, "strikethrough": false}, {"text": " that", "end_time": 157.68, "highlight": false, "start_time": 157.35, "strikethrough": false}, {"text": " Lumiere's", "end_time": 158.31, "highlight": false, "start_time": 157.69, "strikethrough": false}, {"text": " one", "end_time": 158.52, "highlight": false, "start_time": 158.31, "strikethrough": false}, {"text": " hundred", "end_time": 159.06, "highlight": false, "start_time": 158.52, "strikethrough": false}, {"text": " twenty", "end_time": 159.51, "highlight": false, "start_time": 159.06, "strikethrough": false}, {"text": " thousand", "end_time": 159.93, "highlight": false, "start_time": 159.51, "strikethrough": false}, {"text": " users,", "end_time": 160.53, "highlight": false, "start_time": 159.93, "strikethrough": false}, {"text": " we", "end_time": 161.37, "highlight": false, "start_time": 161.13, "strikethrough": false}, {"text": " would", "end_time": 161.55, "highlight": false, "start_time": 161.37, "strikethrough": false}, {"text": " need", "end_time": 161.76, "highlight": false, "start_time": 161.55, "strikethrough": false}, {"text": " a", "end_time": 161.79, "highlight": false, "start_time": 161.76, "strikethrough": false}, {"text": " sample", "end_time": 162.15, "highlight": false, "start_time": 161.79, "strikethrough": false}, {"text": " size", "end_time": 162.54, "highlight": false, "start_time": 162.15, "strikethrough": false}, {"text": " of", "end_time": 162.78, "highlight": false, "start_time": 162.54, "strikethrough": false}, {"text": " three", "end_time": 163.02, "highlight": false, "start_time": 162.78, "strikethrough": false}, {"text": " hundred", "end_time": 163.32, "highlight": false, "start_time": 163.02, "strikethrough": false}, {"text": " eighty", "end_time": 163.56, "highlight": false, "start_time": 163.32, "strikethrough": false}, {"text": " people", "end_time": 164.22, "highlight": false, "start_time": 163.56, "strikethrough": false}, {"text": " to", "end_time": 164.91, "highlight": false, "start_time": 164.22, "strikethrough": false}, {"text": " actually", "end_time": 165.6, "highlight": false, "start_time": 164.94, "strikethrough": false}, {"text": " have", "end_time": 165.84, "highlight": false, "start_time": 165.6, "strikethrough": false}, {"text": " representative", "end_time": 166.74, "highlight": false, "start_time": 165.84, "strikethrough": false}, {"text": " results.", "end_time": 167.19, "highlight": false, "start_time": 166.74, "strikethrough": false}, {"text": " So", "end_time": 167.46, "highlight": false, "start_time": 167.19, "strikethrough": false}, {"text": " with", "end_time": 167.91, "highlight": false, "start_time": 167.67, "strikethrough": false}, {"text": " our", "end_time": 168.18, "highlight": false, "start_time": 167.91, "strikethrough": false}, {"text": " twenty", "end_time": 168.57, "highlight": false, "start_time": 168.18, "strikethrough": false}, {"text": " five", "end_time": 168.9, "highlight": false, "start_time": 168.57, "strikethrough": false}, {"text": " people,", "end_time": 169.53, "highlight": false, "start_time": 168.9, "strikethrough": false}, {"text": " we", "end_time": 170.4, "highlight": false, "start_time": 170.19, "strikethrough": false}, {"text": " might", "end_time": 171.27, "highlight": false, "start_time": 170.4, "strikethrough": false}, {"text": " have", "end_time": 171.75, "highlight": false, "start_time": 171.27, "strikethrough": false}, {"text": " a", "end_time": 171.87, "highlight": false, "start_time": 171.75, "strikethrough": false}, {"text": " statistical", "end_time": 172.62, "highlight": false, "start_time": 171.87, "strikethrough": false}, {"text": " error", "end_time": 173.01, "highlight": false, "start_time": 172.62, "strikethrough": false}, {"text": " or", "end_time": 173.31, "highlight": false, "start_time": 173.13, "strikethrough": false}, {"text": " something.", "end_time": 173.79, "highlight": false, "start_time": 173.31, "strikethrough": false}, {"text": " OK,", "end_time": 174.98, "highlight": false, "start_time": 174.57, "strikethrough": false}, {"text": " so", "end_time": 175.53, "highlight": false, "start_time": 175.02, "strikethrough": false}, {"text": " rough", "end_time": 176.34, "highlight": false, "start_time": 176.04, "strikethrough": false}, {"text": " summary.", "end_time": 176.73, "highlight": false, "start_time": 176.34, "strikethrough": false}, {"text": " Satisfaction", "end_time": 177.66, "highlight": false, "start_time": 176.76, "strikethrough": false}, {"text": " with", "end_time": 177.93, "highlight": false, "start_time": 177.66, "strikethrough": false}, {"text": " you", "end_time": 178.3, "highlight": false, "start_time": 177.93, "strikethrough": false}, {"text": " is", "end_time": 178.65, "highlight": false, "start_time": 178.35, "strikethrough": false}, {"text": " overall", "end_time": 179.19, "highlight": false, "start_time": 178.65, "strikethrough": false}, {"text": " pretty", "end_time": 179.7, "highlight": false, "start_time": 179.19, "strikethrough": false}, {"text": " high.", "end_time": 179.94, "highlight": false, "start_time": 179.7, "strikethrough": false}, {"text": " I", "end_time": 180.06, "highlight": false, "start_time": 179.94, "strikethrough": false}, {"text": " would", "end_time": 180.24, "highlight": false, "start_time": 180.06, "strikethrough": false}, {"text": " say", "end_time": 180.65, "highlight": false, "start_time": 180.24, "strikethrough": false}, {"text": " so,", "end_time": 182, "highlight": false, "start_time": 181.5, "strikethrough": false}, {"text": " yeah.", "end_time": 183.55, "highlight": false, "start_time": 183.21, "strikethrough": false}, {"text": " The", "end_time": 183.78, "highlight": false, "start_time": 183.63, "strikethrough": false}, {"text": " question", "end_time": 184.23, "highlight": false, "start_time": 183.78, "strikethrough": false}, {"text": " for", "end_time": 184.44, "highlight": false, "start_time": 184.23, "strikethrough": false}, {"text": " me", "end_time": 184.8, "highlight": false, "start_time": 184.44, "strikethrough": false}, {"text": " and", "end_time": 185.25, "highlight": false, "start_time": 184.8, "strikethrough": false}, {"text": " something", "end_time": 185.67, "highlight": false, "start_time": 185.25, "strikethrough": false}, {"text": " that", "end_time": 185.79, "highlight": false, "start_time": 185.67, "strikethrough": false}, {"text": " we", "end_time": 185.91, "highlight": false, "start_time": 185.79, "strikethrough": false}, {"text": " should", "end_time": 186.09, "highlight": false, "start_time": 185.91, "strikethrough": false}, {"text": " discuss", "end_time": 186.54, "highlight": false, "start_time": 186.09, "strikethrough": false}, {"text": " is", "end_time": 186.87, "highlight": false, "start_time": 186.54, "strikethrough": false}, {"text": " do", "end_time": 187.95, "highlight": false, "start_time": 187.77, "strikethrough": false}, {"text": " we", "end_time": 188.07, "highlight": false, "start_time": 187.95, "strikethrough": false}, {"text": " want", "end_time": 188.28, "highlight": false, "start_time": 188.07, "strikethrough": false}, {"text": " to", "end_time": 188.49, "highlight": false, "start_time": 188.28, "strikethrough": false}, {"text": " further", "end_time": 189.54, "highlight": false, "start_time": 188.5, "strikethrough": false}, {"text": " like", "end_time": 189.84, "highlight": false, "start_time": 189.57, "strikethrough": false}, {"text": " do", "end_time": 189.96, "highlight": false, "start_time": 189.84, "strikethrough": false}, {"text": " we", "end_time": 190.11, "highlight": false, "start_time": 189.96, "strikethrough": false}, {"text": " want", "end_time": 190.26, "highlight": false, "start_time": 190.11, "strikethrough": false}, {"text": " to", "end_time": 190.38, "highlight": false, "start_time": 190.26, "strikethrough": false}, {"text": " look", "end_time": 190.65, "highlight": false, "start_time": 190.38, "strikethrough": false}, {"text": " into", "end_time": 190.92, "highlight": false, "start_time": 190.65, "strikethrough": false}, {"text": " the", "end_time": 191.1, "highlight": false, "start_time": 190.92, "strikethrough": false}, {"text": " one", "end_time": 191.37, "highlight": false, "start_time": 191.1, "strikethrough": false}, {"text": " or", "end_time": 191.46, "highlight": false, "start_time": 191.37, "strikethrough": false}, {"text": " five", "end_time": 191.79, "highlight": false, "start_time": 191.47, "strikethrough": false}, {"text": " users", "end_time": 192.24, "highlight": false, "start_time": 191.79, "strikethrough": false}, {"text": " who", "end_time": 192.54, "highlight": false, "start_time": 192.24, "strikethrough": false}, {"text": " actually", "end_time": 193.41, "highlight": false, "start_time": 192.9, "strikethrough": false}, {"text": " want", "end_time": 193.62, "highlight": false, "start_time": 193.41, "strikethrough": false}, {"text": " to", "end_time": 193.71, "highlight": false, "start_time": 193.62, "strikethrough": false}, {"text": " have", "end_time": 193.83, "highlight": false, "start_time": 193.71, "strikethrough": false}, {"text": " a", "end_time": 193.89, "highlight": false, "start_time": 193.83, "strikethrough": false}, {"text": " better", "end_time": 194.16, "highlight": false, "start_time": 193.89, "strikethrough": false}, {"text": " collaboration", "end_time": 194.91, "highlight": false, "start_time": 194.16, "strikethrough": false}, {"text": " and", "end_time": 195.03, "highlight": false, "start_time": 194.91, "strikethrough": false}, {"text": " interaction", "end_time": 195.9, "highlight": false, "start_time": 195.03, "strikethrough": false}, {"text": " functionality?", "end_time": 197.46, "highlight": false, "start_time": 196.44, "strikethrough": false}, {"text": " Yeah.", "end_time": 199.24, "highlight": false, "start_time": 198.93, "strikethrough": false}, {"text": " So", "end_time": 199.71, "highlight": false, "start_time": 199.26, "strikethrough": false}, {"text": " I'm", "end_time": 200.01, "highlight": false, "start_time": 199.71, "strikethrough": false}, {"text": " serious", "end_time": 200.46, "highlight": false, "start_time": 200.01, "strikethrough": false}, {"text": " to.", "end_time": 201.15, "highlight": false, "start_time": 200.46, "strikethrough": false}, {"text": " I'm", "end_time": 203, "highlight": false, "start_time": 202.82, "strikethrough": false}, {"text": " curious", "end_time": 203.51, "highlight": false, "start_time": 203, "strikethrough": false}, {"text": " to", "end_time": 203.93, "highlight": false, "start_time": 203.51, "strikethrough": false}, {"text": " hear", "end_time": 204.65, "highlight": false, "start_time": 204.38, "strikethrough": false}, {"text": " your", "end_time": 204.86, "highlight": false, "start_time": 204.65, "strikethrough": false}, {"text": " thoughts", "end_time": 205.37, "highlight": false, "start_time": 204.86, "strikethrough": false}, {"text": " on", "end_time": 205.88, "highlight": false, "start_time": 205.55, "strikethrough": false}, {"text": " that.", "end_time": 206.39, "highlight": false, "start_time": 205.88, "strikethrough": false}], "speaker": "Speaker1", "end_time": 206.39, "start_time": 116.37}]	completed
76898c09-58e4-4025-8bb0-9ab8127978ac	2021-07-07 10:46:00.886+00	2021-07-07 10:46:00.886+00	bQkNyd9x	\N	preparing
1e0b9d2a-bf9f-4119-ae67-aaa4821d154f	2021-07-08 08:25:52.7+00	2021-07-08 08:25:52.7+00	8vXqljl2	\N	preparing
51c99e18-daf1-4f4a-be6d-c7766cc794ea	2021-07-12 15:11:24.658+00	2021-07-12 15:13:32.897564+00	j2gzmO9v	[{"words": [{"text": "Yamata", "end_time": 1.04, "highlight": false, "start_time": 0.66, "strikethrough": false}, {"text": " is", "end_time": 1.29, "highlight": false, "start_time": 1.23, "strikethrough": false}, {"text": " the", "end_time": 1.44, "highlight": false, "start_time": 1.35, "strikethrough": false}, {"text": " only", "end_time": 3.48, "highlight": false, "start_time": 3.18, "strikethrough": false}, {"text": " context,", "end_time": 4.12, "highlight": false, "start_time": 3.48, "strikethrough": false}, {"text": " so", "end_time": 4.38, "highlight": false, "start_time": 4.14, "strikethrough": false}, {"text": " as", "end_time": 5.37, "highlight": false, "start_time": 5.18, "strikethrough": false}, {"text": " we", "end_time": 6.38, "highlight": false, "start_time": 6.29, "strikethrough": false}, {"text": " have", "end_time": 6.6, "highlight": false, "start_time": 6.45, "strikethrough": false}, {"text": " got", "end_time": 6.81, "highlight": false, "start_time": 6.63, "strikethrough": false}, {"text": " to", "end_time": 7.73, "highlight": false, "start_time": 7.4, "strikethrough": false}, {"text": " reduce", "end_time": 9.07, "highlight": false, "start_time": 8.52, "strikethrough": false}, {"text": " the", "end_time": 9.24, "highlight": false, "start_time": 9.09, "strikethrough": false}, {"text": " cost", "end_time": 9.6, "highlight": false, "start_time": 9.24, "strikethrough": false}, {"text": " of", "end_time": 9.9, "highlight": false, "start_time": 9.78, "strikethrough": false}, {"text": " unemployment", "end_time": 11.4, "highlight": false, "start_time": 10.32, "strikethrough": false}, {"text": " and", "end_time": 12.45, "highlight": false, "start_time": 11.84, "strikethrough": false}, {"text": " you", "end_time": 12.63, "highlight": false, "start_time": 12.48, "strikethrough": false}, {"text": " have", "end_time": 12.81, "highlight": false, "start_time": 12.63, "strikethrough": false}, {"text": " to", "end_time": 12.9, "highlight": false, "start_time": 12.81, "strikethrough": false}, {"text": " see", "end_time": 13.14, "highlight": false, "start_time": 12.9, "strikethrough": false}, {"text": " on", "end_time": 13.96, "highlight": false, "start_time": 13.79, "strikethrough": false}, {"text": " the", "end_time": 14.52, "highlight": false, "start_time": 14.42, "strikethrough": false}, {"text": " face", "end_time": 15.41, "highlight": false, "start_time": 14.88, "strikethrough": false}, {"text": " of", "end_time": 16.08, "highlight": false, "start_time": 15.87, "strikethrough": false}, {"text": " the", "end_time": 16.11, "highlight": false, "start_time": 16.09, "strikethrough": false}, {"text": " pain", "end_time": 16.62, "highlight": false, "start_time": 16.17, "strikethrough": false}, {"text": " and", "end_time": 16.75, "highlight": false, "start_time": 16.63, "strikethrough": false}, {"text": " relevance", "end_time": 17.28, "highlight": false, "start_time": 16.76, "strikethrough": false}, {"text": " enough", "end_time": 17.58, "highlight": false, "start_time": 17.3, "strikethrough": false}, {"text": " to", "end_time": 19.64, "highlight": false, "start_time": 19.5, "strikethrough": false}, {"text": " have", "end_time": 19.8, "highlight": false, "start_time": 19.65, "strikethrough": false}, {"text": " to", "end_time": 19.89, "highlight": false, "start_time": 19.8, "strikethrough": false}, {"text": " suffer", "end_time": 20.2, "highlight": false, "start_time": 19.89, "strikethrough": false}, {"text": " the", "end_time": 20.34, "highlight": false, "start_time": 20.21, "strikethrough": false}, {"text": " most", "end_time": 21.13, "highlight": false, "start_time": 20.95, "strikethrough": false}, {"text": " with", "end_time": 21.73, "highlight": false, "start_time": 21.55, "strikethrough": false}, {"text": " the", "end_time": 22.96, "highlight": false, "start_time": 22.79, "strikethrough": false}, {"text": " pain", "end_time": 23.43, "highlight": false, "start_time": 23.01, "strikethrough": false}, {"text": " of", "end_time": 24.66, "highlight": false, "start_time": 24.57, "strikethrough": false}, {"text": " addiction.", "end_time": 25.14, "highlight": false, "start_time": 24.69, "strikethrough": false}, {"text": " It's", "end_time": 26.46, "highlight": false, "start_time": 26.07, "strikethrough": false}, {"text": " just", "end_time": 26.84, "highlight": false, "start_time": 26.67, "strikethrough": false}, {"text": " before", "end_time": 27.7, "highlight": false, "start_time": 27.45, "strikethrough": false}, {"text": " a", "end_time": 27.87, "highlight": false, "start_time": 27.78, "strikethrough": false}, {"text": " gazillion", "end_time": 28.51, "highlight": false, "start_time": 27.87, "strikethrough": false}, {"text": " dollars", "end_time": 29.44, "highlight": false, "start_time": 28.68, "strikethrough": false}, {"text": " almost", "end_time": 30.15, "highlight": false, "start_time": 29.88, "strikethrough": false}, {"text": " for", "end_time": 30.79, "highlight": false, "start_time": 30.45, "strikethrough": false}, {"text": " and", "end_time": 31.32, "highlight": false, "start_time": 31.14, "strikethrough": false}, {"text": " for", "end_time": 31.51, "highlight": false, "start_time": 31.42, "strikethrough": false}, {"text": " Zamfara", "end_time": 31.82, "highlight": false, "start_time": 31.52, "strikethrough": false}, {"text": " meeting,", "end_time": 32.19, "highlight": false, "start_time": 31.83, "strikethrough": false}, {"text": " paying", "end_time": 32.55, "highlight": false, "start_time": 32.21, "strikethrough": false}, {"text": " close", "end_time": 33.69, "highlight": false, "start_time": 32.88, "strikethrough": false}, {"text": " by,", "end_time": 34.23, "highlight": false, "start_time": 33.69, "strikethrough": false}, {"text": " dishearten.", "end_time": 34.74, "highlight": false, "start_time": 34.23, "strikethrough": false}, {"text": " The", "end_time": 34.8, "highlight": false, "start_time": 34.74, "strikethrough": false}, {"text": " consequences", "end_time": 36.38, "highlight": false, "start_time": 35.4, "strikethrough": false}, {"text": " come", "end_time": 36.66, "highlight": false, "start_time": 36.45, "strikethrough": false}, {"text": " out", "end_time": 36.74, "highlight": false, "start_time": 36.66, "strikethrough": false}, {"text": " of", "end_time": 37.59, "highlight": false, "start_time": 37.46, "strikethrough": false}, {"text": " a.", "end_time": 38.09, "highlight": false, "start_time": 37.98, "strikethrough": false}, {"text": " And", "end_time": 42.53, "highlight": false, "start_time": 41.51, "strikethrough": false}, {"text": " as", "end_time": 42.8, "highlight": false, "start_time": 42.56, "strikethrough": false}, {"text": " of", "end_time": 42.89, "highlight": false, "start_time": 42.8, "strikethrough": false}, {"text": " an", "end_time": 42.98, "highlight": false, "start_time": 42.89, "strikethrough": false}, {"text": " amount", "end_time": 43.28, "highlight": false, "start_time": 43.07, "strikethrough": false}, {"text": " on", "end_time": 43.33, "highlight": false, "start_time": 43.28, "strikethrough": false}, {"text": " a", "end_time": 43.4, "highlight": false, "start_time": 43.34, "strikethrough": false}, {"text": " website", "end_time": 43.85, "highlight": false, "start_time": 43.4, "strikethrough": false}, {"text": " and", "end_time": 43.97, "highlight": false, "start_time": 43.85, "strikethrough": false}, {"text": " unsure", "end_time": 44.64, "highlight": false, "start_time": 43.97, "strikethrough": false}, {"text": " seven", "end_time": 45.17, "highlight": false, "start_time": 44.69, "strikethrough": false}, {"text": " of", "end_time": 45.26, "highlight": false, "start_time": 45.17, "strikethrough": false}, {"text": " my", "end_time": 45.44, "highlight": false, "start_time": 45.26, "strikethrough": false}, {"text": " research", "end_time": 46.01, "highlight": false, "start_time": 45.44, "strikethrough": false}, {"text": " locked", "end_time": 46.37, "highlight": false, "start_time": 46.01, "strikethrough": false}, {"text": " up", "end_time": 46.57, "highlight": false, "start_time": 46.37, "strikethrough": false}, {"text": " on", "end_time": 46.89, "highlight": false, "start_time": 46.76, "strikethrough": false}, {"text": " some", "end_time": 47.72, "highlight": false, "start_time": 47.54, "strikethrough": false}, {"text": " kind", "end_time": 47.94, "highlight": false, "start_time": 47.72, "strikethrough": false}, {"text": " of", "end_time": 47.99, "highlight": false, "start_time": 47.96, "strikethrough": false}, {"text": " workshop", "end_time": 48.52, "highlight": false, "start_time": 48.02, "strikethrough": false}, {"text": " edition", "end_time": 49.41, "highlight": false, "start_time": 48.83, "strikethrough": false}, {"text": " is", "end_time": 49.79, "highlight": false, "start_time": 49.43, "strikethrough": false}, {"text": " over.", "end_time": 49.96, "highlight": false, "start_time": 49.82, "strikethrough": false}, {"text": " So", "end_time": 50.39, "highlight": false, "start_time": 50.1, "strikethrough": false}, {"text": " we've", "end_time": 51.05, "highlight": false, "start_time": 50.75, "strikethrough": false}, {"text": " all", "end_time": 51.23, "highlight": false, "start_time": 51.05, "strikethrough": false}, {"text": " those", "end_time": 51.41, "highlight": false, "start_time": 51.23, "strikethrough": false}, {"text": " positives", "end_time": 52.06, "highlight": false, "start_time": 51.41, "strikethrough": false}, {"text": " from", "end_time": 52.28, "highlight": false, "start_time": 52.07, "strikethrough": false}, {"text": " it", "end_time": 52.37, "highlight": false, "start_time": 52.28, "strikethrough": false}, {"text": " and", "end_time": 52.55, "highlight": false, "start_time": 52.37, "strikethrough": false}, {"text": " positive", "end_time": 53.23, "highlight": false, "start_time": 52.64, "strikethrough": false}, {"text": " emotion.", "end_time": 54.05, "highlight": false, "start_time": 53.26, "strikethrough": false}, {"text": " And,", "end_time": 54.47, "highlight": false, "start_time": 54.08, "strikethrough": false}, {"text": " yeah,", "end_time": 56.22, "highlight": false, "start_time": 55.82, "strikethrough": false}, {"text": " it's", "end_time": 56.42, "highlight": false, "start_time": 56.26, "strikethrough": false}, {"text": " all", "end_time": 57.26, "highlight": false, "start_time": 57.1, "strikethrough": false}, {"text": " we", "end_time": 58.28, "highlight": false, "start_time": 58.04, "strikethrough": false}, {"text": " can", "end_time": 58.86, "highlight": false, "start_time": 58.28, "strikethrough": false}, {"text": " get", "end_time": 59.57, "highlight": false, "start_time": 59.42, "strikethrough": false}, {"text": " to", "end_time": 60.21, "highlight": false, "start_time": 60.05, "strikethrough": false}, {"text": " the", "end_time": 60.56, "highlight": false, "start_time": 60.43, "strikethrough": false}, {"text": " end", "end_time": 60.95, "highlight": false, "start_time": 60.56, "strikethrough": false}, {"text": " zone,", "end_time": 61.75, "highlight": false, "start_time": 61.46, "strikethrough": false}, {"text": " for", "end_time": 61.94, "highlight": false, "start_time": 61.77, "strikethrough": false}, {"text": " example,", "end_time": 64.38, "highlight": false, "start_time": 63.91, "strikethrough": false}, {"text": " on", "end_time": 67.59, "highlight": false, "start_time": 67.32, "strikethrough": false}, {"text": " the", "end_time": 68.15, "highlight": false, "start_time": 67.59, "strikethrough": false}, {"text": " to", "end_time": 69.86, "highlight": false, "start_time": 69.71, "strikethrough": false}, {"text": " positive", "end_time": 71.68, "highlight": false, "start_time": 71.31, "strikethrough": false}, {"text": " is", "end_time": 72.03, "highlight": false, "start_time": 71.93, "strikethrough": false}, {"text": " through", "end_time": 72.8, "highlight": false, "start_time": 72.42, "strikethrough": false}, {"text": " transportation", "end_time": 75.74, "highlight": false, "start_time": 74.84, "strikethrough": false}, {"text": " and", "end_time": 75.86, "highlight": false, "start_time": 75.74, "strikethrough": false}, {"text": " just", "end_time": 76.1, "highlight": false, "start_time": 75.86, "strikethrough": false}, {"text": " reading", "end_time": 76.39, "highlight": false, "start_time": 76.11, "strikethrough": false}, {"text": " what", "end_time": 76.84, "highlight": false, "start_time": 76.56, "strikethrough": false}, {"text": " is", "end_time": 77.13, "highlight": false, "start_time": 77.05, "strikethrough": false}, {"text": " going", "end_time": 77.99, "highlight": false, "start_time": 77.84, "strikethrough": false}, {"text": " on,", "end_time": 78.48, "highlight": false, "start_time": 78.41, "strikethrough": false}, {"text": " on", "end_time": 79.28, "highlight": false, "start_time": 79.18, "strikethrough": false}, {"text": " the", "end_time": 79.7, "highlight": false, "start_time": 79.57, "strikethrough": false}, {"text": " ground.", "end_time": 80.38, "highlight": false, "start_time": 80.18, "strikethrough": false}, {"text": " And", "end_time": 81.35, "highlight": false, "start_time": 81.23, "strikethrough": false}, {"text": " we'll", "end_time": 82.34, "highlight": false, "start_time": 82.07, "strikethrough": false}, {"text": " see", "end_time": 83.07, "highlight": false, "start_time": 83, "strikethrough": false}, {"text": " Quad", "end_time": 83.44, "highlight": false, "start_time": 83.18, "strikethrough": false}, {"text": " Cities", "end_time": 83.75, "highlight": false, "start_time": 83.51, "strikethrough": false}, {"text": " can", "end_time": 83.92, "highlight": false, "start_time": 83.78, "strikethrough": false}, {"text": " do", "end_time": 84.02, "highlight": false, "start_time": 83.93, "strikethrough": false}, {"text": " it", "end_time": 84.1, "highlight": false, "start_time": 84.02, "strikethrough": false}, {"text": " and", "end_time": 84.2, "highlight": false, "start_time": 84.11, "strikethrough": false}, {"text": " talk", "end_time": 84.41, "highlight": false, "start_time": 84.2, "strikethrough": false}, {"text": " to", "end_time": 84.61, "highlight": false, "start_time": 84.41, "strikethrough": false}, {"text": " all", "end_time": 84.79, "highlight": false, "start_time": 84.62, "strikethrough": false}, {"text": " of", "end_time": 85.49, "highlight": false, "start_time": 85.37, "strikethrough": false}, {"text": " us.", "end_time": 85.67, "highlight": false, "start_time": 85.49, "strikethrough": false}, {"text": " And", "end_time": 85.73, "highlight": false, "start_time": 85.67, "strikethrough": false}, {"text": " then", "end_time": 85.87, "highlight": false, "start_time": 85.76, "strikethrough": false}, {"text": " I", "end_time": 86.03, "highlight": false, "start_time": 85.97, "strikethrough": false}, {"text": " guess", "end_time": 86.36, "highlight": false, "start_time": 86.17, "strikethrough": false}, {"text": " the.", "end_time": 87.77, "highlight": false, "start_time": 87.52, "strikethrough": false}, {"text": " But", "end_time": 88.64, "highlight": false, "start_time": 88.4, "strikethrough": false}, {"text": " I", "end_time": 89.11, "highlight": false, "start_time": 88.91, "strikethrough": false}, {"text": " can", "end_time": 89.45, "highlight": false, "start_time": 89.33, "strikethrough": false}, {"text": " tell.", "end_time": 89.49, "highlight": false, "start_time": 89.46, "strikethrough": false}], "speaker": "Speaker1", "end_time": 89.49, "start_time": 0.66}]	completed
73bffb55-56da-4456-92cc-4827e1eefe60	2021-07-15 12:45:16.456+00	2021-07-15 12:46:14.006845+00	JvNA70gQ	[]	completed
37401210-b0b8-4731-88fc-1a7c491bc5a1	2021-07-15 12:45:44.771+00	2021-07-15 12:48:01.426823+00	0vbbVJ7v	[]	completed
8f4359fd-db73-40f8-84b7-046d3d199569	2021-07-21 08:51:44.822+00	2021-07-21 08:52:58.229156+00	w29b8VGx	[{"words": [{"text": "Could", "end_time": 0.88, "highlight": false, "start_time": 0.68, "strikethrough": false}, {"text": " create", "end_time": 1.41, "highlight": false, "start_time": 0.96, "strikethrough": false}, {"text": " another", "end_time": 1.8, "highlight": false, "start_time": 1.41, "strikethrough": false}, {"text": " one.", "end_time": 2.14, "highlight": false, "start_time": 1.8, "strikethrough": false}, {"text": " Well,", "end_time": 3.07, "highlight": false, "start_time": 2.58, "strikethrough": false}, {"text": " what", "end_time": 3.43, "highlight": false, "start_time": 3.24, "strikethrough": false}, {"text": " do", "end_time": 3.47, "highlight": false, "start_time": 3.43, "strikethrough": false}, {"text": " you", "end_time": 3.54, "highlight": false, "start_time": 3.48, "strikethrough": false}, {"text": " do", "end_time": 3.71, "highlight": false, "start_time": 3.54, "strikethrough": false}, {"text": " in", "end_time": 3.9, "highlight": false, "start_time": 3.72, "strikethrough": false}, {"text": " the", "end_time": 4.02, "highlight": false, "start_time": 3.9, "strikethrough": false}, {"text": " space?", "end_time": 4.36, "highlight": false, "start_time": 4.04, "strikethrough": false}, {"text": " So", "end_time": 5.82, "highlight": false, "start_time": 5.61, "strikethrough": false}, {"text": " it's", "end_time": 5.97, "highlight": false, "start_time": 5.82, "strikethrough": false}, {"text": " basically", "end_time": 6.42, "highlight": false, "start_time": 5.97, "strikethrough": false}, {"text": " this", "end_time": 6.9, "highlight": false, "start_time": 6.42, "strikethrough": false}, {"text": " overarching", "end_time": 9.48, "highlight": false, "start_time": 8.37, "strikethrough": false}, {"text": " structure.", "end_time": 10.86, "highlight": false, "start_time": 10.05, "strikethrough": false}], "speaker": "Speaker1", "end_time": 10.86, "start_time": 0.68}]	completed
787063da-76bc-4294-941d-7ed6775681a5	2021-07-22 17:38:11.173+00	2021-07-22 17:40:03.645135+00	j2eZE7gx	[{"words": [{"text": "Hey,", "end_time": 1.01, "highlight": false, "start_time": 0.68, "strikethrough": false}, {"text": " Julia,", "end_time": 1.46, "highlight": false, "start_time": 1.01, "strikethrough": false}, {"text": " how", "end_time": 1.61, "highlight": false, "start_time": 1.46, "strikethrough": false}, {"text": " are", "end_time": 1.82, "highlight": false, "start_time": 1.61, "strikethrough": false}, {"text": " you?", "end_time": 2.09, "highlight": false, "start_time": 1.82, "strikethrough": false}, {"text": " This", "end_time": 2.39, "highlight": false, "start_time": 2.15, "strikethrough": false}, {"text": " is", "end_time": 2.54, "highlight": false, "start_time": 2.39, "strikethrough": false}, {"text": " like", "end_time": 2.69, "highlight": false, "start_time": 2.54, "strikethrough": false}, {"text": " a", "end_time": 2.78, "highlight": false, "start_time": 2.69, "strikethrough": false}, {"text": " quick", "end_time": 3.02, "highlight": false, "start_time": 2.78, "strikethrough": false}, {"text": " test", "end_time": 3.41, "highlight": false, "start_time": 3.02, "strikethrough": false}, {"text": " regarding", "end_time": 3.83, "highlight": false, "start_time": 3.41, "strikethrough": false}, {"text": " our", "end_time": 3.98, "highlight": false, "start_time": 3.83, "strikethrough": false}, {"text": " Bible", "end_time": 4.33, "highlight": false, "start_time": 3.98, "strikethrough": false}, {"text": " research.", "end_time": 4.98, "highlight": false, "start_time": 4.34, "strikethrough": false}, {"text": " Let", "end_time": 5.66, "highlight": false, "start_time": 5.45, "strikethrough": false}, {"text": " me", "end_time": 5.75, "highlight": false, "start_time": 5.66, "strikethrough": false}, {"text": " know", "end_time": 5.87, "highlight": false, "start_time": 5.75, "strikethrough": false}, {"text": " if", "end_time": 5.99, "highlight": false, "start_time": 5.87, "strikethrough": false}, {"text": " you", "end_time": 6.05, "highlight": false, "start_time": 5.99, "strikethrough": false}, {"text": " have", "end_time": 6.2, "highlight": false, "start_time": 6.05, "strikethrough": false}, {"text": " any", "end_time": 6.41, "highlight": false, "start_time": 6.2, "strikethrough": false}, {"text": " questions.", "end_time": 7.19, "highlight": false, "start_time": 6.41, "strikethrough": false}, {"text": " I'm", "end_time": 8, "highlight": false, "start_time": 7.56, "strikethrough": false}, {"text": " just", "end_time": 8.18, "highlight": false, "start_time": 8, "strikethrough": false}, {"text": " going", "end_time": 8.33, "highlight": false, "start_time": 8.18, "strikethrough": false}, {"text": " to", "end_time": 8.39, "highlight": false, "start_time": 8.33, "strikethrough": false}, {"text": " adapt", "end_time": 8.81, "highlight": false, "start_time": 8.39, "strikethrough": false}, {"text": " our", "end_time": 9.02, "highlight": false, "start_time": 8.81, "strikethrough": false}, {"text": " due", "end_time": 9.29, "highlight": false, "start_time": 9.02, "strikethrough": false}, {"text": " date", "end_time": 9.68, "highlight": false, "start_time": 9.29, "strikethrough": false}, {"text": " so", "end_time": 9.92, "highlight": false, "start_time": 9.68, "strikethrough": false}, {"text": " we", "end_time": 10.01, "highlight": false, "start_time": 9.92, "strikethrough": false}, {"text": " can", "end_time": 10.4, "highlight": false, "start_time": 10.01, "strikethrough": false}, {"text": " really", "end_time": 11, "highlight": false, "start_time": 10.7, "strikethrough": false}, {"text": " try", "end_time": 11.27, "highlight": false, "start_time": 11, "strikethrough": false}, {"text": " to", "end_time": 11.42, "highlight": false, "start_time": 11.27, "strikethrough": false}, {"text": " manage", "end_time": 11.96, "highlight": false, "start_time": 11.42, "strikethrough": false}, {"text": " this", "end_time": 12.56, "highlight": false, "start_time": 11.96, "strikethrough": false}, {"text": " task", "end_time": 13.46, "highlight": false, "start_time": 12.89, "strikethrough": false}, {"text": " completely", "end_time": 13.97, "highlight": false, "start_time": 13.46, "strikethrough": false}, {"text": " asynchronously.", "end_time": 14.83, "highlight": false, "start_time": 13.97, "strikethrough": false}, {"text": " And", "end_time": 15.8, "highlight": false, "start_time": 15.41, "strikethrough": false}, {"text": " let", "end_time": 15.92, "highlight": false, "start_time": 15.8, "strikethrough": false}, {"text": " me", "end_time": 16.01, "highlight": false, "start_time": 15.92, "strikethrough": false}, {"text": " know", "end_time": 16.16, "highlight": false, "start_time": 16.01, "strikethrough": false}, {"text": " if", "end_time": 16.25, "highlight": false, "start_time": 16.16, "strikethrough": false}, {"text": " you", "end_time": 16.34, "highlight": false, "start_time": 16.25, "strikethrough": false}, {"text": " have", "end_time": 16.46, "highlight": false, "start_time": 16.34, "strikethrough": false}, {"text": " any", "end_time": 16.61, "highlight": false, "start_time": 16.46, "strikethrough": false}, {"text": " questions", "end_time": 17.24, "highlight": false, "start_time": 16.61, "strikethrough": false}, {"text": " or", "end_time": 17.87, "highlight": false, "start_time": 17.27, "strikethrough": false}, {"text": " further", "end_time": 18.71, "highlight": false, "start_time": 18.2, "strikethrough": false}, {"text": " ideas", "end_time": 19.22, "highlight": false, "start_time": 18.71, "strikethrough": false}, {"text": " in", "end_time": 19.31, "highlight": false, "start_time": 19.22, "strikethrough": false}, {"text": " mind", "end_time": 19.61, "highlight": false, "start_time": 19.31, "strikethrough": false}, {"text": " to", "end_time": 19.79, "highlight": false, "start_time": 19.61, "strikethrough": false}, {"text": " add", "end_time": 19.97, "highlight": false, "start_time": 19.79, "strikethrough": false}, {"text": " to", "end_time": 20.15, "highlight": false, "start_time": 19.97, "strikethrough": false}, {"text": " our", "end_time": 20.36, "highlight": false, "start_time": 20.15, "strikethrough": false}, {"text": " research", "end_time": 20.78, "highlight": false, "start_time": 20.36, "strikethrough": false}, {"text": " topic.", "end_time": 21.32, "highlight": false, "start_time": 20.78, "strikethrough": false}, {"text": " I", "end_time": 21.83, "highlight": false, "start_time": 21.65, "strikethrough": false}, {"text": " would", "end_time": 21.98, "highlight": false, "start_time": 21.83, "strikethrough": false}, {"text": " also", "end_time": 22.31, "highlight": false, "start_time": 21.98, "strikethrough": false}, {"text": " add", "end_time": 22.46, "highlight": false, "start_time": 22.31, "strikethrough": false}, {"text": " a", "end_time": 22.52, "highlight": false, "start_time": 22.46, "strikethrough": false}, {"text": " few", "end_time": 22.7, "highlight": false, "start_time": 22.52, "strikethrough": false}, {"text": " more", "end_time": 22.88, "highlight": false, "start_time": 22.7, "strikethrough": false}, {"text": " points", "end_time": 23.21, "highlight": false, "start_time": 22.88, "strikethrough": false}, {"text": " to", "end_time": 23.33, "highlight": false, "start_time": 23.21, "strikethrough": false}, {"text": " our", "end_time": 23.72, "highlight": false, "start_time": 23.33, "strikethrough": false}, {"text": " agenda,", "end_time": 24.64, "highlight": false, "start_time": 24.14, "strikethrough": false}, {"text": " so", "end_time": 24.85, "highlight": false, "start_time": 24.65, "strikethrough": false}, {"text": " to", "end_time": 24.98, "highlight": false, "start_time": 24.86, "strikethrough": false}, {"text": " say,", "end_time": 25.4, "highlight": false, "start_time": 24.98, "strikethrough": false}, {"text": " to", "end_time": 25.82, "highlight": false, "start_time": 25.67, "strikethrough": false}, {"text": " kind", "end_time": 26.03, "highlight": false, "start_time": 25.82, "strikethrough": false}, {"text": " of", "end_time": 26.12, "highlight": false, "start_time": 26.03, "strikethrough": false}, {"text": " split", "end_time": 26.51, "highlight": false, "start_time": 26.12, "strikethrough": false}, {"text": " up", "end_time": 27.02, "highlight": false, "start_time": 26.51, "strikethrough": false}, {"text": " the", "end_time": 27.62, "highlight": false, "start_time": 27.44, "strikethrough": false}, {"text": " research", "end_time": 27.98, "highlight": false, "start_time": 27.62, "strikethrough": false}, {"text": " that", "end_time": 28.1, "highlight": false, "start_time": 27.98, "strikethrough": false}, {"text": " we're", "end_time": 28.22, "highlight": false, "start_time": 28.1, "strikethrough": false}, {"text": " doing", "end_time": 28.7, "highlight": false, "start_time": 28.22, "strikethrough": false}, {"text": " based", "end_time": 29.36, "highlight": false, "start_time": 28.97, "strikethrough": false}, {"text": " on", "end_time": 29.53, "highlight": false, "start_time": 29.36, "strikethrough": false}, {"text": " probably", "end_time": 30.32, "highlight": false, "start_time": 29.84, "strikethrough": false}, {"text": " also", "end_time": 30.56, "highlight": false, "start_time": 30.32, "strikethrough": false}, {"text": " kind", "end_time": 30.71, "highlight": false, "start_time": 30.56, "strikethrough": false}, {"text": " of", "end_time": 30.77, "highlight": false, "start_time": 30.71, "strikethrough": false}, {"text": " the", "end_time": 30.86, "highlight": false, "start_time": 30.8, "strikethrough": false}, {"text": " notion", "end_time": 31.28, "highlight": false, "start_time": 30.86, "strikethrough": false}, {"text": " pages", "end_time": 31.76, "highlight": false, "start_time": 31.28, "strikethrough": false}, {"text": " we", "end_time": 31.85, "highlight": false, "start_time": 31.76, "strikethrough": false}, {"text": " could", "end_time": 32.03, "highlight": false, "start_time": 31.85, "strikethrough": false}, {"text": " create", "end_time": 32.45, "highlight": false, "start_time": 32.03, "strikethrough": false}, {"text": " for", "end_time": 32.63, "highlight": false, "start_time": 32.45, "strikethrough": false}, {"text": " this.", "end_time": 33.05, "highlight": false, "start_time": 32.63, "strikethrough": false}, {"text": " Thank", "end_time": 35, "highlight": false, "start_time": 34.61, "strikethrough": false}, {"text": " you.", "end_time": 35.36, "highlight": false, "start_time": 35, "strikethrough": false}], "speaker": "Speaker1", "end_time": 35.36, "start_time": 0.68}]	completed
5125ddc4-3b3a-4d3f-a80a-e723c0bbbb42	2021-07-22 17:40:37.717+00	2021-07-22 17:40:37.717+00	8vXk83eQ	\N	preparing
4979f397-d7dc-4101-99dc-c73f1599e62e	2021-07-22 17:41:35.203+00	2021-07-22 17:43:02.828761+00	A2z7PNpx	[{"words": [{"text": "Quickly", "end_time": 1, "highlight": false, "start_time": 0.71, "strikethrough": false}, {"text": " doing", "end_time": 1.29, "highlight": false, "start_time": 1.03, "strikethrough": false}, {"text": " a", "end_time": 1.38, "highlight": false, "start_time": 1.29, "strikethrough": false}, {"text": " test.", "end_time": 2.02, "highlight": false, "start_time": 1.38, "strikethrough": false}, {"text": " Thank", "end_time": 2.37, "highlight": false, "start_time": 2.04, "strikethrough": false}, {"text": " you", "end_time": 2.43, "highlight": false, "start_time": 2.37, "strikethrough": false}, {"text": " so", "end_time": 2.55, "highlight": false, "start_time": 2.43, "strikethrough": false}, {"text": " much.", "end_time": 2.91, "highlight": false, "start_time": 2.55, "strikethrough": false}], "speaker": "Speaker1", "end_time": 2.91, "start_time": 0.71}]	completed
d3582adc-3ee5-4736-a641-e114fe9a7b0e	2021-07-23 07:19:17.73+00	2021-07-23 07:21:15.691225+00	R2Oe43YQ	[{"words": [{"text": "Is,", "end_time": 1.18, "highlight": false, "start_time": 1.04, "strikethrough": false}, {"text": " first", "end_time": 3.66, "highlight": false, "start_time": 3.27, "strikethrough": false}, {"text": " of", "end_time": 3.78, "highlight": false, "start_time": 3.66, "strikethrough": false}, {"text": " all,", "end_time": 3.91, "highlight": false, "start_time": 3.78, "strikethrough": false}, {"text": " crew", "end_time": 4.17, "highlight": false, "start_time": 3.95, "strikethrough": false}, {"text": " that", "end_time": 4.35, "highlight": false, "start_time": 4.2, "strikethrough": false}, {"text": " we're", "end_time": 4.47, "highlight": false, "start_time": 4.35, "strikethrough": false}, {"text": " using", "end_time": 4.83, "highlight": false, "start_time": 4.47, "strikethrough": false}, {"text": " the", "end_time": 4.92, "highlight": false, "start_time": 4.83, "strikethrough": false}, {"text": " tool.", "end_time": 5.37, "highlight": false, "start_time": 4.92, "strikethrough": false}, {"text": " Second", "end_time": 6.63, "highlight": false, "start_time": 6.12, "strikethrough": false}, {"text": " of", "end_time": 6.75, "highlight": false, "start_time": 6.63, "strikethrough": false}, {"text": " all,", "end_time": 6.99, "highlight": false, "start_time": 6.75, "strikethrough": false}, {"text": " I'm", "end_time": 7.2, "highlight": false, "start_time": 7.02, "strikethrough": false}, {"text": " not", "end_time": 7.38, "highlight": false, "start_time": 7.2, "strikethrough": false}, {"text": " quite", "end_time": 7.62, "highlight": false, "start_time": 7.38, "strikethrough": false}, {"text": " getting", "end_time": 7.92, "highlight": false, "start_time": 7.62, "strikethrough": false}, {"text": " who's", "end_time": 8.13, "highlight": false, "start_time": 7.92, "strikethrough": false}, {"text": " actually", "end_time": 8.47, "highlight": false, "start_time": 8.14, "strikethrough": false}, {"text": " in", "end_time": 8.67, "highlight": false, "start_time": 8.57, "strikethrough": false}, {"text": " this", "end_time": 8.88, "highlight": false, "start_time": 8.67, "strikethrough": false}, {"text": " room", "end_time": 9.03, "highlight": false, "start_time": 8.88, "strikethrough": false}, {"text": " if", "end_time": 9.18, "highlight": false, "start_time": 9.03, "strikethrough": false}, {"text": " it's", "end_time": 9.33, "highlight": false, "start_time": 9.18, "strikethrough": false}, {"text": " just", "end_time": 9.57, "highlight": false, "start_time": 9.33, "strikethrough": false}, {"text": " the", "end_time": 9.63, "highlight": false, "start_time": 9.57, "strikethrough": false}, {"text": " two", "end_time": 9.84, "highlight": false, "start_time": 9.63, "strikethrough": false}, {"text": " of", "end_time": 9.96, "highlight": false, "start_time": 9.84, "strikethrough": false}, {"text": " us", "end_time": 10.11, "highlight": false, "start_time": 9.96, "strikethrough": false}, {"text": " or", "end_time": 10.26, "highlight": false, "start_time": 10.11, "strikethrough": false}, {"text": " if", "end_time": 10.35, "highlight": false, "start_time": 10.26, "strikethrough": false}, {"text": " there's", "end_time": 10.59, "highlight": false, "start_time": 10.35, "strikethrough": false}, {"text": " anyone", "end_time": 10.86, "highlight": false, "start_time": 10.59, "strikethrough": false}, {"text": " else.", "end_time": 11.15, "highlight": false, "start_time": 10.86, "strikethrough": false}, {"text": " Just", "end_time": 11.38, "highlight": false, "start_time": 11.24, "strikethrough": false}, {"text": " because", "end_time": 11.64, "highlight": false, "start_time": 11.4, "strikethrough": false}, {"text": " you're", "end_time": 11.79, "highlight": false, "start_time": 11.64, "strikethrough": false}, {"text": " speaking", "end_time": 12.17, "highlight": false, "start_time": 11.79, "strikethrough": false}, {"text": " English.", "end_time": 12.56, "highlight": false, "start_time": 12.18, "strikethrough": false}, {"text": " But", "end_time": 13.71, "highlight": false, "start_time": 13.38, "strikethrough": false}, {"text": " yeah,", "end_time": 14.04, "highlight": false, "start_time": 13.74, "strikethrough": false}, {"text": " I", "end_time": 14.16, "highlight": false, "start_time": 14.04, "strikethrough": false}, {"text": " mean,", "end_time": 14.46, "highlight": false, "start_time": 14.16, "strikethrough": false}, {"text": " yeah,", "end_time": 15.27, "highlight": false, "start_time": 14.94, "strikethrough": false}, {"text": " it", "end_time": 15.39, "highlight": false, "start_time": 15.27, "strikethrough": false}, {"text": " looks", "end_time": 15.6, "highlight": false, "start_time": 15.39, "strikethrough": false}, {"text": " like", "end_time": 15.78, "highlight": false, "start_time": 15.6, "strikethrough": false}, {"text": " everyone's", "end_time": 16.2, "highlight": false, "start_time": 15.78, "strikethrough": false}, {"text": " basically", "end_time": 16.62, "highlight": false, "start_time": 16.2, "strikethrough": false}, {"text": " going", "end_time": 16.8, "highlight": false, "start_time": 16.62, "strikethrough": false}, {"text": " in", "end_time": 16.92, "highlight": false, "start_time": 16.8, "strikethrough": false}, {"text": " August.", "end_time": 17.25, "highlight": false, "start_time": 16.92, "strikethrough": false}, {"text": " I", "end_time": 17.34, "highlight": false, "start_time": 17.25, "strikethrough": false}, {"text": " know", "end_time": 17.49, "highlight": false, "start_time": 17.34, "strikethrough": false}, {"text": " they're", "end_time": 17.61, "highlight": false, "start_time": 17.49, "strikethrough": false}, {"text": " probably", "end_time": 17.94, "highlight": false, "start_time": 17.61, "strikethrough": false}, {"text": " still", "end_time": 18.21, "highlight": false, "start_time": 17.94, "strikethrough": false}, {"text": " there", "end_time": 18.39, "highlight": false, "start_time": 18.21, "strikethrough": false}, {"text": " for", "end_time": 18.6, "highlight": false, "start_time": 18.39, "strikethrough": false}, {"text": " the", "end_time": 18.72, "highlight": false, "start_time": 18.6, "strikethrough": false}, {"text": " first", "end_time": 19.02, "highlight": false, "start_time": 18.72, "strikethrough": false}, {"text": " week", "end_time": 19.26, "highlight": false, "start_time": 19.02, "strikethrough": false}, {"text": " of", "end_time": 19.38, "highlight": false, "start_time": 19.26, "strikethrough": false}, {"text": " August,", "end_time": 19.68, "highlight": false, "start_time": 19.38, "strikethrough": false}, {"text": " which", "end_time": 19.86, "highlight": false, "start_time": 19.68, "strikethrough": false}, {"text": " is", "end_time": 19.95, "highlight": false, "start_time": 19.86, "strikethrough": false}, {"text": " nice.", "end_time": 20.4, "highlight": false, "start_time": 19.95, "strikethrough": false}, {"text": " And", "end_time": 20.64, "highlight": false, "start_time": 20.4, "strikethrough": false}, {"text": " then", "end_time": 21.12, "highlight": false, "start_time": 20.64, "strikethrough": false}, {"text": " I'm", "end_time": 21.45, "highlight": false, "start_time": 21.15, "strikethrough": false}, {"text": " not", "end_time": 21.75, "highlight": false, "start_time": 21.45, "strikethrough": false}, {"text": " sure", "end_time": 22.32, "highlight": false, "start_time": 21.75, "strikethrough": false}, {"text": " yet", "end_time": 23.12, "highlight": false, "start_time": 22.96, "strikethrough": false}, {"text": " how", "end_time": 23.51, "highlight": false, "start_time": 23.4, "strikethrough": false}, {"text": " I'm", "end_time": 23.64, "highlight": false, "start_time": 23.52, "strikethrough": false}, {"text": " actually", "end_time": 23.88, "highlight": false, "start_time": 23.64, "strikethrough": false}, {"text": " going", "end_time": 24, "highlight": false, "start_time": 23.88, "strikethrough": false}, {"text": " to", "end_time": 24.09, "highlight": false, "start_time": 24, "strikethrough": false}, {"text": " go", "end_time": 24.21, "highlight": false, "start_time": 24.09, "strikethrough": false}, {"text": " over", "end_time": 24.42, "highlight": false, "start_time": 24.21, "strikethrough": false}, {"text": " this", "end_time": 24.69, "highlight": false, "start_time": 24.42, "strikethrough": false}, {"text": " much", "end_time": 24.9, "highlight": false, "start_time": 24.69, "strikethrough": false}, {"text": " discussed", "end_time": 25.23, "highlight": false, "start_time": 24.9, "strikethrough": false}, {"text": " with", "end_time": 25.35, "highlight": false, "start_time": 25.23, "strikethrough": false}, {"text": " Polly", "end_time": 25.77, "highlight": false, "start_time": 25.36, "strikethrough": false}, {"text": " and", "end_time": 28.85, "highlight": false, "start_time": 27.96, "strikethrough": false}, {"text": " yeah.", "end_time": 29.11, "highlight": false, "start_time": 28.86, "strikethrough": false}, {"text": " So", "end_time": 29.46, "highlight": false, "start_time": 29.19, "strikethrough": false}, {"text": " farewell", "end_time": 29.91, "highlight": false, "start_time": 29.46, "strikethrough": false}, {"text": " wise,", "end_time": 30.13, "highlight": false, "start_time": 29.91, "strikethrough": false}, {"text": " that", "end_time": 30.21, "highlight": false, "start_time": 30.13, "strikethrough": false}, {"text": " will", "end_time": 30.33, "highlight": false, "start_time": 30.21, "strikethrough": false}, {"text": " probably", "end_time": 30.66, "highlight": false, "start_time": 30.33, "strikethrough": false}, {"text": " just", "end_time": 30.84, "highlight": false, "start_time": 30.66, "strikethrough": false}, {"text": " be", "end_time": 30.99, "highlight": false, "start_time": 30.84, "strikethrough": false}, {"text": " like", "end_time": 31.17, "highlight": false, "start_time": 30.99, "strikethrough": false}, {"text": " kind", "end_time": 31.32, "highlight": false, "start_time": 31.18, "strikethrough": false}, {"text": " of", "end_time": 31.44, "highlight": false, "start_time": 31.32, "strikethrough": false}, {"text": " next", "end_time": 31.68, "highlight": false, "start_time": 31.44, "strikethrough": false}, {"text": " week.", "end_time": 32.03, "highlight": false, "start_time": 31.68, "strikethrough": false}, {"text": " But", "end_time": 32.88, "highlight": false, "start_time": 32.52, "strikethrough": false}, {"text": " I", "end_time": 32.97, "highlight": false, "start_time": 32.88, "strikethrough": false}, {"text": " mean,", "end_time": 33.15, "highlight": false, "start_time": 32.97, "strikethrough": false}, {"text": " we", "end_time": 33.27, "highlight": false, "start_time": 33.15, "strikethrough": false}, {"text": " already", "end_time": 33.48, "highlight": false, "start_time": 33.27, "strikethrough": false}, {"text": " have", "end_time": 33.6, "highlight": false, "start_time": 33.48, "strikethrough": false}, {"text": " the", "end_time": 33.69, "highlight": false, "start_time": 33.6, "strikethrough": false}, {"text": " team", "end_time": 33.9, "highlight": false, "start_time": 33.69, "strikethrough": false}, {"text": " today", "end_time": 34.11, "highlight": false, "start_time": 33.9, "strikethrough": false}, {"text": " scheduled", "end_time": 34.59, "highlight": false, "start_time": 34.11, "strikethrough": false}, {"text": " on", "end_time": 34.77, "highlight": false, "start_time": 34.59, "strikethrough": false}, {"text": " Monday,", "end_time": 35.16, "highlight": false, "start_time": 34.77, "strikethrough": false}, {"text": " which", "end_time": 35.34, "highlight": false, "start_time": 35.16, "strikethrough": false}, {"text": " is", "end_time": 35.46, "highlight": false, "start_time": 35.34, "strikethrough": false}, {"text": " kind", "end_time": 35.64, "highlight": false, "start_time": 35.46, "strikethrough": false}, {"text": " of", "end_time": 35.76, "highlight": false, "start_time": 35.64, "strikethrough": false}, {"text": " basically", "end_time": 36.15, "highlight": false, "start_time": 35.76, "strikethrough": false}, {"text": " my", "end_time": 36.54, "highlight": false, "start_time": 36.36, "strikethrough": false}, {"text": " farewell", "end_time": 37.05, "highlight": false, "start_time": 36.54, "strikethrough": false}, {"text": " and", "end_time": 37.38, "highlight": false, "start_time": 37.05, "strikethrough": false}, {"text": " and", "end_time": 38.67, "highlight": false, "start_time": 38.13, "strikethrough": false}, {"text": " welcome", "end_time": 39.3, "highlight": false, "start_time": 38.85, "strikethrough": false}, {"text": " dinner", "end_time": 39.57, "highlight": false, "start_time": 39.3, "strikethrough": false}, {"text": " at", "end_time": 39.66, "highlight": false, "start_time": 39.57, "strikethrough": false}, {"text": " the", "end_time": 39.72, "highlight": false, "start_time": 39.66, "strikethrough": false}, {"text": " same", "end_time": 39.96, "highlight": false, "start_time": 39.72, "strikethrough": false}, {"text": " time.", "end_time": 40.38, "highlight": false, "start_time": 39.96, "strikethrough": false}, {"text": " But", "end_time": 42.98, "highlight": false, "start_time": 42.41, "strikethrough": false}, {"text": " not", "end_time": 43.52, "highlight": false, "start_time": 43.28, "strikethrough": false}, {"text": " sure", "end_time": 43.79, "highlight": false, "start_time": 43.52, "strikethrough": false}, {"text": " if", "end_time": 43.88, "highlight": false, "start_time": 43.79, "strikethrough": false}, {"text": " I", "end_time": 44, "highlight": false, "start_time": 43.88, "strikethrough": false}, {"text": " will", "end_time": 44.15, "highlight": false, "start_time": 44, "strikethrough": false}, {"text": " be", "end_time": 44.33, "highlight": false, "start_time": 44.15, "strikethrough": false}, {"text": " in", "end_time": 44.48, "highlight": false, "start_time": 44.33, "strikethrough": false}, {"text": " Berlin", "end_time": 44.9, "highlight": false, "start_time": 44.48, "strikethrough": false}, {"text": " in", "end_time": 45.08, "highlight": false, "start_time": 44.9, "strikethrough": false}, {"text": " September", "end_time": 45.5, "highlight": false, "start_time": 45.08, "strikethrough": false}, {"text": " again.", "end_time": 45.87, "highlight": false, "start_time": 45.5, "strikethrough": false}, {"text": " Who", "end_time": 46.07, "highlight": false, "start_time": 45.89, "strikethrough": false}, {"text": " knows?", "end_time": 46.49, "highlight": false, "start_time": 46.07, "strikethrough": false}, {"text": " But", "end_time": 47.06, "highlight": false, "start_time": 46.79, "strikethrough": false}, {"text": " yeah,", "end_time": 47.63, "highlight": false, "start_time": 47.29, "strikethrough": false}, {"text": " it's", "end_time": 48.98, "highlight": false, "start_time": 48.83, "strikethrough": false}, {"text": " kind", "end_time": 49.19, "highlight": false, "start_time": 48.98, "strikethrough": false}, {"text": " of", "end_time": 49.28, "highlight": false, "start_time": 49.19, "strikethrough": false}, {"text": " coming", "end_time": 49.55, "highlight": false, "start_time": 49.28, "strikethrough": false}, {"text": " to", "end_time": 49.7, "highlight": false, "start_time": 49.55, "strikethrough": false}, {"text": " an", "end_time": 49.79, "highlight": false, "start_time": 49.7, "strikethrough": false}, {"text": " end.", "end_time": 49.97, "highlight": false, "start_time": 49.79, "strikethrough": false}, {"text": " That's", "end_time": 50.21, "highlight": false, "start_time": 50, "strikethrough": false}, {"text": " true.", "end_time": 50.56, "highlight": false, "start_time": 50.21, "strikethrough": false}, {"text": " But", "end_time": 51.41, "highlight": false, "start_time": 51.17, "strikethrough": false}, {"text": " yeah,", "end_time": 51.59, "highlight": false, "start_time": 51.41, "strikethrough": false}, {"text": " I", "end_time": 51.71, "highlight": false, "start_time": 51.59, "strikethrough": false}, {"text": " mean,", "end_time": 51.92, "highlight": false, "start_time": 51.71, "strikethrough": false}, {"text": " it", "end_time": 52.22, "highlight": false, "start_time": 52.07, "strikethrough": false}, {"text": " will", "end_time": 52.31, "highlight": false, "start_time": 52.22, "strikethrough": false}, {"text": " kind", "end_time": 52.49, "highlight": false, "start_time": 52.31, "strikethrough": false}, {"text": " of", "end_time": 52.58, "highlight": false, "start_time": 52.49, "strikethrough": false}, {"text": " be", "end_time": 52.67, "highlight": false, "start_time": 52.58, "strikethrough": false}, {"text": " next", "end_time": 52.91, "highlight": false, "start_time": 52.67, "strikethrough": false}, {"text": " week.", "end_time": 53.18, "highlight": false, "start_time": 52.91, "strikethrough": false}, {"text": " We", "end_time": 53.3, "highlight": false, "start_time": 53.18, "strikethrough": false}, {"text": " can", "end_time": 53.45, "highlight": false, "start_time": 53.3, "strikethrough": false}, {"text": " see", "end_time": 53.81, "highlight": false, "start_time": 53.45, "strikethrough": false}, {"text": " I", "end_time": 54.23, "highlight": false, "start_time": 54.02, "strikethrough": false}, {"text": " don't", "end_time": 54.38, "highlight": false, "start_time": 54.23, "strikethrough": false}, {"text": " know,", "end_time": 54.61, "highlight": false, "start_time": 54.38, "strikethrough": false}, {"text": " maybe", "end_time": 55.01, "highlight": false, "start_time": 54.83, "strikethrough": false}, {"text": " we", "end_time": 55.13, "highlight": false, "start_time": 55.01, "strikethrough": false}, {"text": " can", "end_time": 55.25, "highlight": false, "start_time": 55.13, "strikethrough": false}, {"text": " do", "end_time": 55.54, "highlight": false, "start_time": 55.25, "strikethrough": false}, {"text": " another", "end_time": 55.85, "highlight": false, "start_time": 55.55, "strikethrough": false}, {"text": " team", "end_time": 56.09, "highlight": false, "start_time": 55.85, "strikethrough": false}, {"text": " lunch", "end_time": 56.39, "highlight": false, "start_time": 56.09, "strikethrough": false}, {"text": " towards", "end_time": 56.69, "highlight": false, "start_time": 56.39, "strikethrough": false}, {"text": " the", "end_time": 56.81, "highlight": false, "start_time": 56.69, "strikethrough": false}, {"text": " end", "end_time": 56.9, "highlight": false, "start_time": 56.81, "strikethrough": false}, {"text": " of", "end_time": 56.99, "highlight": false, "start_time": 56.9, "strikethrough": false}, {"text": " the", "end_time": 57.08, "highlight": false, "start_time": 56.99, "strikethrough": false}, {"text": " week", "end_time": 57.29, "highlight": false, "start_time": 57.08, "strikethrough": false}, {"text": " or", "end_time": 57.35, "highlight": false, "start_time": 57.29, "strikethrough": false}, {"text": " something,", "end_time": 57.83, "highlight": false, "start_time": 57.35, "strikethrough": false}, {"text": " but", "end_time": 58.58, "highlight": false, "start_time": 58.34, "strikethrough": false}, {"text": " yeah,", "end_time": 58.72, "highlight": false, "start_time": 58.58, "strikethrough": false}, {"text": " something", "end_time": 59.09, "highlight": false, "start_time": 58.76, "strikethrough": false}, {"text": " like", "end_time": 59.21, "highlight": false, "start_time": 59.09, "strikethrough": false}, {"text": " that.", "end_time": 59.47, "highlight": false, "start_time": 59.21, "strikethrough": false}], "speaker": "Speaker1", "end_time": 59.47, "start_time": 1.04}]	completed
6f8ca9ab-0e1f-424e-90a4-4964a2d024f2	2021-07-23 10:41:44.145+00	2021-07-23 10:41:44.145+00	o2d9Lrwx	\N	preparing
204e3b3c-292c-4a50-9d41-f630b48cba3a	2021-07-23 10:40:47.614+00	2021-07-23 10:41:58.503199+00	JvP3wkrQ	[{"words": [{"text": "And", "end_time": 0.99, "highlight": false, "start_time": 0.63, "strikethrough": false}, {"text": " the", "end_time": 1.11, "highlight": false, "start_time": 0.99, "strikethrough": false}, {"text": " reason", "end_time": 1.55, "highlight": false, "start_time": 1.2, "strikethrough": false}, {"text": " is", "end_time": 1.91, "highlight": false, "start_time": 1.74, "strikethrough": false}, {"text": " testing,", "end_time": 2.31, "highlight": false, "start_time": 1.92, "strikethrough": false}, {"text": " testing", "end_time": 2.69, "highlight": false, "start_time": 2.31, "strikethrough": false}, {"text": " the", "end_time": 2.79, "highlight": false, "start_time": 2.7, "strikethrough": false}, {"text": " the", "end_time": 3.2, "highlight": false, "start_time": 3.02, "strikethrough": false}, {"text": " three.", "end_time": 3.78, "highlight": false, "start_time": 3.21, "strikethrough": false}], "speaker": "Speaker1", "end_time": 3.78, "start_time": 0.63}]	completed
16c1b7a3-7352-42b3-b7f4-fe4ccda14941	2021-07-26 13:40:55.348+00	2021-07-26 13:42:37.142887+00	JvP3XRMQ	[{"words": [{"text": "So", "end_time": 3.33, "highlight": false, "start_time": 3.12, "strikethrough": false}, {"text": " it", "end_time": 3.51, "highlight": false, "start_time": 3.48, "strikethrough": false}, {"text": " is", "end_time": 3.63, "highlight": false, "start_time": 3.54, "strikethrough": false}, {"text": " interesting.", "end_time": 4.23, "highlight": false, "start_time": 3.63, "strikethrough": false}, {"text": " It's", "end_time": 7.44, "highlight": false, "start_time": 7.2, "strikethrough": false}, {"text": " super", "end_time": 7.77, "highlight": false, "start_time": 7.44, "strikethrough": false}, {"text": " weird", "end_time": 8.07, "highlight": false, "start_time": 7.77, "strikethrough": false}, {"text": " that", "end_time": 8.19, "highlight": false, "start_time": 8.07, "strikethrough": false}, {"text": " this", "end_time": 8.4, "highlight": false, "start_time": 8.19, "strikethrough": false}, {"text": " is", "end_time": 8.54, "highlight": false, "start_time": 8.4, "strikethrough": false}, {"text": " in", "end_time": 8.67, "highlight": false, "start_time": 8.55, "strikethrough": false}, {"text": " the", "end_time": 8.76, "highlight": false, "start_time": 8.67, "strikethrough": false}, {"text": " bottom", "end_time": 9.09, "highlight": false, "start_time": 8.76, "strikethrough": false}, {"text": " left", "end_time": 9.33, "highlight": false, "start_time": 9.09, "strikethrough": false}, {"text": " corner,", "end_time": 9.8, "highlight": false, "start_time": 9.33, "strikethrough": false}, {"text": " because", "end_time": 10.75, "highlight": false, "start_time": 10.53, "strikethrough": false}, {"text": " if", "end_time": 10.92, "highlight": false, "start_time": 10.77, "strikethrough": false}, {"text": " you", "end_time": 11.04, "highlight": false, "start_time": 10.92, "strikethrough": false}, {"text": " want", "end_time": 11.16, "highlight": false, "start_time": 11.04, "strikethrough": false}, {"text": " to", "end_time": 11.22, "highlight": false, "start_time": 11.16, "strikethrough": false}, {"text": " see", "end_time": 11.46, "highlight": false, "start_time": 11.22, "strikethrough": false}, {"text": " yourself.", "end_time": 12.12, "highlight": false, "start_time": 11.46, "strikethrough": false}, {"text": " You", "end_time": 13.33, "highlight": false, "start_time": 13.12, "strikethrough": false}, {"text": " can't", "end_time": 13.6, "highlight": false, "start_time": 13.33, "strikethrough": false}, {"text": " look", "end_time": 13.75, "highlight": false, "start_time": 13.6, "strikethrough": false}, {"text": " at", "end_time": 13.9, "highlight": false, "start_time": 13.75, "strikethrough": false}, {"text": " the", "end_time": 13.96, "highlight": false, "start_time": 13.9, "strikethrough": false}, {"text": " camera,", "end_time": 14.53, "highlight": false, "start_time": 13.96, "strikethrough": false}, {"text": " so", "end_time": 14.94, "highlight": false, "start_time": 14.59, "strikethrough": false}, {"text": " there's", "end_time": 15.27, "highlight": false, "start_time": 14.98, "strikethrough": false}, {"text": " actually", "end_time": 15.55, "highlight": false, "start_time": 15.28, "strikethrough": false}, {"text": " a", "end_time": 15.61, "highlight": false, "start_time": 15.55, "strikethrough": false}, {"text": " fix", "end_time": 15.85, "highlight": false, "start_time": 15.61, "strikethrough": false}, {"text": " that.", "end_time": 16.15, "highlight": false, "start_time": 15.85, "strikethrough": false}, {"text": " Now.", "end_time": 18.31, "highlight": false, "start_time": 17.95, "strikethrough": false}], "speaker": "Speaker1", "end_time": 18.31, "start_time": 3.12}]	completed
0a5205f7-e9be-4e52-a40d-fe1dce176a9f	2021-07-26 13:54:59.459+00	2021-07-26 13:56:11.326434+00	JvNAk1MQ	[{"words": [{"text": "I", "end_time": 2.32, "highlight": false, "start_time": 2.13, "strikethrough": false}, {"text": " leave", "end_time": 2.58, "highlight": false, "start_time": 2.4, "strikethrough": false}, {"text": " the", "end_time": 3.03, "highlight": false, "start_time": 2.59, "strikethrough": false}, {"text": " quotes", "end_time": 3.6, "highlight": false, "start_time": 3.24, "strikethrough": false}, {"text": " of", "end_time": 3.66, "highlight": false, "start_time": 3.6, "strikethrough": false}, {"text": " flagger", "end_time": 4.3, "highlight": false, "start_time": 3.66, "strikethrough": false}, {"text": " and", "end_time": 5.45, "highlight": false, "start_time": 4.8, "strikethrough": false}, {"text": " they'll", "end_time": 6.14, "highlight": false, "start_time": 5.82, "strikethrough": false}, {"text": " simply", "end_time": 6.75, "highlight": false, "start_time": 6.2, "strikethrough": false}, {"text": " to", "end_time": 6.98, "highlight": false, "start_time": 6.87, "strikethrough": false}, {"text": " say", "end_time": 7.26, "highlight": false, "start_time": 7.05, "strikethrough": false}, {"text": " the", "end_time": 8.01, "highlight": false, "start_time": 7.39, "strikethrough": false}, {"text": " company", "end_time": 9.27, "highlight": false, "start_time": 8.85, "strikethrough": false}, {"text": " structure", "end_time": 9.84, "highlight": false, "start_time": 9.27, "strikethrough": false}, {"text": " out", "end_time": 10.86, "highlight": false, "start_time": 10.59, "strikethrough": false}, {"text": " of", "end_time": 11.29, "highlight": false, "start_time": 10.94, "strikethrough": false}, {"text": " North", "end_time": 12.48, "highlight": false, "start_time": 11.85, "strikethrough": false}, {"text": " Dakota,", "end_time": 12.92, "highlight": false, "start_time": 12.48, "strikethrough": false}, {"text": " founder", "end_time": 13.43, "highlight": false, "start_time": 12.95, "strikethrough": false}, {"text": " Duncker.", "end_time": 14.49, "highlight": false, "start_time": 13.86, "strikethrough": false}], "speaker": "Speaker1", "end_time": 14.49, "start_time": 2.13}]	completed
cd99c74c-3030-4ced-9606-a1c981f27483	2021-07-26 16:00:20.292+00	2021-07-26 16:01:56.598386+00	o2d9g6yx	[{"words": [{"text": "We", "end_time": 0.24, "highlight": false, "start_time": 0.07, "strikethrough": false}, {"text": " want", "end_time": 0.44, "highlight": false, "start_time": 0.24, "strikethrough": false}, {"text": " retesting,", "end_time": 1.71, "highlight": false, "start_time": 0.69, "strikethrough": false}, {"text": " audio", "end_time": 3.06, "highlight": false, "start_time": 2.37, "strikethrough": false}, {"text": " message,", "end_time": 3.68, "highlight": false, "start_time": 3.06, "strikethrough": false}, {"text": " recording,", "end_time": 4.41, "highlight": false, "start_time": 3.75, "strikethrough": false}, {"text": " audio", "end_time": 4.89, "highlight": false, "start_time": 4.41, "strikethrough": false}, {"text": " message.", "end_time": 5.58, "highlight": false, "start_time": 4.89, "strikethrough": false}], "speaker": "Speaker1", "end_time": 5.58, "start_time": 0.07}]	completed
cea62726-cd42-4f73-8373-7bf6e0557b6a	2021-07-26 16:01:23.591+00	2021-07-26 16:02:52.02221+00	rxwAmEkv	[]	completed
d254251a-d304-4d9e-9a32-067622eff721	2021-07-26 16:04:36.015+00	2021-07-26 16:05:57.513321+00	wQWYmDw2	[{"words": [{"text": "This", "end_time": 1.96, "highlight": false, "start_time": 1.68, "strikethrough": false}, {"text": " thing", "end_time": 2.43, "highlight": false, "start_time": 2.1, "strikethrough": false}, {"text": " coming", "end_time": 2.9, "highlight": false, "start_time": 2.5, "strikethrough": false}, {"text": " recording,", "end_time": 4.14, "highlight": false, "start_time": 2.95, "strikethrough": false}, {"text": " one,", "end_time": 4.56, "highlight": false, "start_time": 4.14, "strikethrough": false}, {"text": " two,", "end_time": 4.83, "highlight": false, "start_time": 4.56, "strikethrough": false}, {"text": " three,", "end_time": 5.16, "highlight": false, "start_time": 4.83, "strikethrough": false}, {"text": " one,", "end_time": 5.43, "highlight": false, "start_time": 5.16, "strikethrough": false}, {"text": " two,", "end_time": 5.58, "highlight": false, "start_time": 5.43, "strikethrough": false}, {"text": " three,", "end_time": 5.81, "highlight": false, "start_time": 5.58, "strikethrough": false}, {"text": " today", "end_time": 6.18, "highlight": false, "start_time": 5.82, "strikethrough": false}, {"text": " is", "end_time": 6.33, "highlight": false, "start_time": 6.18, "strikethrough": false}, {"text": " Monday.", "end_time": 6.98, "highlight": false, "start_time": 6.33, "strikethrough": false}, {"text": " Love,", "end_time": 7.26, "highlight": false, "start_time": 7.03, "strikethrough": false}, {"text": " love,", "end_time": 7.47, "highlight": false, "start_time": 7.26, "strikethrough": false}, {"text": " love.", "end_time": 7.9, "highlight": false, "start_time": 7.47, "strikethrough": false}], "speaker": "Speaker1", "end_time": 7.9, "start_time": 1.68}]	completed
8ad43303-4f8f-4a51-972c-c50ae5594020	2021-07-26 16:07:03.048+00	2021-07-26 16:07:03.048+00	zvj5PMEQ	\N	preparing
93437f8e-d090-46de-996c-d3ce0d54277f	2021-07-27 15:11:30.053+00	2021-07-27 15:12:44.648873+00	oxy3NLRv	[{"words": [{"text": "And", "end_time": 1.09, "highlight": false, "start_time": 0.84, "strikethrough": false}, {"text": " that", "end_time": 1.4, "highlight": false, "start_time": 1.2, "strikethrough": false}, {"text": " is", "end_time": 2.26, "highlight": false, "start_time": 2.15, "strikethrough": false}, {"text": " that's", "end_time": 2.6, "highlight": false, "start_time": 2.37, "strikethrough": false}, {"text": " part", "end_time": 2.87, "highlight": false, "start_time": 2.61, "strikethrough": false}, {"text": " of", "end_time": 3, "highlight": false, "start_time": 2.89, "strikethrough": false}, {"text": " our", "end_time": 3.18, "highlight": false, "start_time": 3.01, "strikethrough": false}, {"text": " vision", "end_time": 3.63, "highlight": false, "start_time": 3.18, "strikethrough": false}, {"text": " of.", "end_time": 3.79, "highlight": false, "start_time": 3.63, "strikethrough": false}], "speaker": "Speaker1", "end_time": 3.79, "start_time": 0.84}]	completed
9a0ac5a7-0365-4d92-8aa9-1bb6bc6630b5	2021-07-27 15:13:11.758+00	2021-07-27 15:14:27.319392+00	yvR8415x	[]	completed
c395f1e2-23f1-480d-89ec-17614c0dd08f	2021-07-30 08:07:54.933+00	2021-07-30 08:09:44.658659+00	j2eZmyPx	[{"words": [{"text": "Hello,", "end_time": 2.07, "highlight": false, "start_time": 1.44, "strikethrough": false}, {"text": " this", "end_time": 2.64, "highlight": false, "start_time": 2.38, "strikethrough": false}, {"text": " is", "end_time": 2.7, "highlight": false, "start_time": 2.64, "strikethrough": false}, {"text": " a", "end_time": 2.76, "highlight": false, "start_time": 2.7, "strikethrough": false}, {"text": " test", "end_time": 3.09, "highlight": false, "start_time": 2.76, "strikethrough": false}, {"text": " video", "end_time": 3.63, "highlight": false, "start_time": 3.09, "strikethrough": false}, {"text": " and", "end_time": 4.74, "highlight": false, "start_time": 4.38, "strikethrough": false}, {"text": " submitting", "end_time": 5.37, "highlight": false, "start_time": 4.74, "strikethrough": false}, {"text": " it", "end_time": 5.61, "highlight": false, "start_time": 5.37, "strikethrough": false}, {"text": " in", "end_time": 5.97, "highlight": false, "start_time": 5.61, "strikethrough": false}, {"text": " three", "end_time": 6.78, "highlight": false, "start_time": 6.12, "strikethrough": false}, {"text": " to", "end_time": 7.8, "highlight": false, "start_time": 7.17, "strikethrough": false}, {"text": " one", "end_time": 8.75, "highlight": false, "start_time": 8.13, "strikethrough": false}, {"text": " now.", "end_time": 9.87, "highlight": false, "start_time": 9.18, "strikethrough": false}], "speaker": "Speaker1", "end_time": 9.87, "start_time": 1.44}]	completed
205f0281-5297-4d48-ae52-8a60647a9667	2021-08-10 12:33:49.695+00	2021-08-10 12:35:15.082099+00	Oxol7bjQ	[{"words": [{"text": "Hey,", "end_time": 1.01, "highlight": false, "start_time": 0.93, "strikethrough": false}, {"text": " Yannick", "end_time": 1.62, "highlight": false, "start_time": 1.08, "strikethrough": false}, {"text": " Kootz,", "end_time": 1.98, "highlight": false, "start_time": 1.62, "strikethrough": false}, {"text": " escargot", "end_time": 2.58, "highlight": false, "start_time": 1.98, "strikethrough": false}, {"text": " flag,", "end_time": 2.58, "highlight": false, "start_time": 2.58, "strikethrough": false}, {"text": " small", "end_time": 3.36, "highlight": false, "start_time": 2.71, "strikethrough": false}, {"text": " stuff,", "end_time": 5.19, "highlight": false, "start_time": 4.86, "strikethrough": false}, {"text": " the", "end_time": 5.31, "highlight": false, "start_time": 5.2, "strikethrough": false}, {"text": " ancient", "end_time": 5.73, "highlight": false, "start_time": 5.32, "strikethrough": false}, {"text": " Fackler", "end_time": 6.36, "highlight": false, "start_time": 5.75, "strikethrough": false}, {"text": " community", "end_time": 7.18, "highlight": false, "start_time": 6.43, "strikethrough": false}, {"text": " does", "end_time": 7.83, "highlight": false, "start_time": 7.32, "strikethrough": false}, {"text": " the", "end_time": 8.64, "highlight": false, "start_time": 8.23, "strikethrough": false}, {"text": " DNA,", "end_time": 9.25, "highlight": false, "start_time": 8.65, "strikethrough": false}, {"text": " Hoyt", "end_time": 9.66, "highlight": false, "start_time": 9.27, "strikethrough": false}, {"text": " Adams", "end_time": 10.64, "highlight": false, "start_time": 10.23, "strikethrough": false}, {"text": " was", "end_time": 10.77, "highlight": false, "start_time": 10.65, "strikethrough": false}, {"text": " invited", "end_time": 11.5, "highlight": false, "start_time": 11.04, "strikethrough": false}, {"text": " by", "end_time": 11.61, "highlight": false, "start_time": 11.54, "strikethrough": false}, {"text": " some", "end_time": 11.86, "highlight": false, "start_time": 11.7, "strikethrough": false}, {"text": " business", "end_time": 12.23, "highlight": false, "start_time": 11.91, "strikethrough": false}, {"text": " segment", "end_time": 14.68, "highlight": false, "start_time": 13.49, "strikethrough": false}, {"text": " of", "end_time": 15.16, "highlight": false, "start_time": 15.15, "strikethrough": false}, {"text": " segment", "end_time": 15.24, "highlight": false, "start_time": 15.17, "strikethrough": false}, {"text": " of", "end_time": 15.43, "highlight": false, "start_time": 15.37, "strikethrough": false}, {"text": " my", "end_time": 15.46, "highlight": false, "start_time": 15.44, "strikethrough": false}, {"text": " community", "end_time": 17.15, "highlight": false, "start_time": 16.8, "strikethrough": false}, {"text": " call.", "end_time": 17.69, "highlight": false, "start_time": 17.53, "strikethrough": false}, {"text": " The", "end_time": 17.95, "highlight": false, "start_time": 17.87, "strikethrough": false}, {"text": " next", "end_time": 18.29, "highlight": false, "start_time": 18.03, "strikethrough": false}, {"text": " day", "end_time": 18.38, "highlight": false, "start_time": 18.3, "strikethrough": false}, {"text": " in", "end_time": 18.45, "highlight": false, "start_time": 18.39, "strikethrough": false}, {"text": " court.", "end_time": 18.69, "highlight": false, "start_time": 18.48, "strikethrough": false}, {"text": " Ahmadu", "end_time": 19.2, "highlight": false, "start_time": 18.74, "strikethrough": false}, {"text": " annoyed", "end_time": 19.77, "highlight": false, "start_time": 19.46, "strikethrough": false}, {"text": " us", "end_time": 20.16, "highlight": false, "start_time": 19.81, "strikethrough": false}, {"text": " and", "end_time": 20.86, "highlight": false, "start_time": 20.5, "strikethrough": false}, {"text": " this", "end_time": 22.05, "highlight": false, "start_time": 21.84, "strikethrough": false}, {"text": " angry", "end_time": 22.29, "highlight": false, "start_time": 22.06, "strikethrough": false}, {"text": " and", "end_time": 22.48, "highlight": false, "start_time": 22.39, "strikethrough": false}, {"text": " frustrated", "end_time": 23.04, "highlight": false, "start_time": 22.74, "strikethrough": false}, {"text": " by", "end_time": 23.58, "highlight": false, "start_time": 23.4, "strikethrough": false}, {"text": " the", "end_time": 24.94, "highlight": false, "start_time": 24.86, "strikethrough": false}, {"text": " fact", "end_time": 25.57, "highlight": false, "start_time": 25.2, "strikethrough": false}, {"text": " that", "end_time": 26.01, "highlight": false, "start_time": 25.86, "strikethrough": false}, {"text": " a", "end_time": 26.1, "highlight": false, "start_time": 26.04, "strikethrough": false}, {"text": " man", "end_time": 26.25, "highlight": false, "start_time": 26.1, "strikethrough": false}, {"text": " called", "end_time": 26.46, "highlight": false, "start_time": 26.25, "strikethrough": false}, {"text": " Mohammed", "end_time": 26.76, "highlight": false, "start_time": 26.46, "strikethrough": false}, {"text": " and", "end_time": 26.94, "highlight": false, "start_time": 26.77, "strikethrough": false}, {"text": " said", "end_time": 27.64, "highlight": false, "start_time": 27.51, "strikethrough": false}, {"text": " he", "end_time": 27.72, "highlight": false, "start_time": 27.66, "strikethrough": false}, {"text": " discussed", "end_time": 28.14, "highlight": false, "start_time": 27.73, "strikethrough": false}, {"text": " and", "end_time": 28.26, "highlight": false, "start_time": 28.14, "strikethrough": false}, {"text": " the", "end_time": 28.47, "highlight": false, "start_time": 28.27, "strikethrough": false}, {"text": " community", "end_time": 28.92, "highlight": false, "start_time": 28.47, "strikethrough": false}, {"text": " had", "end_time": 29.13, "highlight": false, "start_time": 28.93, "strikethrough": false}, {"text": " to", "end_time": 30.32, "highlight": false, "start_time": 30.2, "strikethrough": false}, {"text": " issue", "end_time": 30.46, "highlight": false, "start_time": 30.35, "strikethrough": false}, {"text": " to", "end_time": 30.73, "highlight": false, "start_time": 30.63, "strikethrough": false}, {"text": " speak", "end_time": 30.81, "highlight": false, "start_time": 30.75, "strikethrough": false}, {"text": " up", "end_time": 31.7, "highlight": false, "start_time": 31.62, "strikethrough": false}, {"text": " just", "end_time": 31.87, "highlight": false, "start_time": 31.74, "strikethrough": false}, {"text": " for", "end_time": 31.97, "highlight": false, "start_time": 31.89, "strikethrough": false}, {"text": " this", "end_time": 32.14, "highlight": false, "start_time": 31.98, "strikethrough": false}, {"text": " Clava", "end_time": 32.73, "highlight": false, "start_time": 32.16, "strikethrough": false}, {"text": " would", "end_time": 32.91, "highlight": false, "start_time": 32.76, "strikethrough": false}, {"text": " be", "end_time": 33.47, "highlight": false, "start_time": 33.39, "strikethrough": false}, {"text": " sufficient", "end_time": 33.84, "highlight": false, "start_time": 33.51, "strikethrough": false}, {"text": " to.", "end_time": 34.19, "highlight": false, "start_time": 33.94, "strikethrough": false}], "speaker": "Speaker1", "end_time": 34.19, "start_time": 0.93}]	completed
fa2c9070-233d-4d2f-8f4e-3c35c028c1a0	2021-08-10 12:42:35.862+00	2021-08-10 12:43:56.75524+00	qvYdDLqQ	[{"words": [{"text": "Hey,", "end_time": 1.87, "highlight": false, "start_time": 1.44, "strikethrough": false}, {"text": " as", "end_time": 2.17, "highlight": false, "start_time": 1.89, "strikethrough": false}, {"text": " I", "end_time": 2.61, "highlight": false, "start_time": 2.54, "strikethrough": false}, {"text": " know,", "end_time": 2.84, "highlight": false, "start_time": 2.7, "strikethrough": false}, {"text": " Madonna", "end_time": 3.57, "highlight": false, "start_time": 2.85, "strikethrough": false}, {"text": " has", "end_time": 3.94, "highlight": false, "start_time": 3.57, "strikethrough": false}, {"text": " this", "end_time": 4.14, "highlight": false, "start_time": 3.94, "strikethrough": false}, {"text": " guesstimation", "end_time": 5.01, "highlight": false, "start_time": 4.14, "strikethrough": false}, {"text": " simpla", "end_time": 6.15, "highlight": false, "start_time": 5.25, "strikethrough": false}, {"text": " community", "end_time": 7.08, "highlight": false, "start_time": 6.51, "strikethrough": false}, {"text": " see", "end_time": 7.26, "highlight": false, "start_time": 7.08, "strikethrough": false}, {"text": " it", "end_time": 7.44, "highlight": false, "start_time": 7.26, "strikethrough": false}, {"text": " as", "end_time": 7.7, "highlight": false, "start_time": 7.44, "strikethrough": false}, {"text": " a", "end_time": 7.83, "highlight": false, "start_time": 7.71, "strikethrough": false}, {"text": " Julia", "end_time": 8.28, "highlight": false, "start_time": 7.83, "strikethrough": false}, {"text": " Hatzius", "end_time": 8.73, "highlight": false, "start_time": 8.28, "strikethrough": false}, {"text": " as", "end_time": 8.73, "highlight": false, "start_time": 8.73, "strikethrough": false}, {"text": " you", "end_time": 8.79, "highlight": false, "start_time": 8.73, "strikethrough": false}, {"text": " can", "end_time": 9.03, "highlight": false, "start_time": 8.79, "strikethrough": false}, {"text": " construct", "end_time": 9.95, "highlight": false, "start_time": 9.27, "strikethrough": false}, {"text": " up", "end_time": 10.41, "highlight": false, "start_time": 9.96, "strikethrough": false}, {"text": " the", "end_time": 11.46, "highlight": false, "start_time": 10.8, "strikethrough": false}, {"text": " end", "end_time": 12.12, "highlight": false, "start_time": 11.94, "strikethrough": false}, {"text": " enough", "end_time": 12.54, "highlight": false, "start_time": 12.12, "strikethrough": false}, {"text": " Milovanovic", "end_time": 13.47, "highlight": false, "start_time": 12.54, "strikethrough": false}, {"text": " and", "end_time": 13.59, "highlight": false, "start_time": 13.47, "strikethrough": false}, {"text": " kinda", "end_time": 14.16, "highlight": false, "start_time": 13.59, "strikethrough": false}, {"text": " what", "end_time": 14.75, "highlight": false, "start_time": 14.49, "strikethrough": false}, {"text": " it", "end_time": 14.82, "highlight": false, "start_time": 14.76, "strikethrough": false}, {"text": " has", "end_time": 14.95, "highlight": false, "start_time": 14.85, "strikethrough": false}, {"text": " to", "end_time": 15.04, "highlight": false, "start_time": 14.97, "strikethrough": false}, {"text": " do", "end_time": 15.12, "highlight": false, "start_time": 15.06, "strikethrough": false}, {"text": " with", "end_time": 15.21, "highlight": false, "start_time": 15.12, "strikethrough": false}, {"text": " that", "end_time": 15.37, "highlight": false, "start_time": 15.21, "strikethrough": false}, {"text": " character", "end_time": 15.74, "highlight": false, "start_time": 15.37, "strikethrough": false}, {"text": " as", "end_time": 16.3, "highlight": false, "start_time": 16.12, "strikethrough": false}, {"text": " Esma", "end_time": 16.85, "highlight": false, "start_time": 16.45, "strikethrough": false}, {"text": " as", "end_time": 17.3, "highlight": false, "start_time": 17.13, "strikethrough": false}, {"text": " I", "end_time": 17.42, "highlight": false, "start_time": 17.31, "strikethrough": false}, {"text": " know", "end_time": 17.58, "highlight": false, "start_time": 17.43, "strikethrough": false}, {"text": " this", "end_time": 17.79, "highlight": false, "start_time": 17.58, "strikethrough": false}, {"text": " and", "end_time": 17.87, "highlight": false, "start_time": 17.79, "strikethrough": false}, {"text": " zeer,", "end_time": 18.26, "highlight": false, "start_time": 17.88, "strikethrough": false}, {"text": " the", "end_time": 18.48, "highlight": false, "start_time": 18.33, "strikethrough": false}, {"text": " design", "end_time": 18.9, "highlight": false, "start_time": 18.48, "strikethrough": false}, {"text": " of", "end_time": 18.99, "highlight": false, "start_time": 18.9, "strikethrough": false}, {"text": " the", "end_time": 19.11, "highlight": false, "start_time": 18.99, "strikethrough": false}, {"text": " product", "end_time": 19.44, "highlight": false, "start_time": 19.11, "strikethrough": false}, {"text": " screens", "end_time": 19.94, "highlight": false, "start_time": 19.44, "strikethrough": false}, {"text": " when", "end_time": 20.46, "highlight": false, "start_time": 20.25, "strikethrough": false}, {"text": " done", "end_time": 20.87, "highlight": false, "start_time": 20.46, "strikethrough": false}, {"text": " on", "end_time": 21.26, "highlight": false, "start_time": 21.18, "strikethrough": false}, {"text": " a", "end_time": 21.32, "highlight": false, "start_time": 21.27, "strikethrough": false}, {"text": " machine", "end_time": 21.81, "highlight": false, "start_time": 21.33, "strikethrough": false}, {"text": " of", "end_time": 22.94, "highlight": false, "start_time": 22.72, "strikethrough": false}, {"text": " exact", "end_time": 23.37, "highlight": false, "start_time": 22.98, "strikethrough": false}, {"text": " management,", "end_time": 23.8, "highlight": false, "start_time": 23.37, "strikethrough": false}, {"text": " enough", "end_time": 24.13, "highlight": false, "start_time": 23.82, "strikethrough": false}, {"text": " US", "end_time": 24.41, "highlight": false, "start_time": 24.16, "strikethrough": false}, {"text": " action", "end_time": 24.9, "highlight": false, "start_time": 24.42, "strikethrough": false}, {"text": " relative", "end_time": 25.58, "highlight": false, "start_time": 24.93, "strikethrough": false}, {"text": " klar.", "end_time": 26.22, "highlight": false, "start_time": 25.59, "strikethrough": false}], "speaker": "Speaker1", "end_time": 26.22, "start_time": 1.44}]	completed
c075c6d4-9218-48a2-aea6-ab7e9816816d	2021-08-12 13:47:37.207+00	2021-08-12 13:47:37.207+00	R2OKz5J2	\N	preparing
abb2393b-b279-4a8d-9ae4-c95420d7aec7	2021-08-13 10:00:28.716+00	2021-08-13 10:00:28.716+00	mxmy0j0x	\N	preparing
e423ae04-9f94-4a08-b7e7-798daad60ffe	2021-08-13 11:01:28.186+00	2021-08-13 11:01:28.186+00	8271d8BQ	\N	preparing
\.


--
-- Data for Name: attachment; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.attachment (id, created_at, original_name, mime_type, message_id, user_id, transcription_id) FROM stdin;
78bc976d-c1ce-4df8-b55d-6e1720109c71	2021-05-21 11:30:46.218+00	video-recording-1621596646003.mp4	video/mp4	\N	\N	\N
a6a41b10-3e26-497b-9428-789e2b003e2c	2021-05-21 12:37:46.231+00	audio-recording-1621600665934.mp3	audio/mp3	\N	\N	\N
20b7177a-74eb-4d15-955f-1f706eefd0e6	2021-05-21 12:38:10.291+00	audio-recording-1621600690016.mp3	audio/mp3	\N	\N	\N
9b6b0efe-2581-4aad-bd3b-fabd5cacf435	2021-05-21 12:38:27.928+00	video-recording-1621600707650.mp4	video/mp4	\N	\N	\N
f68cf96d-609d-4974-9b46-bcc5626c2583	2021-05-21 12:44:01.11+00	Bildschirmfoto 2021-05-21 um 14.43.09.png	image/png	\N	\N	\N
cca735f1-6211-44ca-9a5e-b51b09a59f56	2021-05-21 13:18:28.077+00	video-recording-1621603107691.mp4	video/mp4	\N	\N	\N
38a41939-e918-4ff6-b505-fd257c9aaa74	2021-05-21 13:19:34.534+00	Q_2007-11-14_Jawaharlal_Nehru.ogg	audio/ogg	\N	\N	\N
dc3e8130-7162-41f1-95ee-42580a4ab0d0	2021-05-21 13:22:58.341+00	Q_2007-11-14_Jawaharlal_Nehru.ogg	audio/ogg	\N	\N	\N
f7b65bdd-a814-45ed-b378-4918aa3dd82c	2021-05-25 08:31:22.765+00	audio-recording-1621931482359.mp3	audio/mp3	\N	\N	\N
44e59e6d-8060-49ba-b0a2-dcaf27b55117	2021-05-25 13:29:34.912+00	audio-recording-1621949374513.mp3	audio/mp3	\N	\N	\N
14810441-44df-4e18-b7bd-e30e90e9f02e	2021-05-25 14:41:02.555+00	Bildschirmfoto 2021-05-25 um 14.09.20.png	image/png	\N	\N	\N
1128e98c-331f-447f-9e5f-150520b20fad	2021-05-25 14:45:57.794+00	Bildschirmfoto 2021-05-25 um 10.47.54.png	image/png	\N	\N	\N
07850c0b-b6b6-4e92-a9f7-8a50e18e134c	2021-05-26 11:28:30.456+00	audio-recording-1622028510124.mp3	audio/mp3	\N	\N	\N
47e5ce42-991d-4a7e-beae-18a46ac7e56b	2021-05-26 12:54:03.848+00	audio-recording-1622033643397.mp3	audio/mp3	\N	\N	\N
69eb4c57-8910-49ba-9143-eab10fb24f63	2021-05-26 13:49:00.955+00	audio-recording-1622036940716.mp3	audio/mp3	\N	\N	\N
8e4fe2c5-09f9-48a4-8577-aeb975d60cf6	2021-05-26 14:14:18.635+00	audio-recording-1622038458267.mp3	audio/mp3	\N	\N	\N
9867b02e-6b13-4b49-9501-d6b077823fa5	2021-05-26 16:00:39.309+00	audio-recording-1622044838898.mp3	audio/mp3	\N	\N	\N
e8f7a0d4-363b-419d-9714-1189aae2d364	2021-05-26 21:00:12.386+00	video-recording-1622062812006.x-matroska	video/x-matroska	\N	\N	\N
c3f642e4-554b-4260-9970-95e142bf6c03	2021-05-27 08:31:54.746+00	cool.gif	image/gif	\N	\N	\N
53dcbb57-d8c7-45ea-a0a9-462a47cecebb	2021-05-27 13:42:59.037+00	video-recording-1622122978181.x-matroska	video/x-matroska	\N	\N	\N
0b84b599-5e38-4af2-a58e-6e323a8b4b19	2021-05-27 13:43:31.404+00	audio-recording-1622123010958.webm	audio/webm	\N	\N	\N
d2edcef9-8874-4bc7-827e-585131e64964	2021-05-27 13:55:51.351+00	audio-recording-1622123750817.webm	audio/webm	\N	\N	\N
430f577b-e4ed-49f2-a63c-9f4cf87418ba	2021-05-27 14:16:05.48+00	audio-recording-1622124964919.webm	audio/webm	\N	\N	\N
c624177a-2373-4377-81b5-822ed59f9417	2021-05-27 17:32:28.925+00	audio-recording-1622136748160.webm	audio/webm	\N	\N	\N
fc5d2027-134c-449c-a151-99c4034e518b	2021-05-28 17:35:02.638+00	audio-recording-1622223302109.webm	audio/webm	\N	\N	\N
3bde83bd-64a2-4456-bd6f-ab49073e66cc	2021-05-31 14:08:38.406+00	Group 924.jpg	image/jpeg	\N	\N	\N
4f8d8a1e-eb03-45d4-abd7-91c52dd3e6e1	2021-06-01 07:23:59.45+00	audio-recording-1622532239205.webm	audio/webm	\N	\N	\N
a8a59502-952c-44e6-ad9c-091f6718a3fc	2021-06-01 16:40:28.686+00	audio-recording-1622565628494.webm	audio/webm	\N	\N	\N
f466bf7c-b285-4b36-aaa1-acdb46889d2f	2021-06-03 15:17:31.256+00	audio-recording-1622733451078.webm	audio/webm	\N	\N	\N
feeb7364-656a-4d83-baab-c96a88bea416	2021-06-03 15:18:00.296+00	video-recording-1622733479769.webm	video/webm	\N	\N	\N
649e6c84-b490-46d4-989d-3e8fe161203e	2021-06-05 10:47:50.32+00	audio-recording-1622890070068.webm	audio/webm	\N	\N	\N
cdf48bc6-c529-4305-b66b-2a100d28e389	2021-06-07 12:29:37.721+00	video-recording-1623068976906.x-matroska	video/x-matroska	\N	\N	\N
d7759b0b-c95e-4225-8801-facae5e5e7af	2021-06-07 12:32:08.681+00	audio-recording-1623069128275.webm	audio/webm	\N	\N	\N
73c5af34-d329-4429-9da3-9bf4afa9cb5c	2021-06-07 12:39:21.483+00	audio-recording-1623069561108.webm	audio/webm	\N	\N	\N
09a48fdd-531d-4f22-8339-106dc2b51efe	2021-06-07 13:35:05.717+00	audio-recording-1623072905196.webm	audio/webm	\N	\N	\N
1b834a79-d0a0-4b41-a7b9-67c3a568d3d7	2021-06-07 13:44:02.885+00	video-recording-1623073442532.x-matroska	video/x-matroska	\N	\N	\N
fbaa964c-c099-4cdb-96f0-7d9631e1709d	2021-06-07 14:17:57.112+00	Screenshot 2021-06-07 at 16.45.52.png	image/png	\N	\N	\N
92011cdb-b7b8-4b90-b447-1bae68e4b972	2021-06-07 14:19:23.137+00	test.pdf	application/pdf	\N	\N	\N
027fc16e-5bfe-475b-b980-103f898a8b04	2021-06-07 14:32:23.138+00	video-recording-1623076342145.webm	video/webm	\N	\N	\N
51829549-f59f-4e95-8aeb-a66d872d0f1d	2021-06-07 15:03:44.777+00	audio-recording-1623078224428.webm	audio/webm	\N	\N	\N
41b59707-a913-4ad0-b770-0c56dae27b8a	2021-06-07 15:04:05.903+00	video-recording-1623078245539.webm	video/webm	\N	\N	\N
41d9100f-af74-483c-9735-54d30202d063	2021-06-07 16:22:03.934+00	The_Earth_seen_from_Apollo_17.jpeg	image/jpeg	\N	\N	\N
24035009-063e-45d0-b177-4153b788e0be	2021-06-09 09:59:04.297+00	audio-recording-1623232743388.webm	audio/webm	\N	\N	\N
a0294e34-896e-49d7-be45-db699f361cb8	2021-06-09 13:33:17.169+00	Group 10121681.jpg	image/jpeg	\N	\N	\N
743cda19-51fa-4e87-b6eb-b9c63fe8ac0e	2021-06-11 07:49:24.582+00	Screenshot 2021-06-11 at 10.44.05.png	image/png	\N	\N	\N
1df3541b-12be-4bdc-9200-176f37d88031	2021-06-11 11:05:07.617+00	Screenshot 2021-06-11 at 14.04.39.png	image/png	\N	\N	\N
054a5e60-8323-402b-bd86-3d6f35546f99	2021-06-15 10:45:58.936+00	audio-recording-1623753958514.webm	audio/webm	\N	\N	\N
3fe78009-8d64-4f27-84b0-e48303977612	2021-06-15 10:46:41.809+00	video-recording-1623754001259.webm	video/webm	\N	\N	\N
b126cf16-687e-454b-9734-2cdbb8c1ce39	2021-06-15 10:47:18.322+00	Screenshot 2021-06-11 at 15.38.35.png	image/png	\N	\N	\N
75dc9be6-1acf-4759-a2a9-db631110eb48	2021-06-15 14:15:47.021+00	audio-recording-1623766546820.webm	audio/webm	\N	\N	\N
7b77e54e-31e8-46a3-b923-2b4b6126b98a	2021-06-15 14:16:46.074+00	video-recording-1623766605836.webm	video/webm	\N	\N	\N
d07cd4d9-3dfa-462b-a03d-b82966ee508a	2021-06-15 14:17:41.083+00	test_result.pdf	application/pdf	\N	\N	\N
24d9fb51-3bf0-4ae3-a86a-6879dae72901	2021-06-15 14:18:16.692+00	Screen Shot 2021-06-04 at 3.03.16 PM.png	image/png	\N	\N	\N
fc6b1868-bb62-4545-a275-0833ed31fff7	2021-06-15 14:18:38.206+00	Screen Shot 2021-05-17 at 9.34.42 AM.png	image/png	\N	\N	\N
c998927c-cc07-43fd-a520-5ee8b45eb400	2021-06-16 15:01:46.604+00	Screenshot 2021-06-14 at 14.32.18.png	image/png	\N	\N	\N
f726522f-54a5-4905-b263-992d07ac1047	2021-06-17 13:54:15.286+00	cool.gif	image/gif	\N	\N	\N
3748f46f-3419-4e56-a750-14214ee782ee	2021-06-21 07:53:11.536+00	image.png	image/png	\N	\N	\N
f5d66619-6cdb-4bed-be92-a279de5a8dbe	2021-06-21 08:06:49.052+00	Screen Shot 2021-06-21 at 11.06.44 AM.png	image/png	\N	\N	\N
e2e66e73-c33a-4a62-a082-da5df86a6021	2021-06-21 08:07:08.131+00	Screenshot 2021-06-21 at 11.06.52.png	image/png	\N	\N	\N
ca8acdb4-f7e9-4f6a-8587-a6c61d3d3dad	2021-06-22 10:21:16.613+00	alex-perri-bmM_IdLd1SA-unsplash.jpg	image/jpeg	\N	\N	\N
bcb5394c-51f0-4cdf-a28d-9dfa253008b4	2021-06-23 09:17:44.763+00	Screenshot 2021-06-23 at 12.11.24.png	image/png	\N	\N	\N
fd100de9-caca-4aad-81d9-3c724bc3403d	2021-06-23 09:17:44.761+00	Screenshot 2021-06-23 at 12.11.00.png	image/png	\N	\N	\N
0b407fd4-3ca7-420f-8a6d-c707bdf117c4	2021-06-23 09:17:44.796+00	Screenshot 2021-06-23 at 12.10.35.png	image/png	\N	\N	\N
618b5197-e20f-49ec-ab72-ecaf31171592	2021-06-23 09:17:45.013+00	Screenshot 2021-06-23 at 12.10.17.png	image/png	\N	\N	\N
0919853f-322c-428e-a4eb-95ecf3b82012	2021-06-23 09:18:15.401+00	Screenshot 2021-06-23 at 12.10.17.png	image/png	\N	\N	\N
e52d4114-194a-4488-9f67-d00dda2dd706	2021-06-23 09:18:15.44+00	Screenshot 2021-06-23 at 12.11.00.png	image/png	\N	\N	\N
61a877b3-73c4-4a9b-a836-ae1f042363b6	2021-06-23 09:18:15.477+00	Screenshot 2021-06-23 at 12.10.35.png	image/png	\N	\N	\N
efd96ac9-2233-4c63-a6f3-76dd2ab664cb	2021-06-23 09:18:16.023+00	Screenshot 2021-06-23 at 12.11.24.png	image/png	\N	\N	\N
72e6bcb5-e95f-4abf-8d21-624c196149e1	2021-06-23 11:15:17.842+00	Screenshot 2021-06-23 at 12.18.26.png	image/png	\N	\N	\N
0b6f064d-dcf8-487b-80e5-10cdbce7d3ac	2021-06-23 11:15:18.24+00	Screenshot 2021-06-23 at 12.19.00.png	image/png	\N	\N	\N
ec4d1ab4-3a13-4cc2-9d6b-16afad7345cc	2021-06-23 11:29:50.461+00	Screenshot 2021-06-23 at 12.18.26 2.png	image/png	\N	\N	\N
ed1f0a8c-1f3c-420e-9eb9-494761cb9e43	2021-06-23 11:29:50.462+00	Screenshot 2021-06-23 at 12.18.26 3.png	image/png	\N	\N	\N
18129b79-522b-4655-a8e5-c7bc35fe63bf	2021-06-23 11:29:50.44+00	Screenshot 2021-06-23 at 12.19.00 2.png	image/png	\N	\N	\N
c4911e24-79c3-479e-8da7-bf01db0d6220	2021-06-23 11:29:50.473+00	Screenshot 2021-06-23 at 12.18.26.png	image/png	\N	\N	\N
af965e94-2835-42f6-8221-e12570720749	2021-06-23 11:29:50.93+00	Screenshot 2021-06-23 at 12.19.00 3.png	image/png	\N	\N	\N
8aca40a7-b4be-4f16-83bc-0156568713db	2021-06-23 11:29:51.953+00	Screenshot 2021-06-23 at 12.19.00.png	image/png	\N	\N	\N
0ded29cc-e477-4761-b9ec-be0a30b1a015	2021-06-24 13:53:21.472+00	Team_Product_Session_24June.mp4	video/mp4	\N	\N	\N
223df8e2-c20a-4d12-af0a-1dd300421d3a	2021-06-25 09:12:15.116+00	Screenshot 2021-06-24 at 16.05.23.png	image/png	\N	\N	\N
8aeec328-d153-45ad-a0ef-073be14ca672	2021-06-25 09:12:32.771+00	Screenshot 2021-06-23 at 19.30.50.png	image/png	\N	\N	\N
3217556a-c877-4e55-8745-6188810ee486	2021-06-25 09:20:26.35+00	icon.png	image/png	\N	\N	\N
89fdbe33-1ad2-45eb-96f4-31545697c56a	2021-06-25 09:21:07.362+00	cool.gif	image/gif	\N	\N	\N
d2df6c85-4f82-4d72-b8f0-5f04b0fec940	2021-06-25 12:47:30.959+00	image.png	image/png	\N	\N	\N
0a39d220-278b-4d11-aa94-8e2ae463ba87	2021-06-25 14:28:01.4+00	slack_logo.jpg	image/jpeg	\N	\N	\N
e9303e8a-5857-4399-a9ab-efa5b93f5cce	2021-06-29 12:40:10.436+00	slack_logo.jpg	image/jpeg	\N	\N	\N
8e199a67-fa90-4350-8d5f-1c619280001e	2021-06-30 16:08:05.136+00	Screenshot 2021-06-30 at 18.07.58.png	image/png	\N	\N	\N
568adc54-183b-4b83-ba42-71874a277b4c	2021-06-30 16:40:05.361+00	Screenshot 2021-06-30 at 18.39.55.png	image/png	\N	\N	\N
2184f0bd-18f9-421f-86c2-b6a6f61eb802	2021-06-30 16:40:05.381+00	Screenshot 2021-06-30 at 18.39.55 4.png	image/png	\N	\N	\N
57936be5-32fd-42ee-9dac-abef4531a5e2	2021-06-30 16:40:05.412+00	Screenshot 2021-06-30 at 18.39.55 2.png	image/png	\N	\N	\N
8056bad2-926a-4e37-be33-098171864cae	2021-06-30 16:40:05.642+00	Screenshot 2021-06-30 at 18.39.55 5.png	image/png	\N	\N	\N
5c9a5548-ed94-4b0b-ad73-787837e48f32	2021-06-30 16:40:05.806+00	Screenshot 2021-06-30 at 18.39.55 3.png	image/png	\N	\N	\N
69e0ae76-0ac1-46d5-92be-6f404b464eb0	2021-07-05 06:37:41.654+00	Tamaro.jpeg	image/jpeg	\N	\N	\N
d72a3744-72f7-4637-ac0d-f54e80429cbc	2021-07-05 06:54:20.678+00	small_avatar.jpeg	image/jpeg	\N	\N	\N
4d57f1b8-73e0-458a-8576-d365cee91b8a	2021-07-05 10:13:24.732+00	Screenshot 2021-07-05 at 12.13.20.png	image/png	\N	\N	\N
cf3d8272-c89f-4e20-9121-f00e60c2ac58	2021-07-05 10:13:31.963+00	Screenshot 2021-07-05 at 12.13.20 2.png	image/png	\N	\N	\N
a4be9638-9dee-4c25-aba4-8ef4c6ef3d74	2021-07-05 10:13:31.944+00	Screenshot 2021-07-05 at 12.13.20 4.png	image/png	\N	\N	\N
68b2a9f6-5285-456e-801e-ab6787ebbc33	2021-07-05 10:13:32.003+00	Screenshot 2021-07-05 at 12.13.20 5.png	image/png	\N	\N	\N
df862a40-7b53-4e85-b4a5-19a748b0d130	2021-07-05 10:13:32.239+00	Screenshot 2021-07-05 at 12.13.20 6.png	image/png	\N	\N	\N
87e1896d-3689-40ed-a11f-c7bfbe340450	2021-07-05 10:13:32.747+00	Screenshot 2021-07-05 at 12.13.20 3.png	image/png	\N	\N	\N
7164f390-ec34-4e5a-8704-3661a2afeb41	2021-07-05 12:43:26.879+00	kitten.png	image/png	\N	\N	\N
28ea7583-0b31-47ae-839d-c58e73b98fd9	2021-07-05 12:54:01.014+00	audio-recording-1625489640806.webm	audio/webm	\N	\N	\N
c0c5bbc5-b063-45cd-a467-9967ff7cff7b	2021-07-06 08:54:56.711+00	block1.jpg	image/jpeg	\N	\N	\N
294348a4-3e88-44fa-bf6b-ab7446644815	2021-07-06 08:57:33.178+00	block2.jpg	image/jpeg	\N	\N	\N
a3c43950-435a-419c-8510-d19bc44a2d09	2021-07-06 08:57:40.839+00	logo.jpg	image/jpeg	\N	\N	\N
f2c4feeb-9ad2-4150-a00e-afdbdaec792d	2021-07-06 09:11:22.75+00	CleanShot 2021-07-06 at 11.11.11@2x.png	image/png	\N	\N	\N
317bc1f6-586a-4dfd-9406-d5eb3f192674	2021-07-06 09:19:38.643+00	CleanShot 2021-07-06 at 11.19.23@2x.png	image/png	\N	\N	\N
9959de59-0768-409f-a36f-56eca8cfb5f4	2021-07-06 09:35:20.649+00	Screenshot 2021-07-06 at 11.35.17.png	image/png	\N	\N	\N
a948b0d4-e32c-4417-b411-98395d3513e1	2021-07-06 09:36:44.593+00	Screenshot 2021-07-06 at 11.36.41.png	image/png	\N	\N	\N
03628749-2c41-4a14-9a30-9536f21c7dd5	2021-07-06 09:42:30.825+00	Screenshot 2021-07-06 at 11.42.07.png	image/png	\N	\N	\N
0897ebcf-ec55-47f5-ac85-bad2e38bf1a8	2021-07-06 09:45:24.111+00	CleanShot 2021-07-06 at 11.44.40@2x.png	image/png	\N	\N	\N
1e0ed429-900b-4f3b-a392-512c645e8401	2021-07-06 09:46:52.993+00	CleanShot 2021-07-06 at 11.46.44@2x.png	image/png	\N	\N	\N
c5c783f8-94e5-47d4-adab-406e8ddbe678	2021-07-06 09:50:23.65+00	image.png	image/png	\N	\N	\N
8841ede4-ea87-4df9-afcb-bf873c5cc91b	2021-07-06 10:11:00.62+00	video-recording-1625566260112.x-matroska	video/x-matroska	\N	\N	\N
d67f6c7b-3106-4671-9796-34cfa5c7323a	2021-07-06 10:15:26.139+00	video-recording-1625566525680.x-matroska	video/x-matroska	\N	\N	\N
1acd2617-3c5b-43bf-b335-78ae1f82d82c	2021-07-06 10:20:02.107+00	Group 10121802.jpg	image/jpeg	\N	\N	\N
f077b4af-bdf7-4456-8129-cd410e56c23b	2021-07-06 12:14:16.28+00	Screenshot 2021-07-06 at 11.42.07.png	image/png	\N	\N	\N
d00137b6-b13c-4b7f-aaea-f14ad8c9003b	2021-07-06 12:24:01.201+00	Screen Recording 2021-06-22 at 10.03.29.mov	video/quicktime	\N	\N	\N
13f2988a-bd1e-4b03-bd46-330b55dd8693	2021-07-06 12:29:01.541+00	pol2 1 copy.png	image/png	\N	\N	\N
ef7fc2d6-1b02-47e3-b198-92ee55d8c708	2021-07-06 12:29:19.002+00	upload bug.mov	video/quicktime	\N	\N	\N
05dff349-b233-42d4-8140-979e384cd775	2021-07-06 12:33:39.328+00	Screen Recording 2021-06-22 at 10.03.29.mov	video/quicktime	\N	\N	\N
cfa8b633-2adf-4e89-9bca-9cf513795834	2021-07-06 12:34:54.875+00	Screen Recording 2021-06-22 at 10.03.29.mov	video/quicktime	\N	\N	\N
8d2180c3-219d-4d75-95e3-4b9bb412c895	2021-07-07 10:45:58.033+00	audio-recording-1625654757746.webm	audio/webm	\N	\N	\N
f7b79568-e6c8-4569-94fa-a6c3bc594748	2021-07-07 14:11:06.103+00	Screenshot 2021-07-07 at 16.10.39.png	image/png	\N	\N	\N
926fde2c-b7f8-466d-86d4-bcffda51f74b	2021-07-07 17:20:01.354+00	Screenshot 2021-07-07 at 08.16.02.png	image/png	\N	\N	\N
d4ab9a33-f475-421f-b52d-f5df9314d5ed	2021-07-08 07:45:50.086+00	image.png	image/png	\N	\N	\N
de17ad85-6af0-42e9-9c89-cbe36d19bef8	2021-07-08 07:46:30.909+00	124745034-a7600480-df1f-11eb-9f15-9a88644daed3.gif	image/gif	\N	\N	\N
f1aba4ce-c9af-4d47-bc87-c9e77fdf7a87	2021-07-08 08:25:49.55+00	video-recording-1625732749277.x-matroska	video/x-matroska	\N	\N	\N
a0c509b4-042e-4979-aac6-b104c1c90af3	2021-07-08 15:11:54.577+00	124745034-a7600480-df1f-11eb-9f15-9a88644daed3.gif	image/gif	81ebd792-696b-4c55-a7b2-932ef278004f	\N	\N
6870e99e-8e63-44a9-9407-c70c663d74c9	2021-07-08 15:34:26.093+00	Tbrpkwu.jpg	image/jpeg	\N	\N	\N
62db0932-c1a5-422c-93cb-6a52811661e5	2021-07-09 07:24:44.588+00	block2.jpg	image/jpeg	\N	\N	\N
8a8ed034-3295-4c3a-9d9b-58abc5a9e40a	2021-07-09 08:45:30.868+00	Screenshot 2021-07-09 at 10.40.49.png	image/png	c84d43ce-3e24-4188-be68-01ff69875e18	\N	\N
d57e7691-baf8-4d12-8d02-97414cfefc2a	2021-07-09 13:51:29.004+00	image.png	image/png	\N	\N	\N
cd9353f8-646e-41e6-82ca-4d61b8e0d55b	2021-07-12 08:46:04.471+00	Screenshot 2021-07-12 at 10.45.42.png	image/png	dee20560-9862-4264-a71c-7d237cf6a6cb	\N	\N
fab28560-60d7-4936-b131-68bfc62a98e3	2021-08-12 10:03:00.573+00	IMG_1012.jpeg	image/jpeg	\N	ca652ee1-1423-42fe-a0ef-e5761a670845	\N
6415a658-0f44-4a5b-91fd-10ba2962daf9	2021-07-13 08:03:25.951+00	Screenshot 2021-07-13 at 10.02.01.png	image/png	4fb18e0c-1012-4601-a72b-de01fbaa9848	\N	\N
524e4593-529a-4747-995f-e15b98bcbdcb	2021-07-14 09:28:11.952+00	Screen Recording 2021-07-14 at 11.24.42 AM.mov	video/quicktime	daab2e31-9be6-45c7-9754-654df9b43aa3	\N	\N
f4193386-a2c5-471a-81e2-de4191e16b64	2021-07-16 08:40:36.528+00	Screenshot 2021-07-16 at 12.40.21.png	image/png	b1ec2058-ad31-4062-8b09-2fd995f8f6ae	\N	\N
5633530c-70ac-48ae-9d09-377d88dac4fc	2021-07-16 08:41:31.477+00	Screenshot 2021-07-16 at 12.41.19.png	image/png	dc9b1ed3-43eb-4247-a479-b90927ac0a43	\N	\N
a6d59e77-8966-454f-99c9-d66da635f1c2	2021-07-16 12:31:06.033+00	Screenshot 2021-07-16 at 16.30.38.png	image/png	3c432c83-0ae9-43a7-93a5-781b234bf0bb	\N	\N
bc0025ae-b6df-4e64-9af8-a717f8b494a7	2021-07-16 12:39:35.441+00	Screenshot 2021-07-16 at 14.39.24.png	image/png	d4170dec-f44b-41d0-8256-ad50c9e59224	\N	\N
43db7d0d-a016-422a-b3cc-467b32627bbd	2021-07-19 07:33:37+00	Screenshot 2021-07-19 at 11.33.12.png	image/png	67a5b5c4-c35b-495d-9c8a-4b500e71ea62	\N	\N
61e4eb70-6ea4-4d39-9de0-e2f12641d2f5	2021-07-19 13:59:36.129+00	Screenshot 2021-07-19 at 17.59.07.png	image/png	84c713c0-6e5d-437d-833d-c4931419b9f5	\N	\N
95e20694-92a1-4b76-9342-db3800a1b5ab	2021-07-20 07:24:02.95+00	Screenshot 2021-07-20 at 11.23.49.png	image/png	3720914a-29f4-4c22-bc2d-0f73fede8314	\N	\N
56a73445-03d6-4846-a3ec-bac3abfcb0a1	2021-07-20 07:58:13.877+00	right-search-popover.mov	video/quicktime	6b3fd131-0c2d-431b-aefd-eb59d3937403	\N	\N
c1d7c441-6967-4477-a8c2-29c7dcccbc81	2021-07-20 07:59:25.343+00	middle-search-popover.mov	video/quicktime	0fbfc7f0-40a6-40d4-bdaa-015dc73f98cd	\N	\N
e7dd364f-55c0-4bba-a08c-07928b6633d1	2021-07-20 09:19:19.633+00	Bildschirmfoto 2021-07-20 um 11.16.42.png	image/png	c3c6383e-c235-47ce-aac1-11972dfd8e46	\N	\N
a5a8c5e9-ad80-453f-8d3e-aa6916c56a33	2021-07-20 10:17:21.599+00	Screenshot 2021-07-20 at 12.17.16.png	image/png	b1436a13-2686-4d85-860f-45ecac94251e	\N	\N
7af06e74-c5b3-4ca8-ae7a-9371189d1b25	2021-07-21 10:29:22.747+00	Screenshot 2021-07-21 at 12.29.19.png	image/png	4f3f5c4c-9bf3-4589-a359-4cc1abb966cc	\N	\N
7c943409-6e68-4fdf-9ca9-eef658ee7830	2021-07-28 09:08:02.415+00	Screenshot 2021-07-28 at 11.07.35.png	image/png	b52aaa88-5402-4e08-b201-e1c792718933	\N	\N
ac8b9e72-f81a-46e5-837a-3d97052815f8	2021-07-26 11:43:20.437+00	TT-RE-13807-23.07.21.pdf	application/pdf	6c515388-5d55-4741-aaff-d788d17ea43e	\N	\N
1d2a1da5-95aa-475e-86fd-acdc86d97826	2021-07-26 12:14:30.138+00	Bildschirmfoto 2021-07-26 um 14.14.25.png	image/png	1c5b0471-c8cc-4396-bd47-5899ff2cb86e	\N	\N
1e91b40f-8063-4eb3-8ceb-69d93d66898d	2021-07-26 15:57:51.845+00	Screenshot 2021-07-26 at 17.57.48.png	image/png	\N	\N	\N
cf91c152-61ec-44de-8382-5411b8e8ac80	2021-07-28 13:51:45.046+00	Screenshot 2021-07-28 at 17.51.32.png	image/png	6e019389-e226-4e04-8f87-daf41d488440	\N	\N
53320c7e-4f82-4f81-a6b8-4f753fe3d86d	2021-07-28 15:40:37.003+00	Screenshot 2021-07-28 at 17.40.31.png	image/png	a0f339c4-2987-4cce-bf91-8ba54df8aef4	\N	\N
8957e6d8-124c-42b1-bb3e-e64ee2b34f87	2021-07-28 19:33:18.761+00	FOTO.jpeg	image/jpeg	\N	\N	\N
ed03f5c1-34a3-4581-8a67-3367d41c8a14	2021-07-29 12:00:48.375+00	place.jpeg	image/jpeg	7eb738ce-9460-4db8-9284-fa210705c4d1	\N	\N
0293ff34-7866-4b22-8c17-df11c64ac525	2021-07-27 10:20:13.935+00	Screenshot 2021-07-27 at 12.19.58.png	image/png	e77c65d6-dacc-4bc9-bb2a-292c67cb2281	\N	\N
91632f90-6fd3-49f9-a301-b237377ae63f	2021-07-27 10:49:46.014+00	Topic 2.png	image/png	\N	\N	\N
37323865-6d86-4de1-9b48-270de469172f	2021-07-27 10:51:20.486+00	Group 10121753.png	image/png	c14fffc4-db67-448f-ae4b-9bc75cd3b192	\N	\N
b717c535-1d31-49b2-8649-440e6552f2a2	2021-07-27 11:14:38.02+00	image.png	image/png	4bc9a60c-a7f7-4169-a033-c0e5b1f06967	\N	\N
9c42308b-89e9-4ddb-8e0d-fe0eb57513fb	2021-07-30 12:12:03.168+00	Lisa.mp4	video/mp4	d70421ef-f38a-4d50-afae-cdf6e5b83ae0	\N	\N
a2665d1e-e1ac-4278-a58f-98a92fe5a984	2021-08-02 11:10:57.538+00	image.png	image/png	\N	\N	\N
ac22f3fe-adde-4f0e-81c0-c06032dafc23	2021-08-02 13:45:21.592+00	TT-RE-13921-01.08.21.pdf	application/pdf	d4560110-bb22-4cce-8ea7-a6ce07732ed7	\N	\N
0b69c75c-8cd5-49f7-871c-f2d9a8880263	2021-08-03 08:19:10.104+00	cool.gif	image/gif	2926ec9f-6ea5-4673-a2fc-6597be0fe936	\N	\N
46b1d2ac-bbb7-4325-8d20-849a4f281899	2021-08-03 13:20:09.586+00	image.png	image/png	af3f6cba-73a8-4d99-9dc2-b226d31d941c	\N	\N
8b58aebf-e333-4eb4-96f1-cec061896aaa	2021-08-03 16:34:30.085+00	Bildschirmfoto 2021-08-03 um 18.32.13.png	image/png	2f152c4f-9c95-4d42-b202-4fa119405fc0	\N	\N
75dde397-01aa-40c3-9a11-e10bd90b6b4b	2021-08-05 12:06:39.171+00	IMG_1864.jpeg	image/jpeg	\N	\N	\N
437cf237-dc72-423b-9854-f76a66bc3089	2021-08-04 08:47:45.039+00	0.jpeg	image/jpeg	\N	\N	\N
742ce80b-4740-4315-8bd3-cd6342063c45	2021-08-04 08:57:17.331+00	Screen Recording 2021-08-04 at 09.44.16.mov	video/quicktime	2b0500f2-c7cc-4516-961f-434b311f13c8	\N	\N
c76a26a9-9da5-4030-a39a-705294849bce	2021-08-04 12:13:26.493+00	image.png	image/png	91e99ecb-f89d-4b5b-a404-c6325876892f	\N	\N
ea0ceecd-d735-4f99-b552-fefb3badba52	2021-08-04 12:15:08.341+00	image.png	image/png	e5a23fcb-1a1e-4494-ace6-8a036a96e140	\N	\N
7d7324d5-9bca-4326-9fd7-d6b798ccb7c0	2021-08-04 14:12:17.723+00	Screenshot 2021-08-04 at 16.12.11.png	image/png	0d35d217-432c-4ab9-bd3c-54b5a462b0fc	\N	\N
e2ff4c61-98d7-4dc9-8444-299da6f3ad90	2021-08-09 09:10:12.936+00	Screenshot 2021-08-09 at 13.10.03.png	image/png	ad804eb9-d31d-4311-aeeb-5e46de6e1802	\N	\N
a3279699-7a46-4bd3-b49c-136f73372616	2021-08-09 13:34:46.396+00	opengraph-sitecover.png	image/png	da97bc0e-fa4a-4858-bebb-f2a61aff6ad1	\N	\N
49ef3da6-f884-46b8-ba44-c6f6e9cffd5a	2021-08-09 14:21:01.548+00	a3279699-7a46-4bd3-b49c-136f73372616.png	image/png	cf83de78-071e-41a8-b0f0-49772bd1e8c3	\N	\N
e4c3a2d2-c720-48f8-a4ad-3aa4e56043f2	2021-08-09 14:37:48.744+00	Screenshot 2021-08-09 at 16.36.30.png	image/png	84d9554f-a4e8-4f32-becd-b98a635772fe	\N	\N
6c25e13e-debd-4786-833a-90415133f080	2021-08-10 06:11:52.899+00	Screenshot 2021-08-10 at 10.11.41.png	image/png	b56e974a-eba7-4919-95cc-7cf996edbc85	\N	\N
597ee57c-5f29-4583-a5bb-e77da1bb3418	2021-08-10 08:24:37.318+00	Screenshot 2021-08-10 at 11.23.52.png	image/png	\N	\N	\N
4e02671b-6ee9-44e3-8952-52d8d69e25ee	2021-08-10 08:50:01.344+00	Screenshot 2021-08-10 at 10.49.59.png	image/png	93195862-d0b6-4e9a-96aa-07a94adaef7f	\N	\N
f7183332-1e98-44c1-ba71-50ed59abe7e3	2021-08-10 12:21:41.587+00	Screen Recording 2021-08-10 at 14.20.16.mov	video/quicktime	f48e65ff-5f72-419d-963d-5ba5a27764d3	\N	\N
c12135a6-6c66-4966-8e74-0c30cf10b2a6	2021-08-11 10:01:45.382+00	Screenshot 2021-08-11 at 12.01.03.png	image/png	6a8ba696-5e4b-44f9-b547-91a4d0e07aa3	\N	\N
96b80404-3322-43e6-a793-ec106ecff24d	2021-08-11 11:53:18.467+00	Screenshot 2021-08-11 at 13.53.13.png	image/png	14de21ec-e84d-4ce0-8e7a-19de1442837b	\N	\N
079f0170-fb10-41fd-b16c-e6c493cdee0e	2021-08-11 12:25:53.285+00	IMAGE 2021-08-11 15:25:51.jpg	image/jpeg	f2689615-7043-4f29-a4e7-a741aaec3f9e	\N	\N
2b1e990f-8230-45b2-a917-774dce4e02dd	2021-08-11 12:51:35.42+00	cool.gif	image/gif	65f814cc-bbe8-40cc-b382-19485fc80501	69324499-ae41-4ce4-bdaa-6072e0e5c2d3	\N
1f9249d9-ae59-4c19-a66a-5f7bdea45a66	2021-08-11 13:01:18.225+00	Screenshot 2021-08-11 at 15.01.15.png	image/png	ed381feb-41df-4cc9-81b6-07e4b0760277	600ccd3a-a513-4a4a-864b-e00bfc9699f9	\N
4b21a5d0-657d-43bf-a141-f5c027074ef0	2021-08-11 13:50:25.438+00	Screen Shot 2021-03-24 at 9.28.19 AM.png	image/png	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	\N
8d2eff1d-b19e-49d8-845f-3775ff70ec3b	2021-08-11 13:51:04.166+00	ummeldung.jpg	image/jpeg	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	\N
d7d719b4-166f-437c-a988-9c74fea2469a	2021-08-12 08:15:00.141+00	Screenshot 2021-08-12 at 12.14.50.png	image/png	8a70e43a-ce1f-40ad-be0c-e6299893dbdb	ca652ee1-1423-42fe-a0ef-e5761a670845	\N
cddd023a-f60a-4a95-b114-7e11555de4ee	2021-08-12 09:17:15.115+00	Screenshot 2021-08-12 at 12.16.23.png	image/png	02d42d3e-7817-4d18-8ab1-7c6b7dd4cdf9	7a90bccb-346e-4933-aaeb-cdef732be976	\N
bdc539d7-9e49-4e6c-8424-8bebc0b1bf59	2021-08-12 09:57:19.63+00	image.png	image/png	\N	ca652ee1-1423-42fe-a0ef-e5761a670845	\N
0385290b-a617-47ff-805b-079704c184bc	2021-08-12 09:58:15.932+00	image.png	image/png	\N	ca652ee1-1423-42fe-a0ef-e5761a670845	\N
d22c5204-3ec0-49d7-a20b-da91d5dcb7ee	2021-08-12 10:05:51.802+00	Screen Recording 2021-08-12 at 14.05.26.mov	video/quicktime	\N	ca652ee1-1423-42fe-a0ef-e5761a670845	\N
33910d6c-1cb7-4813-ab8e-1edd6872e8b8	2021-08-12 10:38:21.281+00	Screen Recording 2021-08-12 at 14.05.26.mov	video/quicktime	\N	ca652ee1-1423-42fe-a0ef-e5761a670845	\N
148622ad-55b9-4742-a224-5e1c7a2a9090	2021-08-12 11:09:18.016+00	Screen Recording 2021-08-12 at 14.05.26.mov	video/quicktime	\N	ca652ee1-1423-42fe-a0ef-e5761a670845	\N
5412a74a-6376-4a38-9e54-db653d934a6c	2021-08-12 19:08:53.413+00	Screenshot 2021-08-12 at 22.08.44.png	image/png	b3fb5f43-5645-445c-abbc-79a5fe786607	7a90bccb-346e-4933-aaeb-cdef732be976	\N
9cff13c5-6e8d-498a-ad96-5f41daf57454	2021-08-13 08:35:03.815+00	image.png	image/png	\N	ca652ee1-1423-42fe-a0ef-e5761a670845	\N
17a80166-25bc-413e-a827-5976375d8c5d	2021-08-13 08:36:37.194+00	Screen Recording 2021-08-13 at 12.36.16.mov	video/quicktime	\N	ca652ee1-1423-42fe-a0ef-e5761a670845	\N
e5d5c1a9-4698-4382-875f-c95aa61e3aa0	2021-08-13 08:37:53.708+00	Screen Recording 2021-08-13 at 12.36.16.mov	video/quicktime	12e742ff-782d-4f67-87ac-79a4d562034f	ca652ee1-1423-42fe-a0ef-e5761a670845	\N
eb63c8e5-4965-430a-a14c-5010a5557926	2021-08-13 09:43:20.157+00	Screenshot 2021-08-13 at 11.43.14.png	image/png	e92fa2b1-38cb-4c79-a480-0ac954a1871c	f30de478-b560-47f5-8588-8062ffc64a25	\N
40555927-f19a-43f8-97f1-ffa23def8a90	2021-08-13 09:48:47.079+00	Screen Recording 2021-08-13 at 12.36.16.mov	video/quicktime	\N	ca652ee1-1423-42fe-a0ef-e5761a670845	\N
9bff5b06-5083-466a-93c8-303867ff81ca	2021-08-13 11:01:16.484+00	video-recording-1628852476400.webm	video/webm	3e7f4cb4-d26f-4d98-ace2-09d980921d00	600ccd3a-a513-4a4a-864b-e00bfc9699f9	e423ae04-9f94-4a08-b7e7-798daad60ffe
\.


--
-- Data for Name: space; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.space (id, name, creator_id, team_id, slug) FROM stdin;
c1ddb887-3877-418f-90d2-ae219bf80385	Acapela team	f30de478-b560-47f5-8588-8062ffc64a25	68246df6-08b9-4555-9e2a-55eba2ae3ad3	acapela-team
bf93dbe8-1c6d-447f-8343-debd812a3519	UX Research	25db9c19-f84e-40d8-9dfb-ee94478ca40a	68246df6-08b9-4555-9e2a-55eba2ae3ad3	ux-research
bbafe64e-d4aa-40a8-8345-e4d2a90cecf9	Engineering	ca652ee1-1423-42fe-a0ef-e5761a670845	68246df6-08b9-4555-9e2a-55eba2ae3ad3	product-features
8411965c-1b83-41df-a090-904777ee199f	Hiring	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	68246df6-08b9-4555-9e2a-55eba2ae3ad3	hiring
4d2d08e5-03a7-49f1-a7d8-69a30e7d5026	Growth	f30de478-b560-47f5-8588-8062ffc64a25	68246df6-08b9-4555-9e2a-55eba2ae3ad3	marketing
1ff2fe4d-70a9-429a-b122-0a0c005ea33e	Design 	600ccd3a-a513-4a4a-864b-e00bfc9699f9	68246df6-08b9-4555-9e2a-55eba2ae3ad3	acapela-design
d02ec7e4-109b-4888-a98b-8c9bccccc7a5	Customers	25db9c19-f84e-40d8-9dfb-ee94478ca40a	68246df6-08b9-4555-9e2a-55eba2ae3ad3	customers
817fe305-f868-4bb0-a9fb-fc15b70ba296	Product	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	68246df6-08b9-4555-9e2a-55eba2ae3ad3	product
929fb8af-5f77-44be-a1f4-f8cee0929456	Ops & Finance	f30de478-b560-47f5-8588-8062ffc64a25	68246df6-08b9-4555-9e2a-55eba2ae3ad3	ops-and-finance
\.


--
-- Data for Name: room; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.room (id, creator_id, name, created_at, deadline, notification_job_id, summary, finished_at, space_id, slug, source_google_calendar_event_id, is_private, last_activity_at, owner_id) FROM stdin;
4e21d822-4052-491d-a106-6e85ffa7e1b7	f30de478-b560-47f5-8588-8062ffc64a25	Daily Standup	2021-06-08 15:43:58.526815+00	2021-12-31 09:00:00+00	\N	\N	\N	c1ddb887-3877-418f-90d2-ae219bf80385	daily-standup	\N	f	2021-08-13 12:52:56.228+00	f30de478-b560-47f5-8588-8062ffc64a25
c6d65e11-d335-4ab4-9d46-7ed3d9760c06	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	Improving accountability	2021-07-28 15:17:00.066347+00	2021-08-11 15:00:00+00	\N	\N	\N	817fe305-f868-4bb0-a9fb-fc15b70ba296	improving-accountability	\N	f	2021-08-11 09:22:52.255+00	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
91b35e7f-66f0-470f-b208-47f89ebd3771	25db9c19-f84e-40d8-9dfb-ee94478ca40a	TestingTime	2021-07-26 10:30:40.764709+00	2021-08-02 10:00:00+00	\N	\N	\N	929fb8af-5f77-44be-a1f4-f8cee0929456	testingt	\N	f	2021-08-13 12:02:37.66+00	25db9c19-f84e-40d8-9dfb-ee94478ca40a
afecb492-3666-4c8d-bf09-950723c0c04c	600ccd3a-a513-4a4a-864b-e00bfc9699f9	Test Room	2021-07-28 10:07:26.640489+00	2021-08-04 10:00:00+00	\N	\N	2021-07-28 11:15:50.906+00	817fe305-f868-4bb0-a9fb-fc15b70ba296	test-room	\N	f	\N	600ccd3a-a513-4a4a-864b-e00bfc9699f9
4a4c995d-bbb4-4573-b170-db617d336b7b	f30de478-b560-47f5-8588-8062ffc64a25	Team Product Session (3 August)	2021-08-03 07:24:18.505831+00	2021-08-03 14:00:00+00	\N		2021-08-03 15:19:15.894+00	c1ddb887-3877-418f-90d2-ae219bf80385	team-product-session-3-august	3pmcu6loohbrdrokbrard9otuk_20210803T140000Z	f	\N	f30de478-b560-47f5-8588-8062ffc64a25
5fcf1905-d2cd-495f-9080-56fe218949b6	25db9c19-f84e-40d8-9dfb-ee94478ca40a	Website: visual direction checkin	2021-08-03 09:38:48.686937+00	2021-08-12 08:00:00+00	\N	\N	\N	1ff2fe4d-70a9-429a-b122-0a0c005ea33e	website-visual-direction-checkin	23r4aojb1euhjvaba0fqm3l0t9	f	2021-08-12 17:41:32.512+00	25db9c19-f84e-40d8-9dfb-ee94478ca40a
6d2dce9f-bbb3-42f8-ab65-e6582e2ec894	7879f271-4036-48be-befb-f08de052bcdc	Weekly Knowledge Sharing Session	2021-08-11 07:48:28.916995+00	2021-08-11 17:00:00+00	\N		2021-08-11 15:11:21.736+00	bbafe64e-d4aa-40a8-8345-e4d2a90cecf9	weekly-knowledge-sharing-session	4t8v5k8ql6ok0ceqgurs01s702_20210811T140000Z	f	2021-08-11 15:11:22.398+00	7879f271-4036-48be-befb-f08de052bcdc
5b2a4c7a-2b4f-4cf0-9591-f91a8454722b	25db9c19-f84e-40d8-9dfb-ee94478ca40a	New website: next steps	2021-08-02 09:34:40.615411+00	2021-08-03 08:00:00+00	\N	\N	2021-08-03 09:34:35.226+00	1ff2fe4d-70a9-429a-b122-0a0c005ea33e	new-website-next-steps	28bqrm8dbmub4sqmfh75qq2vaj	f	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
d8ad568e-e0b7-424a-84d4-09e1e3105e37	25db9c19-f84e-40d8-9dfb-ee94478ca40a	Website concept adjustments	2021-08-02 12:06:15.869438+00	2021-08-02 15:00:00+00	\N	\N	2021-08-03 15:13:25.814+00	1ff2fe4d-70a9-429a-b122-0a0c005ea33e	website-concept-adjustments	4tq1q3r0h3355gisus75lvm3do	f	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
f61f40f0-4ece-419c-a554-d659ac990ba7	600ccd3a-a513-4a4a-864b-e00bfc9699f9	Team Room	2021-08-08 18:05:47.662656+00	2021-08-09 18:00:00+00	\N	\N	\N	c1ddb887-3877-418f-90d2-ae219bf80385	team-room	\N	f	2021-08-13 07:12:31.142+00	600ccd3a-a513-4a4a-864b-e00bfc9699f9
54afb680-f7ad-4ac3-973e-a1a53c4b7c68	82f57a9f-6615-4527-816f-31ee7a0b7c98	Landing page v2	2021-07-21 09:34:31.381691+00	2021-07-23 16:00:00+00	\N		2021-08-09 14:23:30.688+00	1ff2fe4d-70a9-429a-b122-0a0c005ea33e	landing-page-v2	\N	f	2021-08-09 14:23:38.53+00	82f57a9f-6615-4527-816f-31ee7a0b7c98
bc605602-de72-4582-80bf-426980cfc9e3	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	Product design & UX research	2021-08-04 07:05:01.716454+00	2021-08-11 07:00:00+00	\N	\N	\N	1ff2fe4d-70a9-429a-b122-0a0c005ea33e	product-design-and-ux-research	\N	f	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
27a44750-24d1-4aa5-b3c2-e2bb4c9be61e	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	Acapela QA	2021-07-28 08:58:54.653551+00	2021-08-04 08:00:00+00	\N	\N	2021-08-12 13:13:08.177+00	817fe305-f868-4bb0-a9fb-fc15b70ba296	qa-acapela	\N	f	2021-08-12 13:13:13.927+00	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
8e4ce16b-d503-4077-869e-fa0eb955e555	25db9c19-f84e-40d8-9dfb-ee94478ca40a	Team Product Session (10 Aug)	2021-08-04 13:26:21.894662+00	2021-08-12 14:00:00+00	\N	\N	2021-08-12 14:43:51.825+00	c1ddb887-3877-418f-90d2-ae219bf80385	team-product-session-10-aug	3pmcu6loohbrdrokbrard9otuk_20210810T140000Z	f	2021-08-12 14:43:53.007+00	25db9c19-f84e-40d8-9dfb-ee94478ca40a
51c4135e-d3cc-43f9-b247-85ff13feb946	ca652ee1-1423-42fe-a0ef-e5761a670845	Reply to individual messages	2021-06-21 07:37:33.751808+00	2021-06-28 07:00:00+00	\N		2021-06-21 08:15:22.524+00	bbafe64e-d4aa-40a8-8345-e4d2a90cecf9	reply-to-individual-messages	\N	f	\N	ca652ee1-1423-42fe-a0ef-e5761a670845
c4090fab-3806-4e4a-b190-63b787c32bb3	25db9c19-f84e-40d8-9dfb-ee94478ca40a	Team Product Session (1 July)	2021-07-01 10:51:42.702046+00	2021-07-01 15:00:00+00	\N		2021-07-01 15:35:46.829+00	c1ddb887-3877-418f-90d2-ae219bf80385	team-product-session-1-july	k998a0mk1v3bjbcdpt6nj45b3s_20210701T150000Z	f	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
b5b83152-fa39-4d21-a9b5-d6c5d9f41d51	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	Features in design progress	2021-06-25 12:45:23.03191+00	2021-07-02 12:00:00+00	\N		2021-07-05 16:25:22.18+00	1ff2fe4d-70a9-429a-b122-0a0c005ea33e	features-in-progress-design	\N	f	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
1d8ff61c-35fe-4dfd-abd8-d25fc52d2264	f30de478-b560-47f5-8588-8062ffc64a25	Team Product Session (24 Jun)	2021-06-24 09:20:34.365175+00	2021-06-24 12:00:00+00	\N	\N	2021-07-05 16:48:16.541+00	c1ddb887-3877-418f-90d2-ae219bf80385	team-product-session-24-jun	\N	f	\N	f30de478-b560-47f5-8588-8062ffc64a25
e3c59b5b-e8a1-4cdc-95a2-569c9ff699b7	82f57a9f-6615-4527-816f-31ee7a0b7c98	Dev & Product & Design Sync	2021-07-05 08:39:05.440644+00	2021-07-05 13:00:00+00	\N		2021-07-06 08:11:22.488+00	c1ddb887-3877-418f-90d2-ae219bf80385	dev-and-product-and-design-sync	0c4u3qtpedo68h0d2h4pl9pufv	f	\N	82f57a9f-6615-4527-816f-31ee7a0b7c98
f0308c63-7a5b-4579-81fd-802275088b00	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	Design hire	2021-07-06 08:58:29.345921+00	2021-07-09 15:00:00+00	\N	\N	\N	8411965c-1b83-41df-a090-904777ee199f	design-hire	\N	f	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
e88139a9-b2cc-4592-bc7c-1789169de498	82f57a9f-6615-4527-816f-31ee7a0b7c98	Feedback/Q&A for new UI v2	2021-07-06 11:49:43.942073+00	2021-07-07 11:45:00+00	\N	\N	\N	c1ddb887-3877-418f-90d2-ae219bf80385	ui-improvements	\N	f	\N	82f57a9f-6615-4527-816f-31ee7a0b7c98
8ecb77a0-b1cd-4070-b184-fe7d96acab43	f30de478-b560-47f5-8588-8062ffc64a25	Team Product Session (10 Jun)	2021-06-09 09:23:56.547971+00	2021-06-10 15:00:00+00	\N		2021-07-05 16:48:44.229+00	c1ddb887-3877-418f-90d2-ae219bf80385	team-product-session-10-june	\N	f	\N	f30de478-b560-47f5-8588-8062ffc64a25
d1762c9b-d55e-4034-baf0-04cd28a79452	69324499-ae41-4ce4-bdaa-6072e0e5c2d3	E2E testing	2021-07-27 10:02:29.296286+00	2021-08-06 10:00:00+00	\N	\N	2021-08-11 07:53:05.332+00	bbafe64e-d4aa-40a8-8345-e4d2a90cecf9	e2e-testing	\N	f	2021-08-11 07:53:05.779+00	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
e880dda2-9fa8-418f-9d3c-452225126c65	f30de478-b560-47f5-8588-8062ffc64a25	Weekly Recap + Planning	2021-08-13 07:10:36.549203+00	2021-08-13 09:30:00+00	\N	\N	\N	c1ddb887-3877-418f-90d2-ae219bf80385	weekly-recap-planning	fkr9jcba3r6ialfdcgfmf9qfc0_20210813T093000Z	f	2021-08-13 15:41:34.632+00	f30de478-b560-47f5-8588-8062ffc64a25
385c3cc5-ac05-4913-91c1-a7560cefdc93	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	Onsite experiment week 	2021-08-12 13:14:52.64648+00	2021-08-20 13:30:00+00	\N	\N	\N	817fe305-f868-4bb0-a9fb-fc15b70ba296	onsite-experiment-week	\N	f	2021-08-13 15:41:58.912+00	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
76d33092-f62b-49cc-aa9c-00ca0dd3b943	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	Testing room	2021-06-25 14:25:43.553417+00	2021-07-02 13:30:00+00	\N	\N	\N	bbafe64e-d4aa-40a8-8345-e4d2a90cecf9	testing-room	\N	f	2021-08-13 15:25:46.506+00	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
5ed709d5-d6b3-4d86-a26a-f847f88a0a57	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	Daily UX/UI queries from developers	2021-07-15 07:43:22.575267+00	2021-07-22 07:00:00+00	\N	\N	\N	1ff2fe4d-70a9-429a-b122-0a0c005ea33e	daily-ux-ui-queries-from-developers	\N	f	2021-08-13 15:47:41.57+00	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
8f9e0e7e-4b81-452e-be93-e93c14d26941	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	Product OKRs	2021-07-08 16:17:11.66678+00	2021-07-15 16:00:00+00	\N	\N	2021-08-04 07:29:06.117+00	1ff2fe4d-70a9-429a-b122-0a0c005ea33e	v4-product-okrs	\N	f	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
e6bca11a-3e53-4881-b2fa-b48d579814c2	f30de478-b560-47f5-8588-8062ffc64a25	User Acquisition	2021-07-09 08:39:08.293496+00	2021-07-16 08:00:00+00	\N	\N	\N	4d2d08e5-03a7-49f1-a7d8-69a30e7d5026	user-acquisition	\N	f	2021-08-11 10:10:40.511+00	f30de478-b560-47f5-8588-8062ffc64a25
4b2b3985-299c-42b3-8546-3c52f4ba8484	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	OAuth Scopes Demo	2021-06-28 20:03:19.522986+00	2021-06-29 20:00:00+00	\N		2021-06-28 20:06:24.784+00	bbafe64e-d4aa-40a8-8345-e4d2a90cecf9	oauth-scopes-demo	\N	f	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
1a140e97-fccd-4918-bd3f-8291e8649872	82f57a9f-6615-4527-816f-31ee7a0b7c98	Landing page 	2021-06-24 08:01:51.392755+00	2021-06-25 16:00:00+00	\N		2021-06-30 13:02:33.427+00	1ff2fe4d-70a9-429a-b122-0a0c005ea33e	landing-page	\N	f	\N	82f57a9f-6615-4527-816f-31ee7a0b7c98
7ccbdcfd-04f2-45bb-9c42-67a29ff581cb	7a90bccb-346e-4933-aaeb-cdef732be976	Room Closure Flow	2021-06-11 07:46:17.346519+00	2021-06-11 10:00:00+00	\N	This is the most meta Room Summary we'll probably ever get. The closing notes here are possible due to the conclusions that we arrived in this acapela 🎉	2021-06-16 14:43:22.241+00	c1ddb887-3877-418f-90d2-ae219bf80385	room-closure-flow	\N	f	\N	7a90bccb-346e-4933-aaeb-cdef732be976
2a28f67a-0f19-4989-a354-1511e4fc48c5	600ccd3a-a513-4a4a-864b-e00bfc9699f9	Figma File Setup	2021-06-21 10:08:04.822513+00	2021-06-22 07:00:00+00	\N		2021-06-23 14:10:06.471+00	1ff2fe4d-70a9-429a-b122-0a0c005ea33e	figma-file-setup	\N	f	\N	600ccd3a-a513-4a4a-864b-e00bfc9699f9
28df10bc-90db-4e7b-bd67-d2a864f9e964	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	Features ideas	2021-07-27 10:16:39.965049+00	2021-08-03 10:00:00+00	\N	\N	\N	817fe305-f868-4bb0-a9fb-fc15b70ba296	notion-on-acapela	\N	f	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
2fadf5ac-dfb9-4e11-9f4b-47596eff2e57	25db9c19-f84e-40d8-9dfb-ee94478ca40a	Concept & Usability Testing June 2021	2021-06-11 09:03:12.935872+00	2021-06-18 09:00:00+00	\N		2021-06-24 15:37:17.487+00	bf93dbe8-1c6d-447f-8343-debd812a3519	concept-and-usability-testing-june-2021	\N	f	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
f95e7a04-5ef4-47a6-9dcf-b7504e330c09	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	OAuth Scopes	2021-06-21 08:23:11.181306+00	2021-06-28 08:00:00+00	\N	Will push live with all mentioned scopes.	2021-06-25 07:25:34.168+00	bbafe64e-d4aa-40a8-8345-e4d2a90cecf9	oauth-scopes	\N	f	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
7bb63491-df1e-414c-9b5a-909d5ceb0e6a	ca652ee1-1423-42fe-a0ef-e5761a670845	Emoji Reactions	2021-06-25 08:24:29.125516+00	2021-07-02 08:00:00+00	\N	\N	2021-06-28 05:37:38.697+00	bbafe64e-d4aa-40a8-8345-e4d2a90cecf9	emoji-reactions	\N	f	\N	ca652ee1-1423-42fe-a0ef-e5761a670845
742634cf-bc44-43df-a1e2-c5e087c2e116	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	123 test	2021-08-12 14:03:32.571645+00	2021-08-13 14:00:00+00	\N	\N	2021-08-12 14:04:26.497+00	c1ddb887-3877-418f-90d2-ae219bf80385	123-test	\N	f	2021-08-12 14:04:27.01+00	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
1a65696f-6a49-46c4-a2f9-f55e23dc4216	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	🎨 Design rolling 	2021-07-06 07:38:44.089698+00	2021-09-30 07:00:00+00	\N	\N	2021-07-21 15:23:51.33+00	1ff2fe4d-70a9-429a-b122-0a0c005ea33e	daily-design-check-in	\N	f	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
0c048987-788e-44a8-9e29-f7575949c9a5	25db9c19-f84e-40d8-9dfb-ee94478ca40a	Britta & Roland: Discuss Loom Research	2021-07-06 09:48:17.372899+00	2021-07-07 14:30:00+00	\N		2021-07-07 14:48:20.983+00	bf93dbe8-1c6d-447f-8343-debd812a3519	britta-and-roland-discuss-loom-research	_8gqjcca38h0jab9n61132b9k6gq4ab9p60sj6b9j84r36ci169338e1o84	f	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
bc62103c-e9fa-4993-9f83-95ccaecdda0f	25db9c19-f84e-40d8-9dfb-ee94478ca40a	Loom Exploration Research	2021-06-28 12:56:51.487904+00	2021-07-05 12:00:00+00	\N		2021-07-07 14:10:28.579+00	bf93dbe8-1c6d-447f-8343-debd812a3519	loom-exploration	\N	f	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
71636fe8-50fb-4e33-a017-9dfed71803ab	25db9c19-f84e-40d8-9dfb-ee94478ca40a	Onboarding Calls	2021-07-07 15:41:24.257579+00	2021-07-14 15:00:00+00	\N	\N	\N	d02ec7e4-109b-4888-a98b-8c9bccccc7a5	onboarding-calls	\N	f	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
1f9c3223-79fc-4901-97ce-c846be025404	25db9c19-f84e-40d8-9dfb-ee94478ca40a	Marketing crisis meeting 	2021-07-07 15:53:59.501613+00	2021-07-09 08:00:00+00	\N		2021-07-09 08:38:35.354+00	4d2d08e5-03a7-49f1-a7d8-69a30e7d5026	marketing-crisis-meeting	67h8485g14cmoo11urj7cpankl	f	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
bbb0faf5-990f-4222-aab2-21763a857957	f30de478-b560-47f5-8588-8062ffc64a25	Team Product Session (8 July)	2021-07-06 11:56:50.257713+00	2021-07-08 16:00:00+00	\N		2021-07-09 08:58:37.703+00	c1ddb887-3877-418f-90d2-ae219bf80385	team-product-session-8-jul	\N	f	\N	f30de478-b560-47f5-8588-8062ffc64a25
b3172b1c-fa67-472e-aa15-81952f282864	82f57a9f-6615-4527-816f-31ee7a0b7c98	Landing page v2 	2021-06-30 13:07:28.280165+00	2021-07-07 13:00:00+00	\N	\N	2021-07-21 09:19:39.234+00	1ff2fe4d-70a9-429a-b122-0a0c005ea33e	landing-page-2	\N	f	\N	82f57a9f-6615-4527-816f-31ee7a0b7c98
3c15419b-a818-4680-9e64-10f8596c8d58	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	Weekly Knowledge Sharing Session (4th Aug)	2021-08-04 10:10:12.8778+00	2021-08-04 14:00:00+00	\N	\N	2021-08-04 15:13:11.138+00	bbafe64e-d4aa-40a8-8345-e4d2a90cecf9	weekly-knowledge-sharing-session-4th-aug	4t8v5k8ql6ok0ceqgurs01s702_20210804T140000Z	f	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
e078b152-a8ef-4cda-9bfa-388b2ddfe27d	600ccd3a-a513-4a4a-864b-e00bfc9699f9	Quick discussion: how to deal with critical bugs?	2021-07-12 09:47:36.362785+00	2021-07-12 10:15:00+00	\N		2021-07-12 11:46:35.304+00	bf93dbe8-1c6d-447f-8343-debd812a3519	quick-discussion-how-to-deal-with-critical-bugs	_8ko3aha56h1jeba3850jcb9k8gq46ba26gq3gb9i6t24cd256sq44ca48o	f	\N	600ccd3a-a513-4a4a-864b-e00bfc9699f9
03ea9cdd-e3a3-4f10-af7d-936b39b1d97c	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	Notifications	2021-07-19 09:21:08.752159+00	2021-07-26 09:00:00+00	\N	\N	\N	817fe305-f868-4bb0-a9fb-fc15b70ba296	notifications	\N	f	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
22fe34a9-e1c4-42f7-b611-4bb52ee35313	7a90bccb-346e-4933-aaeb-cdef732be976	Test	2021-07-12 14:03:10.702945+00	2021-07-13 14:00:00+00	\N	\N	2021-07-12 14:03:49.626+00	bbafe64e-d4aa-40a8-8345-e4d2a90cecf9	test	\N	f	\N	7a90bccb-346e-4933-aaeb-cdef732be976
ac29a6fb-cade-4cfe-8ef1-f163334abfdc	600ccd3a-a513-4a4a-864b-e00bfc9699f9	Kickoff: Planning Review & Ways to Improve	2021-07-12 12:01:26.807688+00	2021-07-12 13:00:00+00	\N	\N	2021-08-02 08:37:23.153+00	c1ddb887-3877-418f-90d2-ae219bf80385	kickoff-planning-review-and-ways-to-improve	_690k6h256d23eb9l6ks3eb9k8ko42ba26d24cba1750k4c1j8d13cd1o64llkjqf9l6kahak9574ejil9l14akhq6ss3icpm6csj0d9l68	f	\N	600ccd3a-a513-4a4a-864b-e00bfc9699f9
0fe6380c-f7eb-4652-a4cc-fd778a4a36b5	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	Improving user onboarding	2021-07-23 13:38:48.191234+00	2021-07-30 13:00:00+00	\N	\N	\N	817fe305-f868-4bb0-a9fb-fc15b70ba296	improving-user-onboarding	\N	f	2021-08-13 09:50:35.583+00	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
5c4fe2d8-3533-4f60-bfca-c9b8a95c210d	25db9c19-f84e-40d8-9dfb-ee94478ca40a	Team Product Session (20 July)	2021-07-13 15:26:08.089045+00	2021-07-20 14:00:00+00	\N		2021-07-20 14:42:18.763+00	c1ddb887-3877-418f-90d2-ae219bf80385	team-product-session-20-july	3pmcu6loohbrdrokbrard9otuk_20210720T140000Z	f	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
2b1c54a6-60cc-4624-a655-938858d3af2c	f30de478-b560-47f5-8588-8062ffc64a25	Team Product Session (13 July)	2021-07-13 11:28:04.813535+00	2021-07-13 14:00:00+00	\N		2021-07-13 15:49:24.956+00	c1ddb887-3877-418f-90d2-ae219bf80385	team-product-session-13-july	3pmcu6loohbrdrokbrard9otuk_20210713T140000Z	f	\N	f30de478-b560-47f5-8588-8062ffc64a25
5fff4746-afc9-41db-b296-239b2f5e647f	ca652ee1-1423-42fe-a0ef-e5761a670845	Participants Management	2021-07-19 06:54:50.821814+00	2021-07-26 06:00:00+00	\N	\N	2021-08-03 10:55:54.938+00	bbafe64e-d4aa-40a8-8345-e4d2a90cecf9	participants-management	\N	f	\N	ca652ee1-1423-42fe-a0ef-e5761a670845
f435c12a-ad27-44e3-a464-4fd9c7e007e0	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	test test test	2021-07-20 13:28:38.411632+00	2021-07-27 13:00:00+00	\N		2021-07-20 13:30:47.142+00	1ff2fe4d-70a9-429a-b122-0a0c005ea33e	test-test-test	\N	f	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
b888515c-9ed8-4198-92dd-2b930417e61e	25db9c19-f84e-40d8-9dfb-ee94478ca40a	Retention and Tracking	2021-07-20 09:18:32.791424+00	2021-07-27 09:00:00+00	\N	\N	\N	d02ec7e4-109b-4888-a98b-8c9bccccc7a5	retention-and-tracking	\N	f	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
e9fbf9f5-8aaa-4ff7-8905-b10b23b93902	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	Testing	2021-07-21 10:34:07.176189+00	2021-07-28 10:00:00+00	\N	\N	2021-07-21 10:38:22.624+00	1ff2fe4d-70a9-429a-b122-0a0c005ea33e	testing	\N	f	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
048e2d5a-7db4-4997-9b3e-195b44c55710	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	Q3 Planning	2021-07-21 14:04:40.586693+00	2021-07-28 14:00:00+00	\N	\N	2021-07-23 07:56:46.008+00	1ff2fe4d-70a9-429a-b122-0a0c005ea33e	q3-planning	\N	f	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
7461fe76-712a-4bb7-9442-983101dfc281	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	Friday test	2021-07-30 07:52:34.653854+00	2021-08-06 07:00:00+00	\N	\N	2021-07-30 08:00:09.346+00	1ff2fe4d-70a9-429a-b122-0a0c005ea33e	friday-test	\N	f	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
a0f2285e-336a-4155-83a0-bc79fb27e670	f30de478-b560-47f5-8588-8062ffc64a25	Team Product Session (27 July)	2021-07-27 07:33:27.287172+00	2021-07-27 14:00:00+00	\N		2021-07-30 15:46:56.614+00	c1ddb887-3877-418f-90d2-ae219bf80385	team-product-session-27-july	3pmcu6loohbrdrokbrard9otuk_20210727T140000Z	f	\N	f30de478-b560-47f5-8588-8062ffc64a25
3fe4ae05-2ad1-4409-b487-b09c015c361c	7a90bccb-346e-4933-aaeb-cdef732be976	Themes PR Convo	2021-07-22 20:34:27.398519+00	2021-07-23 20:30:00+00	\N		2021-08-02 11:40:45.728+00	bbafe64e-d4aa-40a8-8345-e4d2a90cecf9	themes	\N	f	\N	7a90bccb-346e-4933-aaeb-cdef732be976
b1e4d74b-916e-44cd-a8ce-cc685927058c	600ccd3a-a513-4a4a-864b-e00bfc9699f9	Website: Checkin & next steps	2021-08-08 18:34:19.61291+00	2021-08-09 08:00:00+00	\N	\N	2021-08-09 08:01:31.597+00	1ff2fe4d-70a9-429a-b122-0a0c005ea33e	website-checkin-and-next-steps	_8cr44da26p34cba16h2k6b9k8kskaba160okab9p6kqj8dhl892jagq28kllkjqf9l6kahak9574ejil9l14akhq6ssjed1k6cpjidpk6g	f	2021-08-09 08:01:31.748+00	600ccd3a-a513-4a4a-864b-e00bfc9699f9
79b7cb5f-f9f8-454e-967d-37cea8a81739	7879f271-4036-48be-befb-f08de052bcdc	Auto PR assign	2021-08-03 08:25:50.113621+00	2021-08-05 08:00:00+00	\N		2021-08-03 10:54:00.575+00	bbafe64e-d4aa-40a8-8345-e4d2a90cecf9	codeowners	\N	f	\N	7879f271-4036-48be-befb-f08de052bcdc
080b882d-03e2-4aaa-b058-eec287d29486	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	Production releases	2021-08-03 09:05:53.731105+00	2021-08-10 09:00:00+00	\N	\N	2021-08-03 16:32:04.897+00	bbafe64e-d4aa-40a8-8345-e4d2a90cecf9	production-releases	\N	f	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
3f502912-011c-4bd3-8af5-714a47bd7bfb	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	UI development	2021-07-05 13:09:30.821514+00	2021-07-12 13:00:00+00	\N	\N	2021-08-12 13:32:26.842+00	1ff2fe4d-70a9-429a-b122-0a0c005ea33e	ui-development	\N	f	2021-08-12 13:32:27.548+00	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
fe514238-04d9-4388-9084-4b823511bb9f	ca652ee1-1423-42fe-a0ef-e5761a670845	Acapela Week Experiment	2021-08-09 07:28:55.252248+00	2021-08-10 07:30:00+00	\N	\N	\N	817fe305-f868-4bb0-a9fb-fc15b70ba296	acapela-week-experiment	\N	f	2021-08-13 16:20:05.938+00	ca652ee1-1423-42fe-a0ef-e5761a670845
cf9197da-a54f-4735-b942-771424d3983d	ca652ee1-1423-42fe-a0ef-e5761a670845	Day-to-day small discussions	2021-08-04 07:10:13.846503+00	2021-08-11 07:00:00+00	\N		\N	bbafe64e-d4aa-40a8-8345-e4d2a90cecf9	day-to-day-small-discussions	\N	f	2021-08-15 19:11:37.53+00	ca652ee1-1423-42fe-a0ef-e5761a670845
\.


--
-- Data for Name: topic; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.topic (id, room_id, name, index, slug, closed_at, closed_by_user_id, closing_summary, owner_id) FROM stdin;
9fa78080-867b-4e01-b60a-6f47b55c4b58	4e21d822-4052-491d-a106-6e85ffa7e1b7	Adam	d	adam	\N	\N	\N	f30de478-b560-47f5-8588-8062ffc64a25
b7330847-fe0d-4446-83b1-a989f47a959e	76d33092-f62b-49cc-aa9c-00ca0dd3b943	Attachments	d	attachments	2021-08-13 15:25:46.377	ee140dfb-14f6-41d3-b2b0-4e50764290d7		b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
e1e350f2-0a06-4d93-93f4-e5ff082a3888	28df10bc-90db-4e7b-bd67-d2a864f9e964	Exporting summary to Notion	h	exporting-summary-to-notion	\N	\N	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
29f7bc2a-76ff-4f94-8cb1-1f11045297a1	e880dda2-9fa8-418f-9d3c-452225126c65	Engineering	n	engineering	\N	\N	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
624bc2ec-5a14-4998-bf48-ee1216f38790	385c3cc5-ac05-4913-91c1-a7560cefdc93	Challenging current logics	n	challenging-current-logics	\N	\N	\N	f30de478-b560-47f5-8588-8062ffc64a25
950ad578-3e05-4e73-aed4-25a21b5393ac	c6d65e11-d335-4ab4-9d46-7ed3d9760c06	Intro	b	intro	2021-08-11 09:22:51.745	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	WIP	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
a8663afc-06b9-4e95-a9c8-bd57f898bf52	cf9197da-a54f-4735-b942-771424d3983d	App crashes on team change	aen	app-crashes-on-team-change	\N	\N	\N	ca652ee1-1423-42fe-a0ef-e5761a670845
d167d1c7-ba53-42c5-ac8a-c07c204215c8	cf9197da-a54f-4735-b942-771424d3983d	App feels faster	aeg	app-feels-faster	\N	\N	\N	ee140dfb-14f6-41d3-b2b0-4e50764290d7
eb7722ae-b13b-4a89-9162-6bb597524ee5	8ecb77a0-b1cd-4070-b184-fe7d96acab43	Countdown to v2 "launch" for teams	w	timeline-for-launch	2021-07-05 16:48:43.906	f30de478-b560-47f5-8588-8062ffc64a25		f30de478-b560-47f5-8588-8062ffc64a25
832f3a41-2f78-4402-9202-78ad6d64f4cd	f95e7a04-5ef4-47a6-9dcf-b7504e330c09	Current bug	b	current-bug	2021-06-25 07:25:33.605	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
8a0d6a5d-04cf-454b-b088-34c9386e026c	f95e7a04-5ef4-47a6-9dcf-b7504e330c09	Proposed solution	f	proposed-solution	2021-06-25 07:25:33.605	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
b3abd6a4-3434-4550-bc84-f1f452130e64	4a4c995d-bbb4-4573-b170-db617d336b7b	Update on new website progress	an	update-on-new-website-progress	2021-08-03 14:06:15.24	f30de478-b560-47f5-8588-8062ffc64a25	Please review Brittas Looms about the current state of our website 	f30de478-b560-47f5-8588-8062ffc64a25
af921e4f-c64e-4462-b565-b9bbc85dee8b	51c4135e-d3cc-43f9-b247-85ff13feb946	Representation in the DB	b	representation-in-the-db	2021-06-21 07:52:11.708	ca652ee1-1423-42fe-a0ef-e5761a670845	We will use replied_to_message_id to reference message we are replying to.	ca652ee1-1423-42fe-a0ef-e5761a670845
e738800a-5a93-4e51-90fb-ca78109b076e	7bb63491-df1e-414c-9b5a-909d5ceb0e6a	Emoji Picker	f	emoji-picker	2021-06-25 10:36:50.982	ca652ee1-1423-42fe-a0ef-e5761a670845	Reuse the emoji picker we have in the rich editor	ca652ee1-1423-42fe-a0ef-e5761a670845
ec3477e0-ea66-4ba8-9275-5d6924345385	2a28f67a-0f19-4989-a354-1511e4fc48c5	Preferred Solution	d	preferred-solution	2021-06-23 08:01:19.515	600ccd3a-a513-4a4a-864b-e00bfc9699f9	On our call (22 Jun), we agreed on the solution to have: \n- one Master UI Kit file (which should not be touched often)\n- one Master Flows file (this is were all the finalized screen designs & flows go - ready for implementation)\n- one Design team work file (this is the work-in-progress file) where the design team works on screens\n- a backup file of everything Metalab delivered at the end of the engagement. (Ideally stored somewhere else)\n	600ccd3a-a513-4a4a-864b-e00bfc9699f9
96c354e5-89c7-47c2-8a23-3474dde5b7ee	7bb63491-df1e-414c-9b5a-909d5ceb0e6a	Representation in the DB	b	representation-in-the-db	2021-06-25 11:47:20.38	ca652ee1-1423-42fe-a0ef-e5761a670845	A message_reaction table with columns user_id, emoji (regular TEXT), message_id with grouping on the front-end.	ca652ee1-1423-42fe-a0ef-e5761a670845
289bb606-7ac4-49ea-8147-6a9eed284d36	51c4135e-d3cc-43f9-b247-85ff13feb946	Delete Behavior	d	delete-behavior	2021-06-21 08:11:11.774	ca652ee1-1423-42fe-a0ef-e5761a670845	For now, we will use cascade delete replies when the parent message gets deleted.	ca652ee1-1423-42fe-a0ef-e5761a670845
5a546add-1b24-4216-8a78-e8f0fe03eef3	1a65696f-6a49-46c4-a2f9-f55e23dc4216	V2 feature list review	b	v2-feature-list-review	2021-07-21 15:23:50.278	600ccd3a-a513-4a4a-864b-e00bfc9699f9	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
810dbc47-af96-4c1b-bdbd-b1dcd6aa4322	4e21d822-4052-491d-a106-6e85ffa7e1b7	Heiki	c	heiki	\N	\N	\N	f30de478-b560-47f5-8588-8062ffc64a25
44660c03-0bba-42df-b615-b3638a56d282	4e21d822-4052-491d-a106-6e85ffa7e1b7	Jannick	ag	jannick	\N	\N	\N	f30de478-b560-47f5-8588-8062ffc64a25
986aa5b3-c238-4f52-a600-4db2ece4b9ee	8ecb77a0-b1cd-4070-b184-fe7d96acab43	How to increase app engagement	wn	how-to-increase-app-engagement	2021-07-05 16:48:43.906	f30de478-b560-47f5-8588-8062ffc64a25	\N	f30de478-b560-47f5-8588-8062ffc64a25
2f38aa46-5517-4c9b-b060-81e3a2864bee	4e21d822-4052-491d-a106-6e85ffa7e1b7	Arnoldas	an	arnoldas	\N	\N	\N	f30de478-b560-47f5-8588-8062ffc64a25
09bbcc44-9b82-434a-86cf-337c14f77172	0c048987-788e-44a8-9e29-f7575949c9a5	Presentation of Results (Video)	b	brief	2021-07-07 14:48:20.415	25db9c19-f84e-40d8-9dfb-ee94478ca40a	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
1ed8506a-17c8-4b3c-818b-9d10f670b1b1	4b2b3985-299c-42b3-8546-3c52f4ba8484	Demo	b	demo	2021-06-28 20:06:24.303	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
8ef2ac54-7d44-4bfd-b897-f88ee920764e	4e21d822-4052-491d-a106-6e85ffa7e1b7	Rodion	x	rodion	\N	\N	\N	f30de478-b560-47f5-8588-8062ffc64a25
ccdf7719-9369-4cf4-8421-70c8a2dedd65	1a140e97-fccd-4918-bd3f-8291e8649872	🔮 Visual direction for landing page	b	visual-direction-for-landing-page	2021-06-30 13:02:33.202	82f57a9f-6615-4527-816f-31ee7a0b7c98	\N	82f57a9f-6615-4527-816f-31ee7a0b7c98
c2e6c5e7-2558-4d15-b8a2-bd393043db01	1a140e97-fccd-4918-bd3f-8291e8649872	🚨 Deadline for design part	f	deadline-for-design-part	2021-06-30 13:02:33.202	82f57a9f-6615-4527-816f-31ee7a0b7c98	\N	82f57a9f-6615-4527-816f-31ee7a0b7c98
806dfed4-1225-47b6-8de7-80b7fbc1cc87	1a140e97-fccd-4918-bd3f-8291e8649872	📑 Project Plan	an	project-plan	2021-06-30 13:02:33.202	82f57a9f-6615-4527-816f-31ee7a0b7c98	\N	82f57a9f-6615-4527-816f-31ee7a0b7c98
6c291865-999e-4a1d-9588-5ad93cedbbf5	4e21d822-4052-491d-a106-6e85ffa7e1b7	Omar	l	omar	\N	\N	\N	f30de478-b560-47f5-8588-8062ffc64a25
447c3879-98b7-45f7-a978-77f20fc8c69a	4e21d822-4052-491d-a106-6e85ffa7e1b7	Yuliia	w	yuliia	\N	\N	\N	f30de478-b560-47f5-8588-8062ffc64a25
d26b031f-fd54-471c-a6eb-2c481d128340	c4090fab-3806-4e4a-b190-63b787c32bb3	Upcoming dev	d	upcoming-dev	2021-07-01 15:35:46.591	25db9c19-f84e-40d8-9dfb-ee94478ca40a	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
5c601a00-3bdd-4601-836c-dc9a4d9eff3d	e6bca11a-3e53-4881-b2fa-b48d579814c2	Heiki's teams	d	heikis-teams	\N	\N	\N	f30de478-b560-47f5-8588-8062ffc64a25
43856419-1592-4a2d-9ac9-548906db3c28	c4090fab-3806-4e4a-b190-63b787c32bb3	Upcoming design	f	upcoming-design	2021-07-01 15:35:46.591	25db9c19-f84e-40d8-9dfb-ee94478ca40a	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
f159d13d-55aa-42eb-8653-89486d8ba839	71636fe8-50fb-4e33-a017-9dfed71803ab	Visionaries	j	visionaries	2021-08-05 11:42:03.818	25db9c19-f84e-40d8-9dfb-ee94478ca40a		25db9c19-f84e-40d8-9dfb-ee94478ca40a
3a2032b1-8190-47b2-84d6-28998118838d	4e21d822-4052-491d-a106-6e85ffa7e1b7	Roland	f	roland	\N	\N	\N	f30de478-b560-47f5-8588-8062ffc64a25
2d29bb62-fa72-47dd-92e2-e97256ad3ae1	e3c59b5b-e8a1-4cdc-95a2-569c9ff699b7	What's left to implement from Figma final flows?	b	whats-left-to-implement-from-figma-final-flows	2021-07-06 07:34:18.722	82f57a9f-6615-4527-816f-31ee7a0b7c98	Priority for the this week improve UI layout for main screens. 	82f57a9f-6615-4527-816f-31ee7a0b7c98
f2bbb218-3433-4e3c-b3be-759d1c470619	e3c59b5b-e8a1-4cdc-95a2-569c9ff699b7	Status of Notion Issues list	f	status-of-notion-issues-list	2021-07-06 08:10:49.009	82f57a9f-6615-4527-816f-31ee7a0b7c98	List will be reviewed by dev team weekly. 	82f57a9f-6615-4527-816f-31ee7a0b7c98
27395777-4065-4830-9c4b-65c7516a400a	76d33092-f62b-49cc-aa9c-00ca0dd3b943	Mentions test	h	mentions-test	\N	\N	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
08dc2b07-48df-4877-a228-167e962bd960	b5b83152-fa39-4d21-a9b5-d6c5d9f41d51	iFrame	b	pin-documents	2021-07-05 16:25:21.673	600ccd3a-a513-4a4a-864b-e00bfc9699f9	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
47b58a79-58ed-4ab8-91c6-00584868725d	1d8ff61c-35fe-4dfd-abd8-d25fc52d2264	Discuss current state of the product V2/V3	h	discuss-current-state-of-the-product-v2-v3	2021-07-05 16:48:16.154	f30de478-b560-47f5-8588-8062ffc64a25	\N	f30de478-b560-47f5-8588-8062ffc64a25
b4bbb420-3344-4331-b867-6c41ddd64536	1d8ff61c-35fe-4dfd-abd8-d25fc52d2264	Bonus (only if we have time): Flow	j	bonus-only-if-we-have-time-flow	2021-07-05 16:48:16.154	f30de478-b560-47f5-8588-8062ffc64a25	Shared also in Slack	f30de478-b560-47f5-8588-8062ffc64a25
601996cc-a8e9-44e2-adde-4071301dc791	8ecb77a0-b1cd-4070-b184-fe7d96acab43	FEEDBACK ⭐️⭐️⭐️	x	feedback	2021-07-05 16:48:43.906	f30de478-b560-47f5-8588-8062ffc64a25	\N	f30de478-b560-47f5-8588-8062ffc64a25
4bede90b-6829-469f-8735-55a430a0547e	8ecb77a0-b1cd-4070-b184-fe7d96acab43	Tagging in v2?	v	tagging-in-v2	2021-07-05 16:48:43.906	f30de478-b560-47f5-8588-8062ffc64a25	@ mentions will be included in v3	f30de478-b560-47f5-8588-8062ffc64a25
a666d87d-e793-42da-bbda-6305da5851e6	e88139a9-b2cc-4592-bc7c-1789169de498	🏡 Home screen	b	home-screen	\N	\N	\N	82f57a9f-6615-4527-816f-31ee7a0b7c98
c761769d-faa6-4e2d-8e90-cffde5b87084	e88139a9-b2cc-4592-bc7c-1789169de498	🧠 Header	an	header	\N	\N	\N	82f57a9f-6615-4527-816f-31ee7a0b7c98
5398f1f3-c8c2-4d39-b1d2-b981c57f732a	e88139a9-b2cc-4592-bc7c-1789169de498	🔮 Space with Rooms	f	space-with-rooms	\N	\N	\N	82f57a9f-6615-4527-816f-31ee7a0b7c98
d6e29e34-926f-43e5-b8ca-d91e53061ae1	bc62103c-e9fa-4993-9f83-95ccaecdda0f	Overview in Notion	an	overview-in-notion	2021-07-07 14:10:28.159	600ccd3a-a513-4a4a-864b-e00bfc9699f9	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
62bf892c-50fd-4588-8689-457b43cc086f	bbb0faf5-990f-4222-aab2-21763a857957	Pinning documents	b	pinning-documents	2021-07-08 15:15:47.551	600ccd3a-a513-4a4a-864b-e00bfc9699f9	Everyone who comments: please comment on V5 in the Figma file	f30de478-b560-47f5-8588-8062ffc64a25
2c680d67-2082-4bde-b507-4ae76898c0e4	bbb0faf5-990f-4222-aab2-21763a857957	Calendar - Metalab vs. current Status	k	calendar-metalab-vs-current-status	2021-07-08 15:31:12.469	600ccd3a-a513-4a4a-864b-e00bfc9699f9	ok. \nThe Heading of the calendar needs better wording	f30de478-b560-47f5-8588-8062ffc64a25
69e20f79-d685-4bf8-b21a-73dbbef108e2	27a44750-24d1-4aa5-b3c2-e2bb4c9be61e	QA results	b	qa-results	2021-08-12 13:13:08.075	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
7b0667e5-2d99-454f-95d2-4a1e71e306e3	bbb0faf5-990f-4222-aab2-21763a857957	Internal feedback (10 min)	n	internal-feedback-10-min	2021-07-09 08:56:36.432	600ccd3a-a513-4a4a-864b-e00bfc9699f9	Closed	f30de478-b560-47f5-8588-8062ffc64a25
46cfadba-77ea-42f8-b81f-afa0ab158576	8ecb77a0-b1cd-4070-b184-fe7d96acab43	Internal test-onboarding next week?	b	internal-test-onboarding-next-week	2021-07-05 16:48:43.906	f30de478-b560-47f5-8588-8062ffc64a25	New summary	f30de478-b560-47f5-8588-8062ffc64a25
f761c6ac-aa4c-4da9-bba5-32896711efc4	8ecb77a0-b1cd-4070-b184-fe7d96acab43	Issues list for v2 in Notion 	f	issues-list-for-v2-in-notion	2021-07-05 16:48:43.906	f30de478-b560-47f5-8588-8062ffc64a25	Heiki's proposal sounds good. Let's move with this approach	f30de478-b560-47f5-8588-8062ffc64a25
53de72b0-b18d-4cf3-93ea-a48b894761e8	2fadf5ac-dfb9-4e11-9f4b-47596eff2e57	Tasks	f	tasks	2021-06-16 14:49:08.426	25db9c19-f84e-40d8-9dfb-ee94478ca40a	see interview guide	25db9c19-f84e-40d8-9dfb-ee94478ca40a
63724e58-b0e4-4095-ab63-b9922400702a	7ccbdcfd-04f2-45bb-9c42-67a29ff581cb	Creating new "Topic Summary"	f	creating-new-topic-summary	2021-06-16 14:43:21.957	7a90bccb-346e-4933-aaeb-cdef732be976	Keeping summary outside of message.\nYuliia will create a new screen in figma	7a90bccb-346e-4933-aaeb-cdef732be976
3cfb5146-8c01-4581-a5f4-a65130a188a3	c4090fab-3806-4e4a-b190-63b787c32bb3	Status v2	b	status-v2	2021-07-01 15:35:46.591	25db9c19-f84e-40d8-9dfb-ee94478ca40a	The core functionality is there to test it with alpha teams, except the calendar. The calendar requires additional fixes. 	25db9c19-f84e-40d8-9dfb-ee94478ca40a
cb232862-61c5-4254-bff4-f2b35f0b8817	2fadf5ac-dfb9-4e11-9f4b-47596eff2e57	Research plan on Notion	e	research-plan-on-notion	2021-06-24 15:37:08.444	25db9c19-f84e-40d8-9dfb-ee94478ca40a		25db9c19-f84e-40d8-9dfb-ee94478ca40a
92c036e0-1b96-45ad-b529-a227b1e935e4	f95e7a04-5ef4-47a6-9dcf-b7504e330c09	People API	d	people-api	2021-06-25 07:25:33.605	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
f98de3d4-4dc7-400a-979c-80f15767a230	2fadf5ac-dfb9-4e11-9f4b-47596eff2e57	Participants	en	participants	2021-06-18 12:30:40.591	25db9c19-f84e-40d8-9dfb-ee94478ca40a	Scheduled\n	25db9c19-f84e-40d8-9dfb-ee94478ca40a
8209f70d-d1be-4707-834b-3f45dd3b2178	8ecb77a0-b1cd-4070-b184-fe7d96acab43	Accountability features in v2?	j	accountability-features-in-v2	2021-07-05 16:48:43.906	f30de478-b560-47f5-8588-8062ffc64a25	\N	f30de478-b560-47f5-8588-8062ffc64a25
52fe8757-21c1-4e21-b75f-c20bf1efdee4	f61f40f0-4ece-419c-a554-d659ac990ba7	Context	an	context	\N	\N	\N	600ccd3a-a513-4a4a-864b-e00bfc9699f9
7371c4ac-49c3-46b2-8028-7b1c3a9cef76	7bb63491-df1e-414c-9b5a-909d5ceb0e6a	GraphQL	d	graphql	2021-06-28 05:37:33.778	ca652ee1-1423-42fe-a0ef-e5761a670845	Query reactions and group them on the front-end	ca652ee1-1423-42fe-a0ef-e5761a670845
b211ac73-ce13-4b92-a9c8-7e2146db3dd5	51c4135e-d3cc-43f9-b247-85ff13feb946	State management	f	state-management	2021-06-21 08:15:20.389	ca652ee1-1423-42fe-a0ef-e5761a670845	Use MobX + React's Context for store management	ca652ee1-1423-42fe-a0ef-e5761a670845
ed320f20-c3c0-4ffa-9943-37df7eaa5ea8	76d33092-f62b-49cc-aa9c-00ca0dd3b943	Figma tesdt	i	figma-tesdt	\N	\N	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
389d6acf-b00a-42fd-bdbd-4df84f96bbf6	1a140e97-fccd-4918-bd3f-8291e8649872	💈 Content & structure of pages	d	content-and-structure-of-pages	2021-06-30 13:02:33.202	82f57a9f-6615-4527-816f-31ee7a0b7c98	\N	82f57a9f-6615-4527-816f-31ee7a0b7c98
f5d29f20-c37a-489e-9273-4d29f451ad6f	1a140e97-fccd-4918-bd3f-8291e8649872	🚀 Resources	h	resources	2021-06-30 13:02:33.202	82f57a9f-6615-4527-816f-31ee7a0b7c98	\N	82f57a9f-6615-4527-816f-31ee7a0b7c98
7e4b0258-e951-48ba-957d-9eb46d06a520	8ecb77a0-b1cd-4070-b184-fe7d96acab43	Notification badges	d	notification-badges	2021-07-05 16:48:43.906	f30de478-b560-47f5-8588-8062ffc64a25	\n- just go for notifications for rooms (not spaces)\n- just go for notifications for rooms you are a member of\numbered notifications just on rooms - not on topics; \n- on topics it should be just be the red dot	f30de478-b560-47f5-8588-8062ffc64a25
235faf89-59ed-4520-8957-38fbd49e2490	76d33092-f62b-49cc-aa9c-00ca0dd3b943	Emoji things	gn	emoji-things	\N	\N	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
d0b8bf8e-dd2e-4e00-84f5-b6c3ca13ea2a	76d33092-f62b-49cc-aa9c-00ca0dd3b943	Previews	in	previews	\N	\N	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
4a2e3c80-7128-4a2a-a727-ca78bd976e77	7ccbdcfd-04f2-45bb-9c42-67a29ff581cb	Closing with Open Topics	b	closing-with-open-topics	2021-06-16 14:43:21.957	7a90bccb-346e-4933-aaeb-cdef732be976	All open topics are able to be closed through the close topic modal	7a90bccb-346e-4933-aaeb-cdef732be976
faeb4daa-d511-4807-a679-b023576c5540	7ccbdcfd-04f2-45bb-9c42-67a29ff581cb	Summary of Topic Outcomes	d	summary-of-topic-outcomes	2021-06-16 14:43:21.957	7a90bccb-346e-4933-aaeb-cdef732be976	Will display in the same page that we're writting from	7a90bccb-346e-4933-aaeb-cdef732be976
9c515d50-ad3c-406e-a431-57caed837571	2a28f67a-0f19-4989-a354-1511e4fc48c5	Context / Link to previous Slack Thread	b	link-to-previous-slack-thread	2021-06-21 12:08:13.755	600ccd3a-a513-4a4a-864b-e00bfc9699f9	(just information sharing and context)	600ccd3a-a513-4a4a-864b-e00bfc9699f9
2d06c3da-ac1f-4dac-9c08-fedee14ed5de	2fadf5ac-dfb9-4e11-9f4b-47596eff2e57	Extended Sales prototype of v2	h	extended-sales-prototype-of-v2	2021-06-21 15:33:55.766	25db9c19-f84e-40d8-9dfb-ee94478ca40a		25db9c19-f84e-40d8-9dfb-ee94478ca40a
749313b8-ad19-40e1-89bc-63844d9fccec	b3172b1c-fa67-472e-aa15-81952f282864	☄️ Summary of FigJam inspiration board for landing page	b	summary-of-figjam-inspiration-board-for-landing-page	2021-07-01 09:05:19.066	82f57a9f-6615-4527-816f-31ee7a0b7c98	We will not keep current 3d elements. After we deploy landing page v2, we will start working on our custom 3d story line.\nWe will take Linear as a reference, from structure point of view. \nWhat we agree on to experiment with:\n-mix gradients with plain colours \n-just plain colours \n-try to find good stock images of people to make page alive\n-bold statements with colourful backgrounds	82f57a9f-6615-4527-816f-31ee7a0b7c98
7e708d94-ba39-4aed-bd69-f0a7d0c9b957	b5b83152-fa39-4d21-a9b5-d6c5d9f41d51	pin documents	an	iframe	2021-07-05 16:25:21.673	600ccd3a-a513-4a4a-864b-e00bfc9699f9	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
ac9192a7-ff8e-4ed9-9d7f-c0c72e71dfd5	b5b83152-fa39-4d21-a9b5-d6c5d9f41d51	testing images upload	d	testing-images-upload	2021-07-05 16:25:21.673	600ccd3a-a513-4a4a-864b-e00bfc9699f9	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
ac7cc3cd-7bd1-4990-95a3-0537ab485bc5	1d8ff61c-35fe-4dfd-abd8-d25fc52d2264	Review of Results: Usability Testing	d	review-of-results-usability-testing	2021-07-05 16:48:16.154	f30de478-b560-47f5-8588-8062ffc64a25		f30de478-b560-47f5-8588-8062ffc64a25
0580623c-90ab-4b56-ae7e-c0a0f97fc6ca	1d8ff61c-35fe-4dfd-abd8-d25fc52d2264	Metalab Feedback	b	metalab-feedback	2021-07-05 16:48:16.154	f30de478-b560-47f5-8588-8062ffc64a25	The feedback process could have been executed better.	f30de478-b560-47f5-8588-8062ffc64a25
44dcd3bf-fb17-401b-a8cc-9cf060f83c01	1d8ff61c-35fe-4dfd-abd8-d25fc52d2264	Recording of the session	an	recording-of-the-session	2021-07-05 16:48:16.154	f30de478-b560-47f5-8588-8062ffc64a25		f30de478-b560-47f5-8588-8062ffc64a25
c56e8548-9a75-43f5-9a52-d45691ab0b13	1d8ff61c-35fe-4dfd-abd8-d25fc52d2264	Preview: revamp of landing page	i	preview-revamp-of-landing-page	2021-07-05 16:48:16.154	f30de478-b560-47f5-8588-8062ffc64a25		f30de478-b560-47f5-8588-8062ffc64a25
a1301660-03c4-4d06-820f-b4cd9d0a64a9	8ecb77a0-b1cd-4070-b184-fe7d96acab43	Inviting external people	r	inviting-external-people	2021-07-05 16:48:43.906	f30de478-b560-47f5-8588-8062ffc64a25	\N	f30de478-b560-47f5-8588-8062ffc64a25
16f2850f-f630-44da-8529-d05b38e03394	8ecb77a0-b1cd-4070-b184-fe7d96acab43	Level of accesses	t	level-of-accesses	2021-07-05 16:48:43.906	f30de478-b560-47f5-8588-8062ffc64a25	\N	f30de478-b560-47f5-8588-8062ffc64a25
73763d8a-cbda-477a-95cb-36a1f9e4229b	8ecb77a0-b1cd-4070-b184-fe7d96acab43	Rooms based on Recurring meetings	wg	rooms-based-on-recurring-meetings	2021-07-05 16:48:43.906	f30de478-b560-47f5-8588-8062ffc64a25	\N	f30de478-b560-47f5-8588-8062ffc64a25
6219d4cb-232d-4c8c-86a9-7b4ad4444817	e3c59b5b-e8a1-4cdc-95a2-569c9ff699b7	Naming of colours in design system and backend 	h	naming-of-colours-in-design-system-and-backend	2021-07-06 08:11:16.622	82f57a9f-6615-4527-816f-31ee7a0b7c98	We started separate room for this.	82f57a9f-6615-4527-816f-31ee7a0b7c98
d7046540-e347-43df-bd08-49e5a13cc30e	f0308c63-7a5b-4579-81fd-802275088b00	Current job post	b	current-job-post	\N	\N	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
8a5afa50-4bb2-4820-89ee-5f3c51f0a65c	e88139a9-b2cc-4592-bc7c-1789169de498	🛸 Spaces screen	d	spaces-screen	\N	\N	\N	82f57a9f-6615-4527-816f-31ee7a0b7c98
282e0cf6-ba9f-48b9-af3f-e2441779a201	e88139a9-b2cc-4592-bc7c-1789169de498	🚪 Inside Room	h	inside-room	\N	\N	\N	82f57a9f-6615-4527-816f-31ee7a0b7c98
4430d17f-63f1-4182-ab5b-608ab06bff29	bc62103c-e9fa-4993-9f83-95ccaecdda0f	Survey	b	survey	2021-07-07 14:10:28.159	600ccd3a-a513-4a4a-864b-e00bfc9699f9	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
26dc18b0-cbc0-4b34-8927-8be0fb231ae2	bc62103c-e9fa-4993-9f83-95ccaecdda0f	Participants	d	participants	2021-07-07 14:10:28.159	600ccd3a-a513-4a4a-864b-e00bfc9699f9	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
d8637f2f-e6d8-4a8a-b647-68c487eecd06	0c048987-788e-44a8-9e29-f7575949c9a5	Link to the results in Notion	d	link-to-the-results-in-notion	2021-07-07 14:48:20.415	25db9c19-f84e-40d8-9dfb-ee94478ca40a	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
8318452f-09bc-48ae-b89b-6c479ff3ce34	f61f40f0-4ece-419c-a554-d659ac990ba7	Vacation	at	vacation	\N	\N	\N	600ccd3a-a513-4a4a-864b-e00bfc9699f9
9fa70a66-1e09-4dc4-b5da-4fd46e6f3cb4	5fcf1905-d2cd-495f-9080-56fe218949b6	Checkin (Mo, 9th Aug)	cj	checkin-mo-9th-aug	2021-08-10 08:22:58.977	600ccd3a-a513-4a4a-864b-e00bfc9699f9		25db9c19-f84e-40d8-9dfb-ee94478ca40a
527f10e5-ce40-4d9f-9db3-1eda40155817	c6d65e11-d335-4ab4-9d46-7ed3d9760c06	Other ideas	g	other-ideas	\N	\N	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
19507902-5471-42bb-9dce-2b72d42d3456	e3c59b5b-e8a1-4cdc-95a2-569c9ff699b7	Plan for UI polishing of v2, based on MetaLab screens 	d	plan-for-ui-polishing-of-v2-based-on-metalab-screens	2021-07-06 08:10:04.884	82f57a9f-6615-4527-816f-31ee7a0b7c98	Design team provided final flows for UI layout based on MetaLab screens:https://www.figma.com/file/JtUxmZiS1RfZgREOmjKjKD/Final-flows?node-id=254%3A31834	82f57a9f-6615-4527-816f-31ee7a0b7c98
c5c343fd-1570-4bfa-a17e-5bc707d8f07a	8f9e0e7e-4b81-452e-be93-e93c14d26941	Intro	b	intro	2021-07-20 14:55:15.458	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	OKR's postponed for now and we focus more on feature sets for Q3	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
66b1e85b-fa20-4fa6-8b28-fe963d3688f4	bbb0faf5-990f-4222-aab2-21763a857957	Default personal space for 1-1s	d	default-personal-space-for-1-1s	2021-07-08 15:18:56.905	600ccd3a-a513-4a4a-864b-e00bfc9699f9	Good point. The design team will have a look & think about potential solutions	f30de478-b560-47f5-8588-8062ffc64a25
31ab13dd-4581-4532-9a7f-ae7be2c069f8	bbb0faf5-990f-4222-aab2-21763a857957	Design <> Dev collaboration	l	design-dev-collaboration	2021-07-08 15:41:45.596	600ccd3a-a513-4a4a-864b-e00bfc9699f9	Agreed that we start doing this in Acapela\n(a very cool new async working tool!)	f30de478-b560-47f5-8588-8062ffc64a25
13e1cbea-1c54-4cfb-8a19-f87aab0f72ea	4a4c995d-bbb4-4573-b170-db617d336b7b	Product Planning for the next weeks	l	product-planning-for-the-next-weeks	2021-08-03 15:00:40.013	f30de478-b560-47f5-8588-8062ffc64a25	First shot at Product Planning (Board) can be found on our Notion	f30de478-b560-47f5-8588-8062ffc64a25
075df733-01b0-4e48-8953-f655868990b1	8f9e0e7e-4b81-452e-be93-e93c14d26941	Increasing Accountability	cn	accountability	2021-08-03 16:05:15.822	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	Improving accountability and activity visibility has been separated and being worked on. 	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
669cc355-0269-491a-8573-80f7dddb9223	1a65696f-6a49-46c4-a2f9-f55e23dc4216	Friday 9th July	f	friday-9th-july	2021-07-21 15:23:50.278	600ccd3a-a513-4a4a-864b-e00bfc9699f9		6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
d891bc22-94e7-42b1-96af-b30f2a5efe2c	71636fe8-50fb-4e33-a017-9dfed71803ab	Obility - 12 Jul	c	obility-12-jul	2021-07-14 15:15:26.881	25db9c19-f84e-40d8-9dfb-ee94478ca40a	Onboarding successful	25db9c19-f84e-40d8-9dfb-ee94478ca40a
e1ae4e58-c24a-4cfd-bb67-db0ebe7a2fc9	ac29a6fb-cade-4cfe-8ef1-f163334abfdc	Quick review of outcomes & implementation	h	quick-review-of-outcomes-and-implementation	2021-08-02 08:37:22.35	600ccd3a-a513-4a4a-864b-e00bfc9699f9	\N	600ccd3a-a513-4a4a-864b-e00bfc9699f9
dd805776-a22f-4897-891a-46ebc6fb4725	e6bca11a-3e53-4881-b2fa-b48d579814c2	Quick Overview	b	quick-overview	\N	\N	\N	f30de478-b560-47f5-8588-8062ffc64a25
8e7acfee-cfe9-4ec0-a9b8-14aae24e0fa9	e6bca11a-3e53-4881-b2fa-b48d579814c2	Roland's teams	f	rolands-teams	\N	\N	\N	f30de478-b560-47f5-8588-8062ffc64a25
8739fd8a-5a75-4c10-a573-12b1053df648	8f9e0e7e-4b81-452e-be93-e93c14d26941	Improving Reliability	d	reliability	2021-07-13 11:18:28.577	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	Due to different definitions of reliability, this is now to be removed from OKR palnning.	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
a6edd11a-4374-4def-9f96-c3a02e5ed882	e078b152-a8ef-4cda-9bfa-388b2ddfe27d	What's the workflow	d	whats-the-workflow	2021-07-12 11:46:34.691	25db9c19-f84e-40d8-9dfb-ee94478ca40a	\N	600ccd3a-a513-4a4a-864b-e00bfc9699f9
a73e3d2e-2e84-4b85-8ade-7d8446010c86	76d33092-f62b-49cc-aa9c-00ca0dd3b943	Copying test	j	copying-test	\N	\N	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
aa52c52f-fddc-45a4-945a-ed73947d74c9	5fcf1905-d2cd-495f-9080-56fe218949b6	Use cases	cu	use-cases	2021-08-11 08:48:23.151	f30de478-b560-47f5-8588-8062ffc64a25	Use case content is done	25db9c19-f84e-40d8-9dfb-ee94478ca40a
896e7658-05a4-449b-8c25-89c4c7d11be1	71636fe8-50fb-4e33-a017-9dfed71803ab	hmpartner	r	hmpartner	\N	\N	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
897e3352-a959-4262-aae9-ab4a3add9af7	e078b152-a8ef-4cda-9bfa-388b2ddfe27d	Extra Slack Channel or not?	b	extra-slack-channel-or-not	2021-07-12 11:46:34.691	25db9c19-f84e-40d8-9dfb-ee94478ca40a	\N	600ccd3a-a513-4a4a-864b-e00bfc9699f9
3e976040-4c13-4c7d-853c-884d6788db1a	e078b152-a8ef-4cda-9bfa-388b2ddfe27d	Is this a sync meeting now?	f	is-this-a-sync-meeting-now	2021-07-12 11:46:34.691	25db9c19-f84e-40d8-9dfb-ee94478ca40a	no	600ccd3a-a513-4a4a-864b-e00bfc9699f9
bb3e81c0-88ed-4458-8d03-8770ea1a5ec1	b3172b1c-fa67-472e-aa15-81952f282864	Idea for customer feedback on landing page	h	idea-for-customer-feedback-on-landing-page	2021-07-21 09:19:34.229	82f57a9f-6615-4527-816f-31ee7a0b7c98	We like Linear landing page and their concept. 	82f57a9f-6615-4527-816f-31ee7a0b7c98
69b94728-fc60-46c6-b9cb-d6485e622725	5ed709d5-d6b3-4d86-a26a-f847f88a0a57	Manage Space Members	d	manage-space-members	2021-07-19 08:31:09.714	ca652ee1-1423-42fe-a0ef-e5761a670845	Manage space members is hidden behind the "More" button.	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
a71bf8c3-a302-483d-8877-bf1f6c1f15b4	bbb0faf5-990f-4222-aab2-21763a857957	Archive topics	j	archive-topics	2021-07-08 15:21:44.387	600ccd3a-a513-4a4a-864b-e00bfc9699f9	Ok. Designs to be created.	f30de478-b560-47f5-8588-8062ffc64a25
62890a70-c900-42b0-b16b-bacc42a7a036	bbb0faf5-990f-4222-aab2-21763a857957	Onboarding calls with teams	m	onboarding-calls-with-teams	2021-07-08 15:43:36.971	600ccd3a-a513-4a4a-864b-e00bfc9699f9	Everyone who wants to join an onboarding call, please reach out to Britta\n	f30de478-b560-47f5-8588-8062ffc64a25
ec23d178-0a3a-4eaf-b2de-ef36bf46c235	5ed709d5-d6b3-4d86-a26a-f847f88a0a57	Display the status of a member	j	display-the-status-of-a-member	2021-07-20 14:02:06.173	ca652ee1-1423-42fe-a0ef-e5761a670845	Show only email for invited users.	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
ae383f79-5f57-418a-a547-dc50269da698	1f9c3223-79fc-4901-97ce-c846be025404	What's the problem?	b	whats-the-problem	2021-07-09 08:36:59.827	f30de478-b560-47f5-8588-8062ffc64a25	We have not onboarded enough teams since our marketing efforts were not successful enough	25db9c19-f84e-40d8-9dfb-ee94478ca40a
335d4e03-91e8-4c83-b3c4-29289dd7d04f	1f9c3223-79fc-4901-97ce-c846be025404	Action steps	d	action-steps	2021-07-09 08:38:22.981	f30de478-b560-47f5-8588-8062ffc64a25	Next steps: 1) create a User Acqu Aapela with Heiki, Roland, Britta, Jannick and Heiki & Roland each contribute 5 'quick-win' teams; 2) Jannick to export LinkedIn contacts of Heiki & Roland into Sheet, which we will work thorugh 3) All teams reached out to should be added to HubSpot 	25db9c19-f84e-40d8-9dfb-ee94478ca40a
78221c97-282c-40f1-a65a-21522e819307	0c048987-788e-44a8-9e29-f7575949c9a5	Next steps?	f	next-steps	2021-07-07 14:48:20.415	25db9c19-f84e-40d8-9dfb-ee94478ca40a	- Analytics with Loom use case on Website\n- Presentation on Product Team Session on Thu	25db9c19-f84e-40d8-9dfb-ee94478ca40a
fd31d5d0-5e34-494a-9d25-26a77f0019a8	71636fe8-50fb-4e33-a017-9dfed71803ab	Steeped - 07 Jul	b	steeped-transfer	2021-07-14 15:14:59.318	25db9c19-f84e-40d8-9dfb-ee94478ca40a	Onboarding succesful	25db9c19-f84e-40d8-9dfb-ee94478ca40a
b9b3f5f8-35a9-40cf-aed4-6f7cde6a2e37	5ed709d5-d6b3-4d86-a26a-f847f88a0a57	Manage Room Members	b	manage-room-members	2021-07-16 19:32:38.949	82f57a9f-6615-4527-816f-31ee7a0b7c98	Questions were answered and design was provided :) 	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
6c8e4917-369e-4665-aefb-0ff9e808c0f2	71636fe8-50fb-4e33-a017-9dfed71803ab	Greyparrot - 13 Jul	d	greyparrot-13-jul	2021-07-14 15:15:37.977	25db9c19-f84e-40d8-9dfb-ee94478ca40a	Onboarding successful	25db9c19-f84e-40d8-9dfb-ee94478ca40a
fc45c751-19c6-421e-96e9-a0fe01874f37	5ed709d5-d6b3-4d86-a26a-f847f88a0a57	Add Participant Input	f	add-participant-input	2021-07-19 06:24:07.849	ca652ee1-1423-42fe-a0ef-e5761a670845	Update the input according to the design.	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
560f0651-59d7-4641-ab99-24776dceddc6	8f9e0e7e-4b81-452e-be93-e93c14d26941	Feedback requests from v2 users?	ct	feedback-requests-from-v2-users	2021-08-03 16:36:44.381	25db9c19-f84e-40d8-9dfb-ee94478ca40a		6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
50cc22f8-e1b5-4e97-b005-57794768edae	5fff4746-afc9-41db-b296-239b2f5e647f	DB layer: Invite a non-team-member to a room/space	b	db-layer-invite-a-non-team-member-to-a-room-space	2021-08-03 10:55:46.794	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	Use room_invitation table.	ca652ee1-1423-42fe-a0ef-e5761a670845
f927973b-9861-482c-92b6-390df01bf193	b1e4d74b-916e-44cd-a8ce-cc685927058c	Current Status	b	current-status	2021-08-09 08:01:31.495	f30de478-b560-47f5-8588-8062ffc64a25	\N	600ccd3a-a513-4a4a-864b-e00bfc9699f9
fcc42886-7ae4-4f92-b31a-a90d0df23f6d	03ea9cdd-e3a3-4f10-af7d-936b39b1d97c	Room invites	b	room-invites	\N	\N	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
17b401b9-004c-446d-8b31-c072c5ad870d	4e21d822-4052-491d-a106-6e85ffa7e1b7	Britta	g	britta	\N	\N	\N	f30de478-b560-47f5-8588-8062ffc64a25
1596717f-6516-4270-9d63-36cdf11a3427	91b35e7f-66f0-470f-b208-47f89ebd3771	Website Interviews I	d	website-interviews-i	2021-08-13 09:19:10.634	f30de478-b560-47f5-8588-8062ffc64a25	Debited to our account	25db9c19-f84e-40d8-9dfb-ee94478ca40a
6bdaa572-6d23-417d-8197-fa0872ab8ba5	8f9e0e7e-4b81-452e-be93-e93c14d26941	Building Trust	h	building-trust	2021-07-13 11:19:19.114	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	Due to different definitions of trust, this is now to be removed from OKR palnning.	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
958d55ae-37fd-4ed9-a467-6125dd188dc3	7461fe76-712a-4bb7-9442-983101dfc281	New topic	d	new-topic-mb5U8	2021-07-30 08:00:04.553	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
dc61a442-bafe-4280-bc7e-2a068321a6e0	28df10bc-90db-4e7b-bd67-d2a864f9e964	Room owner	j	room-owner	\N	\N	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
d1652c94-3a20-405b-b578-4da26650989f	2b1c54a6-60cc-4624-a655-938858d3af2c	Short overview of the internal survey results	b	short-overview-of-the-internal-survey-results	2021-07-13 15:48:39.782	f30de478-b560-47f5-8588-8062ffc64a25	Britta presented the results of our internal survey, which can also be found here: https://www.notion.so/acapela/Results-of-internal-survey-23bec8b25dd1429784e14851c0ade54b	f30de478-b560-47f5-8588-8062ffc64a25
50b7fdb5-5067-4cb4-a178-121e4e61cd43	2b1c54a6-60cc-4624-a655-938858d3af2c	Short Update: First onboardings	d	short-update-first-onboardings	2021-07-13 15:49:22.473	f30de478-b560-47f5-8588-8062ffc64a25	First onboardings on v2 are done. For more info about onboardings join the 'Customer' space.	f30de478-b560-47f5-8588-8062ffc64a25
3fd39670-e573-4e14-9623-751ec185e073	048e2d5a-7db4-4997-9b3e-195b44c55710	Product design (UI)	d	product-design-ui	2021-07-23 07:56:37.579	600ccd3a-a513-4a4a-864b-e00bfc9699f9	Discussed, adjusted & put into the FigJam file \n\nhttps://www.figma.com/file/nkbYWc8CDKAQ061mGL9605/Q3-Company-goals?node-id=10%3A133	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
84ae1cf9-da5c-49f5-aa64-bdf5796cf16b	76d33092-f62b-49cc-aa9c-00ca0dd3b943	Delete uploads	l	delete-uploads	\N	\N	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
31e965a5-bd2e-4183-80cf-c92862e75123	f435c12a-ad27-44e3-a464-4fd9c7e007e0	New topic	j	new-topic-kmS5x	2021-07-20 13:30:39.899	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	test	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
2afaa7d4-89ee-49ec-9391-dc10c7f9bd6c	cf9197da-a54f-4735-b942-771424d3983d	Simple mutation to re-send invitation	o	simple-mutation-to-re-send-invitation	2021-08-04 13:49:15.178	ca652ee1-1423-42fe-a0ef-e5761a670845	Return an object response, because basic types are not allowed.	ca652ee1-1423-42fe-a0ef-e5761a670845
1d0464b7-8b84-4731-bb53-37c247f2b179	5ed709d5-d6b3-4d86-a26a-f847f88a0a57	Navigation Search Bar	l	navigation-search-bar	2021-07-20 13:02:06.176	7a90bccb-346e-4933-aaeb-cdef732be976	Making the search bar appear right below the static one\n	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
84d076a1-b88b-4232-8fe4-755f25411d9d	71636fe8-50fb-4e33-a017-9dfed71803ab	Wingback - 15 Jul	f	wingback-15-jul	2021-08-05 11:41:53.056	25db9c19-f84e-40d8-9dfb-ee94478ca40a		25db9c19-f84e-40d8-9dfb-ee94478ca40a
72158001-ba0e-426d-9636-d09bf63efe9d	71636fe8-50fb-4e33-a017-9dfed71803ab	SumUp - 16 Jul	h	friday	2021-08-05 11:41:56.812	25db9c19-f84e-40d8-9dfb-ee94478ca40a		25db9c19-f84e-40d8-9dfb-ee94478ca40a
535c5640-82c2-44b9-950d-7555e86556f6	f435c12a-ad27-44e3-a464-4fd9c7e007e0	New topic	d	new-topic-pINRt	2021-07-20 13:28:54.275	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
f49a2818-8800-4ab8-8906-c727153454f2	f435c12a-ad27-44e3-a464-4fd9c7e007e0	New topic	h	new-topic-WgiDM	2021-07-20 13:28:54.275	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
34389740-7677-46f3-89d6-76ea52017019	5c4fe2d8-3533-4f60-bfca-c9b8a95c210d	Q3 Planning	v	q3-planning	2021-07-20 14:42:11.786	f30de478-b560-47f5-8588-8062ffc64a25	@Team: feel free to check out the Q3 planning Loom in our Notion	25db9c19-f84e-40d8-9dfb-ee94478ca40a
c09f5001-8876-40ac-bfb5-7468d65edfc2	5c4fe2d8-3533-4f60-bfca-c9b8a95c210d	Idea: Option of adding deadline for mention	d	option-of-adding-deadline-for-mention	2021-07-20 14:38:16.958	f30de478-b560-47f5-8588-8062ffc64a25	We like the idea and will def. include prioritization, but details are tbd	25db9c19-f84e-40d8-9dfb-ee94478ca40a
df6b6e91-9e9d-4f59-aa10-58ba5b25f9e0	5c4fe2d8-3533-4f60-bfca-c9b8a95c210d	Back button in the app	e	back-button-in-the-app	2021-07-20 14:38:16.958	f30de478-b560-47f5-8588-8062ffc64a25	We actually have a back button in our designs, prio is tbd	25db9c19-f84e-40d8-9dfb-ee94478ca40a
f49a2562-3073-4a5a-8c77-c2e7a514b63f	5c4fe2d8-3533-4f60-bfca-c9b8a95c210d	Default personal space	f	default-personal-space	2021-07-20 14:38:16.958	f30de478-b560-47f5-8588-8062ffc64a25	We agree on having a private space already during onboarding	25db9c19-f84e-40d8-9dfb-ee94478ca40a
2d78f563-87d1-4771-9d03-befff5d76f31	5c4fe2d8-3533-4f60-bfca-c9b8a95c210d	Challenge around accountability	n	challenge-around-accountability	2021-07-20 14:38:16.958	f30de478-b560-47f5-8588-8062ffc64a25	Discussion surrounding open collab - tbd, changelog might be necessary	25db9c19-f84e-40d8-9dfb-ee94478ca40a
60974c19-638b-4345-81f8-ec7195b3be09	8f9e0e7e-4b81-452e-be93-e93c14d26941	Improving activity visibility	j	improving-activity-visibility	2021-07-20 15:03:33.489	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	Improving activity visibility is now in progress hence closing this topic.	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
1f1026c2-5246-4788-8f67-933e06dffd7e	b3172b1c-fa67-472e-aa15-81952f282864	Who will code landing page ? 	d	who-will-code-landing-page	2021-07-21 09:18:06.61	82f57a9f-6615-4527-816f-31ee7a0b7c98	Adam will code landing page 	82f57a9f-6615-4527-816f-31ee7a0b7c98
8ac1179f-d0ae-4c76-8a3f-ffce22b68723	b3172b1c-fa67-472e-aa15-81952f282864	Content concept feedback	f	content-concept-feedback	2021-07-21 09:19:02.428	82f57a9f-6615-4527-816f-31ee7a0b7c98	Concept was tested. Next steps to finalize feedback and prepare next version. 	82f57a9f-6615-4527-816f-31ee7a0b7c98
015141bb-8bc0-4bab-9771-9e0a13a9f0b2	e9fbf9f5-8aaa-4ff7-8905-b10b23b93902	New topic	d	new-topic-rycDN	2021-07-21 10:34:29.483	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
490d13aa-ae0a-4573-a9c0-e794bb0677ea	e9fbf9f5-8aaa-4ff7-8905-b10b23b93902	New topic	h	new-topic-fpBPl	2021-07-21 10:34:29.483	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
452413c4-3e20-4c8a-be25-fda44428c9a0	1a65696f-6a49-46c4-a2f9-f55e23dc4216	V3 feature list	d	v3-feature-list	2021-07-21 15:23:50.278	600ccd3a-a513-4a4a-864b-e00bfc9699f9	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
454b94ed-7e72-4a9e-b221-efc9aad86483	b888515c-9ed8-4198-92dd-2b930417e61e	Unknown activity in Mixpanel?	b	unknown-activity-in-mixpanel	2021-07-26 12:12:12.627	25db9c19-f84e-40d8-9dfb-ee94478ca40a		25db9c19-f84e-40d8-9dfb-ee94478ca40a
7968122e-e49e-4d59-b1e7-d4e128824615	5ed709d5-d6b3-4d86-a26a-f847f88a0a57	Homepage Filters	h	homepage-filters	2021-07-20 08:31:26.711	7a90bccb-346e-4933-aaeb-cdef732be976	Arnoldas is redefining the way the homepage should behave. It'll take a few days to understand how that's going to work	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
19eda0fd-71e8-49fd-9847-d2b9d8466527	54afb680-f7ad-4ac3-973e-a1a53c4b7c68	Visual directions from Julia	f	visual-directions-from-julia	2021-07-28 06:55:29.494	82f57a9f-6615-4527-816f-31ee7a0b7c98	Feedback collected :) 	82f57a9f-6615-4527-816f-31ee7a0b7c98
32db5328-d846-44c4-867f-e81359e947e2	76d33092-f62b-49cc-aa9c-00ca0dd3b943	Messages not sending	r	messages-not-sending	\N	\N	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
6a19a95e-f371-4667-8b58-0cab5a2a7056	f435c12a-ad27-44e3-a464-4fd9c7e007e0	New topic	b	new-topic-RYKdk	2021-07-20 13:28:54.275	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
c97d1a8b-87ea-449a-8274-69dfcc683ddf	f435c12a-ad27-44e3-a464-4fd9c7e007e0	New topic	f	new-topic-Wp1rc	2021-07-20 13:28:54.275	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
807d7448-0f1f-435f-880a-66ff98f39d2a	b888515c-9ed8-4198-92dd-2b930417e61e	Call with Lisa (Visionaries)	f	call-with-lisa-visionaries	\N	\N	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
a7f00a6e-f036-4062-9798-f1a770405c0e	5c4fe2d8-3533-4f60-bfca-c9b8a95c210d	What happens with the 'ongoing discussion' items in the tracker?	an	what-happens-with-the-ongoing-discussion-items-in-the-tracker	2021-07-20 14:38:16.958	f30de478-b560-47f5-8588-8062ffc64a25	Heiki & Arnoldas review them frequently, we go through them as a prep for the team product call	25db9c19-f84e-40d8-9dfb-ee94478ca40a
12a4253d-c1aa-4858-a8cd-b5c0ef17d220	5c4fe2d8-3533-4f60-bfca-c9b8a95c210d	Mark messages as edited	h	mark-messages-as-edited	2021-07-20 14:38:16.958	f30de478-b560-47f5-8588-8062ffc64a25	Discussion also related to accountability -tbd	25db9c19-f84e-40d8-9dfb-ee94478ca40a
839b9f13-e9ff-49f2-9e11-932b03ed8d10	5c4fe2d8-3533-4f60-bfca-c9b8a95c210d	Room summary without closing topics	t	room-summary-without-closing-topics	2021-07-20 14:38:16.958	f30de478-b560-47f5-8588-8062ffc64a25	The current flow is too hidden	25db9c19-f84e-40d8-9dfb-ee94478ca40a
25522813-086e-4ef1-ad4b-eac1740a83eb	5fcf1905-d2cd-495f-9080-56fe218949b6	Wednesday final async checkin	t	wednesday-final-async-checkin	2021-08-05 18:51:50.446	600ccd3a-a513-4a4a-864b-e00bfc9699f9		25db9c19-f84e-40d8-9dfb-ee94478ca40a
12aee6ec-e255-4446-b825-23a2dbdedcdd	4e21d822-4052-491d-a106-6e85ffa7e1b7	Gregor	v	gregor	\N	\N	\N	f30de478-b560-47f5-8588-8062ffc64a25
252e608e-1966-49c9-a1ac-c617eabb01bb	742634cf-bc44-43df-a1e2-c5e087c2e116	test	b	test	2021-08-12 14:04:26.428	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
69e24a15-a7a5-408c-ae3c-523a89b58799	3c15419b-a818-4680-9e64-10f8596c8d58	Topic proposals so far	b	topic-proposals-so-far	2021-08-04 15:13:08.433	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	Covered almost everything mentioned	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
60931661-0e2a-45d6-af0f-6c44d8d60f27	e9fbf9f5-8aaa-4ff7-8905-b10b23b93902	New topic	b	new-topic-6Xph5	2021-07-21 10:34:29.483	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
437ef8f1-41b1-4504-828d-2fa1675c1401	e9fbf9f5-8aaa-4ff7-8905-b10b23b93902	New topic	f	new-topic-EbGi5	2021-07-21 10:34:29.483	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
39424537-869a-4c67-94fb-dc1bedd6460e	e9fbf9f5-8aaa-4ff7-8905-b10b23b93902	New topic	j	new-topic-sSrEK	\N	\N	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
5d4e1943-67b7-4d68-9baf-3fa7c1df599e	54afb680-f7ad-4ac3-973e-a1a53c4b7c68	💭 First thoughts on LP ideas by Ana	b	first-thoughts-on-lp-ideas-by-ana	2021-07-21 16:22:26.77	82f57a9f-6615-4527-816f-31ee7a0b7c98	First feedback collected 💫	82f57a9f-6615-4527-816f-31ee7a0b7c98
ce8a900c-eab9-44c2-bf95-873272fa5e77	fe514238-04d9-4388-9084-4b823511bb9f	Feedback Adam	w	feedback-adam	\N	\N	\N	ca652ee1-1423-42fe-a0ef-e5761a670845
1ef10234-ceff-4c57-a295-facbed92592d	048e2d5a-7db4-4997-9b3e-195b44c55710	Product design (UX)	b	product-design-ux	2021-07-23 07:56:19.9	600ccd3a-a513-4a4a-864b-e00bfc9699f9	Discussed, adjusted & put into the FigJam file\n\nhttps://www.figma.com/file/nkbYWc8CDKAQ061mGL9605/Q3-Company-goals?node-id=10%3A133	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
d1243295-e6ac-4da5-866f-582a9b419a4f	0fe6380c-f7eb-4652-a4cc-fd778a4a36b5	Initial thoughts	b	initial-thoughts	\N	\N	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
d3b9a5c5-04dd-4875-8440-b5726b3bb231	c6d65e11-d335-4ab4-9d46-7ed3d9760c06	Few days before due date	j	few-days-before-due-date	2021-08-03 15:55:09.542	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	Postponed for now	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
8f2cff72-cd3c-480f-9d63-5cd260b08d27	27a44750-24d1-4aa5-b3c2-e2bb4c9be61e	New topic	n	new-topic-6fPPh	2021-08-12 13:13:08.075	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
7d4b2466-c340-4bb6-91d1-72f931cec5dc	b888515c-9ed8-4198-92dd-2b930417e61e	Tracking DAT	d	tracking-dat	\N	\N	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
d3a11bcb-6569-4772-a537-cf6f64388932	54afb680-f7ad-4ac3-973e-a1a53c4b7c68	Feedback on Ana's 2nd UI offer	h	feedback-on-anas-2nd-ui-offer	2021-08-02 14:08:48.759	82f57a9f-6615-4527-816f-31ee7a0b7c98	Feedback collected 🎉	82f57a9f-6615-4527-816f-31ee7a0b7c98
80439d52-b5f8-40d3-af3f-7947802431a3	e6bca11a-3e53-4881-b2fa-b48d579814c2	Status	h	status	\N	\N	\N	f30de478-b560-47f5-8588-8062ffc64a25
16571812-9e72-46d0-8568-cf402abd1f5e	91b35e7f-66f0-470f-b208-47f89ebd3771	Survey 02 July	ag	survey-02-july	\N	\N	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
63a7e4fb-03c6-4a8b-9581-063725d3faa5	c6d65e11-d335-4ab4-9d46-7ed3d9760c06	Nudge others for their reply	h	nudge-others-for-their-reply	2021-08-03 15:57:37.001	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	The decision is not to proceed with this version of nudge or reminder.	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
62a36a3c-e335-4022-90ef-d3a5e3615d11	5ed709d5-d6b3-4d86-a26a-f847f88a0a57	Tooltip for deleting team members	an	tooltip-for-deleting-team-members	2021-07-30 15:13:02.575	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	Other team members will be deleted by the team owner. If anyone else would decide to delete a member, it will say "Only team owners can delete members". 	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
055a8d84-dc22-4aad-8d37-adbe9e19545d	f61f40f0-4ece-419c-a554-d659ac990ba7	Async Week	aq	async-week	\N	\N	\N	600ccd3a-a513-4a4a-864b-e00bfc9699f9
77a17631-b400-4aaf-a4cd-09091e8714b0	0fe6380c-f7eb-4652-a4cc-fd778a4a36b5	A user has to join the team	f	a-user-has-to-join-the-team	2021-07-30 15:18:38.048	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	Signing up as owner allows creating the team. New flow here: https://www.figma.com/file/JtUxmZiS1RfZgREOmjKjKD/Final-flows?node-id=1496%3A62072	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
880ecb5b-b824-4afe-bcbb-59a968d1d803	0fe6380c-f7eb-4652-a4cc-fd778a4a36b5	Autocomplete emails	n	autocomplete-emails	2021-07-30 15:25:51.861	600ccd3a-a513-4a4a-864b-e00bfc9699f9	Something to do in the future, not now	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
a76e9cee-f598-4b10-a3bf-28de9b5f315e	a0f2285e-336a-4155-83a0-bc79fb27e670	Acapela User Story map	d	acapela-user-story-map	2021-07-30 15:45:52.783	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	The team got introduced to the user story map.	f30de478-b560-47f5-8588-8062ffc64a25
106b166b-b521-4776-bc32-4ec500ee7cd2	28df10bc-90db-4e7b-bd67-d2a864f9e964	Notion parts on Acapla	b	notion-parts-on-acapla	\N	\N	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
25383b6c-859b-4656-8a24-da4d3110ec97	c6d65e11-d335-4ab4-9d46-7ed3d9760c06	Requesting acknowledgement	e	requesting-acknowledgement	\N	\N	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
30337aa3-0269-42d8-9e6e-efac86a1db9e	0fe6380c-f7eb-4652-a4cc-fd778a4a36b5	enforce OAuth signup flow	l	enforce-oauth-signup-flow	\N	\N	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
ef11cb56-4eff-45f3-a347-702a914cb9f1	0fe6380c-f7eb-4652-a4cc-fd778a4a36b5	Reducing number of permissions during sign up	p	reducing-number-of-permissions-during-sign-up	\N	\N	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
fafc97b7-182c-4bd6-87ac-d444592c2c54	5ed709d5-d6b3-4d86-a26a-f847f88a0a57	Accordion arrow design	ag	accordion-arrow-design	2021-07-22 11:14:51.796	82f57a9f-6615-4527-816f-31ee7a0b7c98	We will change arrow pointing to the right to show that an element is closed. 	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
ac783c23-e52d-4786-97b1-26224a4de472	a0f2285e-336a-4155-83a0-bc79fb27e670	Acapela QA results	b	acapela-qa-results	2021-07-27 14:13:35.238	600ccd3a-a513-4a4a-864b-e00bfc9699f9	Thanks Arnoldas! That's solid work. Everyone is encouraged to check it. We will review & discuss as soon as Heiki is back	f30de478-b560-47f5-8588-8062ffc64a25
ed0cd994-b487-43f9-a7af-3bd5b64830b4	5ed709d5-d6b3-4d86-a26a-f847f88a0a57	Room invitation email	n	room-invitation-email	2021-07-28 06:59:07.901	ca652ee1-1423-42fe-a0ef-e5761a670845		6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
940314a3-c49c-460c-ba31-7dd36450fd1c	28df10bc-90db-4e7b-bd67-d2a864f9e964	Mentioning non room member	f	mentioning-non-room-member	\N	\N	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
9a0b5d33-e7ca-4a14-b693-44e988d4cc68	76d33092-f62b-49cc-aa9c-00ca0dd3b943	Mention notifications	n	mention-notifications	\N	\N	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
6a3cae7c-a380-4fc7-beb5-5660e516d8f6	afecb492-3666-4c8d-bf09-950723c0c04c	Testing notification center	b	testing-notification-center	2021-07-28 11:15:47.741	600ccd3a-a513-4a4a-864b-e00bfc9699f9	\N	600ccd3a-a513-4a4a-864b-e00bfc9699f9
dced53b7-5ea8-453b-b0d2-8b1aa88e87fd	c6d65e11-d335-4ab4-9d46-7ed3d9760c06	Topic assignment\n	d	topic-assignment	\N	\N	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
aee59dba-2ead-47b1-8d38-334fef5ebade	c6d65e11-d335-4ab4-9d46-7ed3d9760c06	Automated popup on due date	f	automated-popup-on-due-date	\N	\N	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
d346172f-a1b2-48f4-b1e1-ea65bfbfaa6c	5ed709d5-d6b3-4d86-a26a-f847f88a0a57	Manage Participants Modal Overflow	p	manage-participants-modal-overflow	2021-07-29 07:39:54.909	ca652ee1-1423-42fe-a0ef-e5761a670845	When too many members make modal smaller and have a scroll in the members list.	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
f22e69ce-7082-4cb9-a4ce-e6cf8e71d2fc	28df10bc-90db-4e7b-bd67-d2a864f9e964	Anchor other topics	d	anchor-other-topics	2021-07-29 12:14:30.211	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	Potential future feature, nothing to be done now.	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
534402d8-8489-44c8-baa4-eb1608ed0df9	76d33092-f62b-49cc-aa9c-00ca0dd3b943	Unread notifications test	p	unread-notifications-test	\N	\N	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
5a4c6026-1e3a-4a0e-9f6f-b8245067de7f	7461fe76-712a-4bb7-9442-983101dfc281	New topic	f	new-topic-YgPWY	2021-07-30 08:00:04.553	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
d109bee0-13f8-4a3f-9f99-c0c44b5c6ba8	7461fe76-712a-4bb7-9442-983101dfc281	New topic	b	new-topic-JfDpE	2021-07-30 08:00:04.553	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
bae4482e-a3b5-4d4f-ac31-e744b9d8cc10	7461fe76-712a-4bb7-9442-983101dfc281	New topic	n	new-topic-wAOho	\N	\N	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
52fba8d8-7964-4248-a182-c72798e80be5	d1762c9b-d55e-4034-baf0-04cd28a79452	Framework	b	framework	2021-07-30 10:58:43.7	69324499-ae41-4ce4-bdaa-6072e0e5c2d3	We decided to go with playwright	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
c5707707-dbec-4b11-87e8-bf0f0cb6bbaa	0fe6380c-f7eb-4652-a4cc-fd778a4a36b5	Creating the team before onboarding	d	creating-the-team-before-onboarding	2021-07-30 15:15:31.047	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	Onboarding new team process:\n- We will create the team before the onboarding\n- Then we will manually assign the ownership to the "Team owner"\n- After the onboarding, they will kick us out of the team members so that we do not have any access to their conversations.	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
6bba30f9-e03a-447f-b883-32b548f2df98	5fcf1905-d2cd-495f-9080-56fe218949b6	Tiny but mean content decisions we need to make soon as well	cw	tiny-but-mean-content-decisions-we-need-to-make-soon-as-well	2021-08-09 07:43:34.726	f30de478-b560-47f5-8588-8062ffc64a25	Final copy already decided upon. Rest of decisions left exported to check-in on Monday.	25db9c19-f84e-40d8-9dfb-ee94478ca40a
aff449b5-f49f-4417-8258-8a671518962e	bc605602-de72-4582-80bf-426980cfc9e3	Intro	b	intro	\N	\N	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
90430aff-6410-494f-ad50-94aaf8eb0292	5fcf1905-d2cd-495f-9080-56fe218949b6	Overview of the visual directions to choose from	o	overview-of-the-visual-directions-to-choose-from	2021-08-04 13:20:06.441	25db9c19-f84e-40d8-9dfb-ee94478ca40a		25db9c19-f84e-40d8-9dfb-ee94478ca40a
9e0612da-7c2d-460b-aa24-b762d4202b88	b1e4d74b-916e-44cd-a8ce-cc685927058c	Purpose of this Room	an	purpose-of-this-room	2021-08-09 08:01:31.495	f30de478-b560-47f5-8588-8062ffc64a25	Unfortunately, we had to go sync & moved the Acapela to another room	600ccd3a-a513-4a4a-864b-e00bfc9699f9
df0bcc2f-0459-4b5a-af3f-6bf616b393f3	54afb680-f7ad-4ac3-973e-a1a53c4b7c68	Link to concept iterations	d	link-to-concept-iterations	2021-08-09 14:15:57.734	600ccd3a-a513-4a4a-864b-e00bfc9699f9	Closing this conversation as the conversation is outdated	82f57a9f-6615-4527-816f-31ee7a0b7c98
e6fa7e76-533c-45fa-85b8-ecef973c3c00	cf9197da-a54f-4735-b942-771424d3983d	Sync current_team_id	h	sync-current-team-id	2021-08-06 09:28:08.771	ca652ee1-1423-42fe-a0ef-e5761a670845	We introduce TeamContext, in it on server side we read the value from JWT token, but on client side we instantly start to subscribe for changes there, and if change happens we either refresh the page or we update the value in context which will result in entire app being re-rendered with new team in the context.	ca652ee1-1423-42fe-a0ef-e5761a670845
7da19367-6883-4946-b4e6-789744d03b89	5fcf1905-d2cd-495f-9080-56fe218949b6	Screenshots animations	ce	screenshots-animations	\N	\N	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
a3bb912d-893d-40b9-bda9-5f74c5da9d2a	cf9197da-a54f-4735-b942-771424d3983d	Multiple messages in a row shouldn't show Sender header	g	multiple-messages-in-a-row-shouldnt-show-sender-header	2021-08-10 13:03:41.252	7a90bccb-346e-4933-aaeb-cdef732be976	Created linerar ticket https://linear.app/acapela/issue/ACA-645/subsequent-messages-from-same-user-should-be-shown-in-without	ca652ee1-1423-42fe-a0ef-e5761a670845
5402f67d-3e1f-46df-a5de-71d8f162e9c6	5fcf1905-d2cd-495f-9080-56fe218949b6	Checkin (Tue, 10 Aug)	cg	checkin-tue-10-aug	2021-08-11 07:33:12.209	82f57a9f-6615-4527-816f-31ee7a0b7c98	Check-in was done ✅	25db9c19-f84e-40d8-9dfb-ee94478ca40a
d5e1da06-f141-4bff-8b38-d480bf6c0b80	cf9197da-a54f-4735-b942-771424d3983d	Deploy Thursday	bh	deploy-thursday	2021-08-12 16:00:35.155	7a90bccb-346e-4933-aaeb-cdef732be976	Released v2.32.1 to prod\n	ca652ee1-1423-42fe-a0ef-e5761a670845
b620880f-3182-471f-88ed-2726bcebf800	cf9197da-a54f-4735-b942-771424d3983d	Is anyone using api.acape.la or api-staging.acape.la?	bp	is-anyone-using-apiacapela-or-api-stagingacapela	2021-08-11 10:46:56.286	69324499-ae41-4ce4-bdaa-6072e0e5c2d3	endpoints were shut down	ca652ee1-1423-42fe-a0ef-e5761a670845
074089ce-2f23-49b6-bfa5-7b8b2f7a1f31	6d2dce9f-bbb3-42f8-ab65-e6582e2ec894	Creating end-to-end tests	b	creating-end-to-end-tests	2021-08-11 14:11:04.068	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	Let's have 1-3 E2E tests for core user flows in the beginning.\nLet's add more tests on an ongoing basis once we find more bugs and we believe they could occur again.	7879f271-4036-48be-befb-f08de052bcdc
368d5a03-d0f1-4af7-9ce4-dc55cb7571a3	6d2dce9f-bbb3-42f8-ab65-e6582e2ec894	Component-based fetching	n	component-based-fetching	2021-08-11 14:50:01.269	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	We will migrate to fragments with focus on improving room interaction speed.	7879f271-4036-48be-befb-f08de052bcdc
d7ea0771-8275-4dec-a537-a45fff12922a	27a44750-24d1-4aa5-b3c2-e2bb4c9be61e	New topic	n	new-topic-Mzg8P	2021-08-12 13:13:08.075	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
b0710d71-7225-48bd-983a-4bac000e28ea	27a44750-24d1-4aa5-b3c2-e2bb4c9be61e	New topic	t	new-topic-uByDR	2021-08-12 13:13:08.075	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
199c2d94-5468-46a4-bdef-111304e7d005	3f502912-011c-4bd3-8af5-714a47bd7bfb	Naming conventions	b	color-naming	2021-08-12 13:32:26.7	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
1eeb42bc-106a-4487-bf2f-b78f948cddae	3f502912-011c-4bd3-8af5-714a47bd7bfb	Decisions	d	decisions	2021-08-12 13:32:26.7	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
375b6658-2684-4295-83c8-09c5d062749d	385c3cc5-ac05-4913-91c1-a7560cefdc93	Context	an	context	\N	\N	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
608df3c5-f75e-4457-81f0-3aa52cc47c9d	742634cf-bc44-43df-a1e2-c5e087c2e116	New topic	w	new-topic-94gK1	2021-08-12 14:04:26.428	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
59ebd84d-6382-43e3-b5ed-d5f6ef582f2c	8e4ce16b-d503-4077-869e-fa0eb955e555	'Reply on your own time'	an	reply-on-your-own-time	2021-08-12 14:42:05.016	f30de478-b560-47f5-8588-8062ffc64a25	We should find a way to make Acapela MORE bullet-proof against lost messages, otherwise we're not better than Slack	25db9c19-f84e-40d8-9dfb-ee94478ca40a
a3df9a5b-6188-4a59-b780-019b5897954c	e880dda2-9fa8-418f-9d3c-452225126c65	Growth & Marketing	w	growth-and-marketing	\N	\N	\N	f30de478-b560-47f5-8588-8062ffc64a25
59add48e-eb2e-41cc-babf-e37172728fce	cf9197da-a54f-4735-b942-771424d3983d	Deploy Monday	i	deploy-monday	2021-08-09 10:18:35.989	7879f271-4036-48be-befb-f08de052bcdc		ca652ee1-1423-42fe-a0ef-e5761a670845
5c3e89c7-a099-49af-8c7a-54a70088d97a	0fe6380c-f7eb-4652-a4cc-fd778a4a36b5	Example spaces	h	example-spaces	2021-07-30 15:22:50.883	600ccd3a-a513-4a4a-864b-e00bfc9699f9	The first thing to be implemented would be having an "<Company'sName> Team" space automatically on first sign-up	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
c1c1d528-b74c-4847-8938-df9771bd02c1	0fe6380c-f7eb-4652-a4cc-fd778a4a36b5	duplicated invitations	j	duplicated-invitations	2021-07-30 15:24:39.679	600ccd3a-a513-4a4a-864b-e00bfc9699f9	We will start by having the button to resend the invitation for every user that has been invited and who have not accepted the invite	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
7d401447-9caf-4713-812c-f1072d277d5c	5ed709d5-d6b3-4d86-a26a-f847f88a0a57	Attachments improvements	e	attachments-improvements	2021-08-09 07:25:32.037	ca652ee1-1423-42fe-a0ef-e5761a670845	Continue with to-dos from https://linear.app/acapela/issue/ACA-581/improve-attachments-uxui	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
7fe5f795-13fb-4cb0-b888-a06f3ddf6cac	5fcf1905-d2cd-495f-9080-56fe218949b6	To dos for Thursday and Friday	ct	to-dos-for-thursday-and-friday	2021-08-09 07:43:59.299	f30de478-b560-47f5-8588-8062ffc64a25	Checked to-dos and added to checkin for Monday	25db9c19-f84e-40d8-9dfb-ee94478ca40a
6159e96d-a508-45e2-8868-345533482eed	5fcf1905-d2cd-495f-9080-56fe218949b6	Social Media Cover	c	social-media-cover	\N	\N	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
39b9b01b-8d3c-4ed5-b161-231d825b7f90	cf9197da-a54f-4735-b942-771424d3983d	how to reliably fix auto-scroll to bottom	gb	how-to-reliably-fix-auto-scroll-to-bottom	2021-08-10 11:31:50.381	7879f271-4036-48be-befb-f08de052bcdc	I have create a Linear issue for it:\nhttps://linear.app/acapela/issue/ACA-644/fix-chat-scroll-to-bottom-in-safari	ca652ee1-1423-42fe-a0ef-e5761a670845
2a2c495e-2921-45b6-9dd6-5c8245c63ea0	cf9197da-a54f-4735-b942-771424d3983d	PRs hungry for eyes	gan	prs-hungry-for-eyes	2021-08-10 11:33:39.488	7879f271-4036-48be-befb-f08de052bcdc	Yay, thanks Team	ca652ee1-1423-42fe-a0ef-e5761a670845
27187133-565c-4d11-9227-c8a068cdd154	cf9197da-a54f-4735-b942-771424d3983d	New Pattern for using theme colors found	f	new-pattern-for-using-theme-colors-found	2021-08-11 08:52:47.158	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	Implement toasts with theme colors.	ca652ee1-1423-42fe-a0ef-e5761a670845
ddf30ba1-4908-409d-ab39-cf57d34d658e	cf9197da-a54f-4735-b942-771424d3983d	PR Review Request Awareness	en	pr-review-request-awareness	2021-08-11 07:53:00.618	ca652ee1-1423-42fe-a0ef-e5761a670845	Notifications in #dev is enough	ca652ee1-1423-42fe-a0ef-e5761a670845
d86f2de5-853a-435a-ac57-dfc200e6a846	8e4ce16b-d503-4077-869e-fa0eb955e555	Ultimate Goal	ag	ultimate-goal	2021-08-12 14:41:17.47	f30de478-b560-47f5-8588-8062ffc64a25	Ultimate goal discussion is ongoing. Great input from Omar in this thread.	25db9c19-f84e-40d8-9dfb-ee94478ca40a
ba6f00ff-074e-41ab-b0f2-110e08b72e23	cf9197da-a54f-4735-b942-771424d3983d	Should closed topics be moved to the bottom of the topics list?	c	should-closed-topics-be-moved-to-the-bottom-of-the-topics-list	2021-08-11 11:16:21.217	7a90bccb-346e-4933-aaeb-cdef732be976	Review again once we have customer behaviour feedback	ca652ee1-1423-42fe-a0ef-e5761a670845
c9d1165c-a8f3-496d-8825-74c1cf81684e	5fcf1905-d2cd-495f-9080-56fe218949b6	Checkin (Wed, 11 Aug)	cf	checkin-wed-11-aug	2021-08-12 07:26:30.175	82f57a9f-6615-4527-816f-31ee7a0b7c98	Done 	25db9c19-f84e-40d8-9dfb-ee94478ca40a
78dc049f-b901-4a54-8068-05f5e3c879b8	e880dda2-9fa8-418f-9d3c-452225126c65	Next Week: Experimental Week	x	next-week-experimental-week	\N	\N	\N	600ccd3a-a513-4a4a-864b-e00bfc9699f9
87b6097f-6232-43f6-a3a8-0e1c3104212d	6d2dce9f-bbb3-42f8-ab65-e6582e2ec894	Client side cache	t	client-side-cache	2021-08-11 15:11:17.811	ee140dfb-14f6-41d3-b2b0-4e50764290d7	We will go first with fragments and optimizing Rooms performance	7879f271-4036-48be-befb-f08de052bcdc
206b161d-acbf-4844-8946-2fa4981de272	5fcf1905-d2cd-495f-9080-56fe218949b6	Checkin (Thu, 12 Aug)	ad	checkin-thu-12-aug	\N	\N	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
1b11054e-5c4d-4add-9e63-e72448846652	5ed709d5-d6b3-4d86-a26a-f847f88a0a57	Loader-placeholder for attachments	adn	loader-placeholder-for-attachments	2021-08-13 07:10:07.856	ca652ee1-1423-42fe-a0ef-e5761a670845	Show placeholder with a loader while uploading attachments	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
dc512cc6-7ef4-489b-9187-45a8202156ad	0fe6380c-f7eb-4652-a4cc-fd778a4a36b5	Space creation as part of onboarding	c	space-creation-as-part-of-onboarding	\N	\N	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
c1784cee-aa7e-4b69-8d0d-bdbbbfdb94b2	27a44750-24d1-4aa5-b3c2-e2bb4c9be61e	New topic	t	new-topic-pD81w	2021-08-12 13:13:08.075	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
c9082d89-1383-4f85-9a06-b3e2a518eaf5	385c3cc5-ac05-4913-91c1-a7560cefdc93	Arnoldas experiment	b	arnoldas-experiment	\N	\N	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
0948ffd3-19e3-4819-a667-0f9a4d3991f7	742634cf-bc44-43df-a1e2-c5e087c2e116	New topic	n	new-topic-o55JK	2021-08-12 14:04:26.428	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
63d96d4d-9eba-42f1-853b-c4756a104308	742634cf-bc44-43df-a1e2-c5e087c2e116	New topic	t	new-topic-frtEe	2021-08-12 14:04:26.428	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
b79e885e-41bd-4fd6-8fb1-9e04ef3424fa	fe514238-04d9-4388-9084-4b823511bb9f	Feedback Arnoldas	x	feedback-arnoldas	\N	\N	\N	ca652ee1-1423-42fe-a0ef-e5761a670845
3339f5b6-bf9d-4e8c-a4b0-91a660ff93a5	91b35e7f-66f0-470f-b208-47f89ebd3771	Website Interviews II	f	website-interviews-ii	2021-08-13 09:18:55.067	f30de478-b560-47f5-8588-8062ffc64a25	Debited to our account	25db9c19-f84e-40d8-9dfb-ee94478ca40a
c5ec9832-9fac-4c5f-b44f-de7dacedf5da	fe514238-04d9-4388-9084-4b823511bb9f	Feedback Omar	o	feedback-omar	\N	\N	\N	ca652ee1-1423-42fe-a0ef-e5761a670845
e0a7b845-b083-4f2c-a93b-38bd9d04df10	fe514238-04d9-4388-9084-4b823511bb9f	Calendar Events => Rooms	yz	calendar-events-rooms	\N	\N	\N	ca652ee1-1423-42fe-a0ef-e5761a670845
4225e883-1e99-4cab-9000-eee3c4dfd200	fe514238-04d9-4388-9084-4b823511bb9f	Feedback Gregor	s	feedback-gregor	\N	\N	\N	ca652ee1-1423-42fe-a0ef-e5761a670845
d2495640-61f5-4c4d-95ee-59999fe26f27	fe514238-04d9-4388-9084-4b823511bb9f	Feedback Heiki	q	feedback-heiki	\N	\N	\N	ca652ee1-1423-42fe-a0ef-e5761a670845
28799055-2bf2-420e-b6fb-6cb332de30b4	fe514238-04d9-4388-9084-4b823511bb9f	Feedback Roland	p	feedback-roland	\N	\N	\N	ca652ee1-1423-42fe-a0ef-e5761a670845
daea1cc1-364d-4be3-a8d3-ba1259d61e54	cf9197da-a54f-4735-b942-771424d3983d	Filtering rooms in RoomList	aq	filtering-rooms-in-roomlist	2021-08-13 14:46:42.537	7a90bccb-346e-4933-aaeb-cdef732be976	To be released in this commit\nhttps://github.com/weareacapela/monorepo/releases/tag/v2.34.1	ca652ee1-1423-42fe-a0ef-e5761a670845
82924aaa-5223-4dd1-bbce-65b1f7dd1f37	8f9e0e7e-4b81-452e-be93-e93c14d26941	Where do we start? Outcomes of the internal survey	c	where-do-we-stand-outcomes-of-the-internal-survey	2021-08-03 16:43:45.94	25db9c19-f84e-40d8-9dfb-ee94478ca40a		6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
7ef55206-4dc3-44f9-89f2-8f141237b3a7	cf9197da-a54f-4735-b942-771424d3983d	All Typescript Errors fixed PR	e	all-typescript-errors-fixed-pr	2021-08-11 09:25:10.112	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	Merged.	ca652ee1-1423-42fe-a0ef-e5761a670845
fdc4af0e-d8ac-46de-a2fa-0e0045529c67	cf9197da-a54f-4735-b942-771424d3983d	Resending an invite	gn	resending-an-invite	2021-08-04 13:29:29.876	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	Rodion will ask for a design for resending an invitation	ca652ee1-1423-42fe-a0ef-e5761a670845
a61bd1a0-ab6c-4c3d-8ef2-d90dd7b4ceef	cf9197da-a54f-4735-b942-771424d3983d	How to modify SQL View in Hasura	gg	how-to-modify-sql-view-in-hasura	2021-08-09 09:22:45.674	ca652ee1-1423-42fe-a0ef-e5761a670845	Use "this is a migration" when modifying SQL views	ca652ee1-1423-42fe-a0ef-e5761a670845
24a10f8e-2a51-48ec-ba9a-a756a822ce6e	91b35e7f-66f0-470f-b208-47f89ebd3771	Explanation	an	explanation	2021-08-13 09:19:35.217	f30de478-b560-47f5-8588-8062ffc64a25	Britta clarified, Roland left 	25db9c19-f84e-40d8-9dfb-ee94478ca40a
a442e7be-2447-493d-9403-78b4969d569c	5fcf1905-d2cd-495f-9080-56fe218949b6	Features vs user flows	i	features-vs-user-flows	2021-08-05 07:45:43.815	25db9c19-f84e-40d8-9dfb-ee94478ca40a		25db9c19-f84e-40d8-9dfb-ee94478ca40a
bf3664b6-87c1-4932-9b2f-5cc5178c5fa0	54afb680-f7ad-4ac3-973e-a1a53c4b7c68	Social media cover	r	social-media-cover	2021-08-09 14:22:55.739	600ccd3a-a513-4a4a-864b-e00bfc9699f9	Moving the conversation to our current Acapela room regarding the Landing Page\n\nhttps://app.acape.la/space/1ff2fe4d-70a9-429a-b122-0a0c005ea33e/5fcf1905-d2cd-495f-9080-56fe218949b6/6159e96d-a508-45e2-8868-345533482eed	82f57a9f-6615-4527-816f-31ee7a0b7c98
40464e44-d5df-48cb-b862-5a9b5d4ffa11	f61f40f0-4ece-419c-a554-d659ac990ba7	Random	t	random	\N	\N	\N	600ccd3a-a513-4a4a-864b-e00bfc9699f9
0558025b-be7f-429b-9736-4764a82933f0	5ed709d5-d6b3-4d86-a26a-f847f88a0a57	Special way of displaying topics?	ae	special-way-of-displaying-topics	2021-08-12 09:54:09.296	ca652ee1-1423-42fe-a0ef-e5761a670845		6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
6f4d0bba-4553-4747-bd7b-0f91ab5617a2	f61f40f0-4ece-419c-a554-d659ac990ba7	Social	w	social	2021-08-12 16:03:29.862	f30de478-b560-47f5-8588-8062ffc64a25	Social was really awesome	600ccd3a-a513-4a4a-864b-e00bfc9699f9
8bdd2810-4147-4198-9008-67bdb770b440	cf9197da-a54f-4735-b942-771424d3983d	Notifications data shape	ae	notifications-data-shape	\N	\N	\N	ca652ee1-1423-42fe-a0ef-e5761a670845
48f01dec-6f89-41eb-a461-5c8aed9b8c76	cf9197da-a54f-4735-b942-771424d3983d	Embedded videos on Safari	af	embedded-videos-on-safari	\N	\N	\N	ca652ee1-1423-42fe-a0ef-e5761a670845
add6498d-bbfa-4d87-b3da-ff3115179a0e	cf9197da-a54f-4735-b942-771424d3983d	Prisma JSON API	gc	prisma-json-api	2021-08-10 15:22:32.395	7879f271-4036-48be-befb-f08de052bcdc	Adam helped me figure out that I had not enabled the json filtering feature yet	ca652ee1-1423-42fe-a0ef-e5761a670845
8785d709-a946-4bbb-8a55-8c2f3bf0a25e	27a44750-24d1-4aa5-b3c2-e2bb4c9be61e	New topic	q	new-topic-FGtDN	2021-08-12 13:13:08.075	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
302234fb-76ed-42cd-b9d2-959f66e7bdff	cf9197da-a54f-4735-b942-771424d3983d	New healthz endpoint is live on staging	eg	new-healthz-endpoint-is-live-on-staging	2021-08-11 08:49:48.256	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	healthz supports app versions	ca652ee1-1423-42fe-a0ef-e5761a670845
3a5978db-27ab-471b-88cf-fd7431226e17	cf9197da-a54f-4735-b942-771424d3983d	Deploy Wednesday	bo	deploy-wednesday	2021-08-11 12:54:24.432	7879f271-4036-48be-befb-f08de052bcdc	2.29.0 is deployed	ca652ee1-1423-42fe-a0ef-e5761a670845
9ba172a0-a1a7-4caa-a221-b8a2704e5a9c	8e4ce16b-d503-4077-869e-fa0eb955e555	Slack integration: Team Setup	h	slack-integration-team-setup	2021-08-12 14:42:48.138	f30de478-b560-47f5-8588-8062ffc64a25	Slack addon currently in dev. Discussion closed	25db9c19-f84e-40d8-9dfb-ee94478ca40a
1f144355-4143-4f39-8331-d688eed9a1b8	5fcf1905-d2cd-495f-9080-56fe218949b6	Buying Video / Photo assets	b	buying-video-photo-assets	\N	\N	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
d438642d-c090-43c5-9d22-2c4cedd787a4	8e4ce16b-d503-4077-869e-fa0eb955e555	Use case: a bigger project	k	use-case-a-bigger-project	2021-08-12 14:43:19.577	f30de478-b560-47f5-8588-8062ffc64a25	'Central topic' use case, which moves strongly into a product management direction is VERY strong	25db9c19-f84e-40d8-9dfb-ee94478ca40a
795d9351-a097-48a7-9c5a-7a0409341af4	f61f40f0-4ece-419c-a554-d659ac990ba7	Team Product Meeting	u	team-product-meeting	2021-08-13 07:11:26.901	f30de478-b560-47f5-8588-8062ffc64a25	Closed the room	600ccd3a-a513-4a4a-864b-e00bfc9699f9
5e1d4688-01f9-4040-8367-402d346492e5	cf9197da-a54f-4735-b942-771424d3983d	Not nullable room owner and topic owner	aw	not-nullable-room-owner-and-topic-owner	2021-08-13 04:04:38.73	ca652ee1-1423-42fe-a0ef-e5761a670845	Make room and topic owners non-nullable + create migration to set defaults to old rooms and topics	ca652ee1-1423-42fe-a0ef-e5761a670845
61659450-ba26-43cf-bc54-dbdeee7a39c8	cf9197da-a54f-4735-b942-771424d3983d	disabled button and mouseleave event	nn	disabled-button-and-mouseleave-event	2021-08-04 08:59:49.634	ca652ee1-1423-42fe-a0ef-e5761a670845	use pointerenter/pointerleave events	ca652ee1-1423-42fe-a0ef-e5761a670845
cb2365c8-f314-4744-a80e-a709a02817f8	cf9197da-a54f-4735-b942-771424d3983d	Next 11.1	au	next-111	2021-08-13 12:23:42.046	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	We could improve our build time with an upcoming Next.js version	ca652ee1-1423-42fe-a0ef-e5761a670845
a7e76ba5-9d54-4d3b-be5d-f74e782c6903	cf9197da-a54f-4735-b942-771424d3983d	Shared secrets	at	shared-secrets	2021-08-13 12:28:57.888	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	Invited team to 1password.	ca652ee1-1423-42fe-a0ef-e5761a670845
81146d99-7c5f-4b86-8826-de0b955093c1	fe514238-04d9-4388-9084-4b823511bb9f	Production Updates	y	production-updates	2021-08-13 14:39:21.344	f30de478-b560-47f5-8588-8062ffc64a25	Production updates 2.22.1 and 2.29.0 shipped	ca652ee1-1423-42fe-a0ef-e5761a670845
9752c7ba-94e3-4441-ae79-37118fcbd72e	fe514238-04d9-4388-9084-4b823511bb9f	Feedback Yuliia	u	feedback-yuliia	\N	\N	\N	ca652ee1-1423-42fe-a0ef-e5761a670845
45eafa21-ebc0-4843-9ca5-a3f65bcd3ebf	fe514238-04d9-4388-9084-4b823511bb9f	Feedback Jannick	xt	feedback-jannick	\N	\N	\N	ca652ee1-1423-42fe-a0ef-e5761a670845
3c9e5c02-47a1-47b0-95cf-cf2e6f7db188	d1762c9b-d55e-4034-baf0-04cd28a79452	Fixtures	f	fixtures	2021-08-10 13:01:03.251	69324499-ae41-4ce4-bdaa-6072e0e5c2d3		69324499-ae41-4ce4-bdaa-6072e0e5c2d3
164ebb7f-0c05-45d1-a74a-09d46248d2bf	ac29a6fb-cade-4cfe-8ef1-f163334abfdc	Ways to improve the implementation	j	ways-to-improve-the-implementation	2021-08-02 08:37:22.35	600ccd3a-a513-4a4a-864b-e00bfc9699f9	\N	600ccd3a-a513-4a4a-864b-e00bfc9699f9
fb058431-a63e-42a5-bd84-7de87c21427a	ac29a6fb-cade-4cfe-8ef1-f163334abfdc	Goal of this Acapela - Preparation	b	goal-of-this-acapela-preparation	2021-08-02 08:37:22.35	600ccd3a-a513-4a4a-864b-e00bfc9699f9	\N	600ccd3a-a513-4a4a-864b-e00bfc9699f9
6e435fa3-e3f1-48e1-a493-dde16cce43a6	ac29a6fb-cade-4cfe-8ef1-f163334abfdc	Review last planning	d	review-last-planning	2021-08-02 08:37:22.35	600ccd3a-a513-4a4a-864b-e00bfc9699f9	\N	600ccd3a-a513-4a4a-864b-e00bfc9699f9
dfbdedcf-3646-4ff7-b094-25cb7c630c24	ac29a6fb-cade-4cfe-8ef1-f163334abfdc	Ways to improve the planning	f	ways-to-improve-the-planning	2021-08-02 08:37:22.35	600ccd3a-a513-4a4a-864b-e00bfc9699f9	\N	600ccd3a-a513-4a4a-864b-e00bfc9699f9
065f3700-82a7-4025-bb40-c5362b53f3ba	4a4c995d-bbb4-4573-b170-db617d336b7b	Single Topic Rooms	b	single-topic-rooms	2021-08-03 14:46:25.462	f30de478-b560-47f5-8588-8062ffc64a25	tbd - check with user data regarding single-topic rooms and if this is a use case, optimize flows for it (sth for long list)	f30de478-b560-47f5-8588-8062ffc64a25
a61b79aa-6905-47ae-bbf8-4bd1df8ea21a	3fe4ae05-2ad1-4409-b487-b09c015c361c	Generic type inside theme	d	generic-type-inside-theme	2021-08-02 11:40:39.586	7a90bccb-346e-4933-aaeb-cdef732be976	\N	7a90bccb-346e-4933-aaeb-cdef732be976
d3b491f4-684e-4161-bc02-a8a2d8b096af	3fe4ae05-2ad1-4409-b487-b09c015c361c	Font style inside theme	o	font-style-inside-theme	2021-08-02 11:40:39.586	7a90bccb-346e-4933-aaeb-cdef732be976	\N	7a90bccb-346e-4933-aaeb-cdef732be976
85eb2862-060e-42da-b0bb-c70844c3e88d	3fe4ae05-2ad1-4409-b487-b09c015c361c	Typed strings and smart functions	p	typed-strings-and-smart-functions	2021-08-02 11:40:39.586	7a90bccb-346e-4933-aaeb-cdef732be976	\N	7a90bccb-346e-4933-aaeb-cdef732be976
885eabe5-ee9d-4574-b03a-921865923f62	fe514238-04d9-4388-9084-4b823511bb9f	Feedback Rodion	xw	feedback-rodion	\N	\N	\N	ca652ee1-1423-42fe-a0ef-e5761a670845
9b5f2c7c-4df1-48e6-89c1-1ae2d23e57c6	54afb680-f7ad-4ac3-973e-a1a53c4b7c68	Updated Timeline	j	updated-timeline	2021-08-02 14:49:38.836	600ccd3a-a513-4a4a-864b-e00bfc9699f9	Closing this here and moving this to the conversation with Adam, Jannick, Ana etc\n\nhttps://app.acape.la/space/1ff2fe4d-70a9-429a-b122-0a0c005ea33e/5b2a4c7a-2b4f-4cf0-9591-f91a8454722b/dc28716e-8807-4f93-b3f8-278fe40e280a	82f57a9f-6615-4527-816f-31ee7a0b7c98
dc28716e-8807-4f93-b3f8-278fe40e280a	5b2a4c7a-2b4f-4cf0-9591-f91a8454722b	Update on the concept iteration tests week 2 (Loom)	b	update-on-the-concept-iteration-tests-week-2-loom	2021-08-03 09:34:33.532	25db9c19-f84e-40d8-9dfb-ee94478ca40a	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
0cef7d91-df40-49f1-b9ea-be7b1457d560	d8ad568e-e0b7-424a-84d4-09e1e3105e37	Your input wanted!	b	your-input-wanted	2021-08-03 15:13:19.72	25db9c19-f84e-40d8-9dfb-ee94478ca40a	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
21870c63-93c0-4ec3-841e-bd813ae079d4	5b2a4c7a-2b4f-4cf0-9591-f91a8454722b	Updated Timeline	d	updated-timeline	2021-08-03 09:34:33.532	25db9c19-f84e-40d8-9dfb-ee94478ca40a	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
60b8e726-b97c-4f77-95bb-2702f8dcc216	5b2a4c7a-2b4f-4cf0-9591-f91a8454722b	Decision on website concept (Loom)	f	decision-on-website-concept-loom	2021-08-03 09:34:33.532	25db9c19-f84e-40d8-9dfb-ee94478ca40a	\N	25db9c19-f84e-40d8-9dfb-ee94478ca40a
afda9b41-aa30-4dde-9b3b-781c45133b69	79b7cb5f-f9f8-454e-967d-37cea8a81739	CODEOWNERS file	b	codeowners-file	2021-08-03 10:53:51.687	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	Chris and Gregor will take care of creating code owners	7879f271-4036-48be-befb-f08de052bcdc
e32c539a-adc3-4ec9-bf15-2d3311a1be29	d1762c9b-d55e-4034-baf0-04cd28a79452	Auth	h	auth	2021-08-03 10:56:42.922	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	We will use custom JWT tokens for auth	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
0ac27c5b-fa0a-4079-aa7a-5f76d332081d	080b882d-03e2-4aaa-b058-eec287d29486	Cadance	b	cadance	2021-08-03 16:31:53.811	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	Omar takes care of release QA management for this week and we decide the rotation frequency on Friday.	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
f4525973-166d-46e6-9d1b-e6f9e786c1ca	4a4c995d-bbb4-4573-b170-db617d336b7b	Differentiation to Slack / MS Teams	at	differentiation-to-slack-ms-teams	2021-08-03 14:19:31.462	f30de478-b560-47f5-8588-8062ffc64a25	Discussion: what is difference betw. Acapela and Slack? - 'closing the loop' (topic-focused vs channel-focused), structured, topics with not highest urgency	f30de478-b560-47f5-8588-8062ffc64a25
0e98bd99-373d-42e4-9d94-aea273569288	4a4c995d-bbb4-4573-b170-db617d336b7b	Activity centre feedback	j	activity-centre-feedback	2021-08-03 14:54:14.145	f30de478-b560-47f5-8588-8062ffc64a25	activity centre is WIP, Arnoldas got feedback, really good first shot	f30de478-b560-47f5-8588-8062ffc64a25
3ffa3d3c-ee5f-4ec6-b12d-33128498ce3f	5ed709d5-d6b3-4d86-a26a-f847f88a0a57	Resend an invitaton	aj	resend-an-invitaton	2021-08-04 09:11:45.901	ca652ee1-1423-42fe-a0ef-e5761a670845	Add button to resend an invitation	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
517f6e60-ddc7-48ad-b7c4-6a08167efc09	cf9197da-a54f-4735-b942-771424d3983d	Option to deactivate a team	n	option-to-deactivate-a-team	2021-08-04 12:11:59.568	ca652ee1-1423-42fe-a0ef-e5761a670845	Add a link to the /team page to clear current_team_id field for the current user.	ca652ee1-1423-42fe-a0ef-e5761a670845
3a3ff258-367a-4236-b2ba-40b2619108db	d1762c9b-d55e-4034-baf0-04cd28a79452	Local testing	d	local-testing	2021-08-03 10:57:04.423	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	use a testing hasura in CI (https://github.com/weareacapela/monorepo/blob/3e988866a395bf6ecd02ff50eddd49de0f7549f0/.github/workflows/e2e.yaml) and the same server/db as dev locally	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
fe1bcd9c-03c9-48e7-85c5-b4de3ade9287	5fcf1905-d2cd-495f-9080-56fe218949b6	Decisions on visual elements and style	d	decisions-on-visual-elements-and-style	2021-08-05 07:45:14.98	25db9c19-f84e-40d8-9dfb-ee94478ca40a		25db9c19-f84e-40d8-9dfb-ee94478ca40a
e0c2d69a-acfd-4080-9bcd-71fbc7f3a182	4a4c995d-bbb4-4573-b170-db617d336b7b	Incentives to close rooms	aw	incentives-to-close-rooms	2021-08-03 15:19:05.399	f30de478-b560-47f5-8588-8062ffc64a25	Incentives to close rooms one of the most crucial things tbd, Roland took notes\nNotes:\n- Good point by Omar that currently often not get closed\n- great observation by Britta: there is a lot of effort involved closing the room but only limited benefits\n-	f30de478-b560-47f5-8588-8062ffc64a25
2d595a43-5d31-45d0-b38f-0323c78dc7cb	cf9197da-a54f-4735-b942-771424d3983d	Shutdown public access backend[-staging].acape.la	br	shutdown-public-access-backend-stagingacapela	2021-08-11 10:47:08.764	69324499-ae41-4ce4-bdaa-6072e0e5c2d3	endpoints were shut down	ca652ee1-1423-42fe-a0ef-e5761a670845
d8d2844e-e84c-4c27-a1d7-c3310afafda0	cf9197da-a54f-4735-b942-771424d3983d	How would you debug a non-reproducible bug?	gd	how-would-you-debug-a-non-reproducible-bug	2021-08-09 11:29:23.669	7a90bccb-346e-4933-aaeb-cdef732be976		ca652ee1-1423-42fe-a0ef-e5761a670845
759033ee-010f-4517-8506-b65d6ad11ee8	cf9197da-a54f-4735-b942-771424d3983d	Generated files in VCS	b	generated-files-in-vcs	2021-08-11 16:09:35.447	7879f271-4036-48be-befb-f08de052bcdc	I've put it into an issue for posterity:\nhttps://linear.app/acapela/issue/ACA-647/drop-generated-files-from-vcs\n\nNot that we'd need to act on it soon, but I think we have it in an actionable state already.	ca652ee1-1423-42fe-a0ef-e5761a670845
67fc219e-072b-4b22-b295-0fd462aae098	8e4ce16b-d503-4077-869e-fa0eb955e555	1-1s	n	1-1s	2021-08-12 14:43:48.062	f30de478-b560-47f5-8588-8062ffc64a25	Currently, there is too much friction to actually start 1-1s	25db9c19-f84e-40d8-9dfb-ee94478ca40a
8819386c-658f-4629-9746-36de21ced530	cf9197da-a54f-4735-b942-771424d3983d	[Bug] Notifications are messing up routing for other rooms	an	bug-notifications-are-messing-up-routing-for-other-rooms	\N	\N	\N	ca652ee1-1423-42fe-a0ef-e5761a670845
18982189-4823-414e-b456-65e09d1237fa	5ed709d5-d6b3-4d86-a26a-f847f88a0a57	New Toast Component	ah	new-toast-component	2021-08-10 11:50:33.373	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	Design system updated with new types of toasts	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
dab455dc-a825-4287-816a-29310bd8c38f	c6d65e11-d335-4ab4-9d46-7ed3d9760c06	Room owner	l	room-owner	2021-08-11 09:22:13.687	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	Displaying room owner is live	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
8b62b6ad-fe39-40aa-b8b5-44284657b286	5ed709d5-d6b3-4d86-a26a-f847f88a0a57	New Room Summary UI	ad	new-room-summary-ui	\N	\N	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
b09018a0-a20b-4bd3-9852-e711754efbf5	f61f40f0-4ece-419c-a554-d659ac990ba7	Weekly Recap + Planning	ao	weekly-recap-planning	\N	\N	\N	600ccd3a-a513-4a4a-864b-e00bfc9699f9
4260972d-58a7-41bc-8ebb-a2c94c6cbe8c	76d33092-f62b-49cc-aa9c-00ca0dd3b943	Video attachments	hn	video-attachments	\N	\N	\N	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
13041466-28d1-49be-9f9c-baea49780335	5ed709d5-d6b3-4d86-a26a-f847f88a0a57	Mention @room	adg	mention-room	\N	\N	\N	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
6eaf91dc-0e6f-4760-a528-272403cdc422	e880dda2-9fa8-418f-9d3c-452225126c65	Product & Design	t	product-and-design	\N	\N	\N	600ccd3a-a513-4a4a-864b-e00bfc9699f9
8dac34bd-e5d0-4e88-97be-76ef1da6965a	e880dda2-9fa8-418f-9d3c-452225126c65	General	b	general	\N	\N	\N	f30de478-b560-47f5-8588-8062ffc64a25
\.


--
-- Data for Name: last_seen_message; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.last_seen_message (user_id, topic_id, message_id, seen_at) FROM stdin;
ee140dfb-14f6-41d3-b2b0-4e50764290d7	84ae1cf9-da5c-49f5-aa64-bdf5796cf16b	daab2e31-9be6-45c7-9754-654df9b43aa3	2021-08-04 10:06:37.768175+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	34389740-7677-46f3-89d6-76ea52017019	808b5c47-f912-48a8-89d9-82a5da8a55fe	2021-07-20 14:47:10.187902+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	7968122e-e49e-4d59-b1e7-d4e128824615	5207cd77-72d4-42eb-a63b-1c157028b15f	2021-07-21 14:55:20.562314+00
7879f271-4036-48be-befb-f08de052bcdc	810dbc47-af96-4c1b-bdbd-b1dcd6aa4322	5819c072-7410-47ae-99ab-454e1ba0b9ad	2021-08-15 14:52:10.736876+00
7a90bccb-346e-4933-aaeb-cdef732be976	b9b3f5f8-35a9-40cf-aed4-6f7cde6a2e37	c6e3996c-9029-4e1e-83cc-2e9c59543c6d	2021-07-30 15:32:28.110637+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	12a4253d-c1aa-4858-a8cd-b5c0ef17d220	32816c6c-966f-4501-b308-118503173965	2021-07-20 12:59:22.235693+00
7a90bccb-346e-4933-aaeb-cdef732be976	52fba8d8-7964-4248-a182-c72798e80be5	dd86731f-1f8b-47e3-8b1a-da973b40d38f	2021-08-11 12:27:51.476095+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	c09f5001-8876-40ac-bfb5-7468d65edfc2	dbb2cc36-14ba-4ba9-a67b-16d372ffe697	2021-07-20 13:31:32.783764+00
31f1de58-af98-4946-997c-622cb20d9504	c9d1165c-a8f3-496d-8825-74c1cf81684e	66afc351-67fb-459f-b76f-d0e635984579	2021-08-11 13:19:29.113543+00
7a90bccb-346e-4933-aaeb-cdef732be976	12a4253d-c1aa-4858-a8cd-b5c0ef17d220	32816c6c-966f-4501-b308-118503173965	2021-07-20 13:45:24.346317+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	59ebd84d-6382-43e3-b5ed-d5f6ef582f2c	ceede64f-114b-478d-9e04-6956e5d75853	2021-08-11 11:20:20.015456+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	839b9f13-e9ff-49f2-9e11-932b03ed8d10	fe74cd40-ae55-4e44-97fd-9ce3d238b4e3	2021-07-20 13:49:49.925145+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	dfbdedcf-3646-4ff7-b094-25cb7c630c24	bb8e3357-6980-4e2f-8e0f-06e384e3076c	2021-07-26 06:35:42.362315+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	1596717f-6516-4270-9d63-36cdf11a3427	6c515388-5d55-4741-aaff-d788d17ea43e	2021-08-02 13:45:58.619967+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	f49a2562-3073-4a5a-8c77-c2e7a514b63f	38d9a706-5fb8-41f8-937d-1d3129d0553f	2021-07-20 13:50:24.685075+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	df0bcc2f-0459-4b5a-af3f-6bf616b393f3	c10e0ac9-8a5c-4388-bfaf-9054564ae777	2021-08-04 07:44:23.206588+00
7a90bccb-346e-4933-aaeb-cdef732be976	52fe8757-21c1-4e21-b75f-c20bf1efdee4	b1f58e87-c038-4202-936e-de0ee5e90d66	2021-08-11 12:27:46.137569+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	df6b6e91-9e9d-4f59-aa10-58ba5b25f9e0	b8c48cfd-e9be-4b02-b07a-42426e620dd2	2021-07-20 14:20:55.088647+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	c09f5001-8876-40ac-bfb5-7468d65edfc2	dbb2cc36-14ba-4ba9-a67b-16d372ffe697	2021-07-20 14:20:56.127383+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	a61b79aa-6905-47ae-bbf8-4bd1df8ea21a	9acfc11a-0599-4689-801d-f18534d7a121	2021-08-02 15:01:39.86223+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	055a8d84-dc22-4aad-8d37-adbe9e19545d	a7048445-6393-4b95-8f93-7bd598be71a5	2021-08-13 14:30:25.899223+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	5c601a00-3bdd-4601-836c-dc9a4d9eff3d	d6146f20-fe4d-4389-a332-04c58fd7fd5f	2021-08-11 10:10:46.154834+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	fc45c751-19c6-421e-96e9-a0fe01874f37	9cc6c521-609c-471b-9150-99cebcb81d37	2021-07-20 12:00:08.057157+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	6f4d0bba-4553-4747-bd7b-0f91ab5617a2	f92b5c30-83a1-44a9-a1b7-17121f3e02a5	2021-08-12 14:23:25.228743+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	d3b9a5c5-04dd-4875-8440-b5726b3bb231	ebcd6f4b-87f6-4d4c-bd11-37a9ca334590	2021-08-13 08:23:33.55868+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	4260972d-58a7-41bc-8ebb-a2c94c6cbe8c	c93e721c-241e-4be8-8e9a-49ff42c48b0b	2021-08-13 15:46:17.659475+00
f30de478-b560-47f5-8588-8062ffc64a25	1596717f-6516-4270-9d63-36cdf11a3427	6c515388-5d55-4741-aaff-d788d17ea43e	2021-08-13 09:23:11.642376+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	c5707707-dbec-4b11-87e8-bf0f0cb6bbaa	0415fd19-f96b-48b6-87fc-ebdfc049d1c8	2021-08-13 06:19:44.498165+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	16571812-9e72-46d0-8568-cf402abd1f5e	87ada163-0f14-4ebd-8dee-027e8e7fd2c2	2021-08-02 13:47:30.184485+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	12aee6ec-e255-4446-b825-23a2dbdedcdd	c1be8837-8f97-405a-be74-e3d1b060317b	2021-08-13 07:01:01.400073+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	85eb2862-060e-42da-b0bb-c70844c3e88d	901d2c8c-652b-4240-8d22-578bf585d156	2021-07-23 07:27:37.594993+00
ca652ee1-1423-42fe-a0ef-e5761a670845	b3abd6a4-3434-4550-bc84-f1f452130e64	954a0596-1a33-4800-9a84-d07ea80c66ab	2021-08-03 14:36:00.748913+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	d1243295-e6ac-4da5-866f-582a9b419a4f	1d7f98a7-7661-4c6c-a423-50a194196406	2021-08-13 09:43:37.534462+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	df0bcc2f-0459-4b5a-af3f-6bf616b393f3	c10e0ac9-8a5c-4388-bfaf-9054564ae777	2021-08-09 14:15:36.874956+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	90430aff-6410-494f-ad50-94aaf8eb0292	d13ea718-f27e-48a8-8665-8737e1ca3e3b	2021-08-09 14:27:00.262446+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	77a17631-b400-4aaf-a4cd-09091e8714b0	95b4cb9a-fdab-469e-bed5-cfcbd15b77ed	2021-07-29 14:02:11.148797+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	19eda0fd-71e8-49fd-9847-d2b9d8466527	07bcb362-cb64-4029-9f0b-d6516dee551c	2021-07-26 12:26:44.709544+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	90430aff-6410-494f-ad50-94aaf8eb0292	d13ea718-f27e-48a8-8665-8737e1ca3e3b	2021-08-13 08:24:22.268947+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	7d4b2466-c340-4bb6-91d1-72f931cec5dc	26ad4d07-daed-4696-a729-95c2774a6848	2021-07-30 17:50:26.204937+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	b9b3f5f8-35a9-40cf-aed4-6f7cde6a2e37	c6e3996c-9029-4e1e-83cc-2e9c59543c6d	2021-08-09 14:47:43.189717+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	5c3e89c7-a099-49af-8c7a-54a70088d97a	cf71265a-7757-4d52-8424-71408935b9d4	2021-08-12 13:29:15.677043+00
ca652ee1-1423-42fe-a0ef-e5761a670845	e0a7b845-b083-4f2c-a93b-38bd9d04df10	c2a5ea37-6af1-404d-9706-9594b11d19ff	2021-08-13 08:51:28.51031+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	940314a3-c49c-460c-ba31-7dd36450fd1c	ddd4b267-c803-4bad-9317-428afca9f3b0	2021-08-11 11:40:42.283541+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	d1243295-e6ac-4da5-866f-582a9b419a4f	1d7f98a7-7661-4c6c-a423-50a194196406	2021-08-13 10:53:19.415725+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	d1652c94-3a20-405b-b578-4da26650989f	36c56f46-7680-4c24-9eed-84fbd17a396f	2021-07-23 19:22:38.27401+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	80439d52-b5f8-40d3-af3f-7947802431a3	b632a624-17ca-4039-9ac5-72d034e80d38	2021-07-26 18:02:00.257501+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	13041466-28d1-49be-9f9c-baea49780335	bba48c56-8d9a-47c1-8ffa-3b499b2496a7	2021-08-15 09:42:18.930649+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	5c3e89c7-a099-49af-8c7a-54a70088d97a	cf71265a-7757-4d52-8424-71408935b9d4	2021-08-13 09:50:32.666656+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	b09018a0-a20b-4bd3-9852-e711754efbf5	9f88b614-b23d-4878-84ce-b6fde7ab8c63	2021-08-13 08:22:45.392096+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	77a17631-b400-4aaf-a4cd-09091e8714b0	95b4cb9a-fdab-469e-bed5-cfcbd15b77ed	2021-07-30 15:18:31.846005+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	5d4e1943-67b7-4d68-9baf-3fa7c1df599e	8cd121cc-b932-49de-8511-b59fa5766dc2	2021-08-02 09:42:36.191442+00
7a90bccb-346e-4933-aaeb-cdef732be976	055a8d84-dc22-4aad-8d37-adbe9e19545d	a7048445-6393-4b95-8f93-7bd598be71a5	2021-08-10 07:34:39.032762+00
7a90bccb-346e-4933-aaeb-cdef732be976	810dbc47-af96-4c1b-bdbd-b1dcd6aa4322	5dc7b73f-0ed2-44da-b641-a166c7e0114d	2021-08-04 16:49:44.691703+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	454b94ed-7e72-4a9e-b221-efc9aad86483	fe1194a2-9755-4704-ac1e-69f949d49b3d	2021-07-30 17:50:18.617688+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	df6b6e91-9e9d-4f59-aa10-58ba5b25f9e0	0cb79a53-cde5-423a-bb70-d640b00da5de	2021-07-20 13:03:35.690532+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	f49a2562-3073-4a5a-8c77-c2e7a514b63f	38d9a706-5fb8-41f8-937d-1d3129d0553f	2021-07-20 14:27:15.148755+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	447c3879-98b7-45f7-a978-77f20fc8c69a	784bbc4e-7eca-43e8-9beb-e38d7f0e84a6	2021-08-05 08:15:01.539878+00
7a90bccb-346e-4933-aaeb-cdef732be976	a61b79aa-6905-47ae-bbf8-4bd1df8ea21a	9acfc11a-0599-4689-801d-f18534d7a121	2021-08-02 11:40:22.614684+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	454b94ed-7e72-4a9e-b221-efc9aad86483	fe1194a2-9755-4704-ac1e-69f949d49b3d	2021-07-20 14:22:55.784537+00
7a90bccb-346e-4933-aaeb-cdef732be976	9fa78080-867b-4e01-b60a-6f47b55c4b58	68968fa4-c47e-42a0-921f-78030a945dff	2021-08-09 11:26:22.192383+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	19eda0fd-71e8-49fd-9847-d2b9d8466527	07bcb362-cb64-4029-9f0b-d6516dee551c	2021-07-28 06:55:31.259429+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	3a2032b1-8190-47b2-84d6-28998118838d	763a6c67-a61f-4d3c-8272-d4cfb168f8c1	2021-08-13 08:28:14.176064+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	c09f5001-8876-40ac-bfb5-7468d65edfc2	dbb2cc36-14ba-4ba9-a67b-16d372ffe697	2021-07-20 14:43:04.532977+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	fe1bcd9c-03c9-48e7-85c5-b4de3ade9287	c913c0f2-2363-4201-973c-8f078d82a21d	2021-08-13 08:24:20.08575+00
f30de478-b560-47f5-8588-8062ffc64a25	12a4253d-c1aa-4858-a8cd-b5c0ef17d220	32816c6c-966f-4501-b308-118503173965	2021-07-20 14:35:42.336808+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	17b401b9-004c-446d-8b31-c072c5ad870d	d9784f9f-da93-4980-9eff-a0dc6ab619a9	2021-08-13 08:28:15.247799+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	f49a2562-3073-4a5a-8c77-c2e7a514b63f	33e38b64-688a-4e41-bc30-f66f60da0534	2021-07-20 13:31:52.484609+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	810dbc47-af96-4c1b-bdbd-b1dcd6aa4322	5819c072-7410-47ae-99ab-454e1ba0b9ad	2021-08-13 09:24:03.109572+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	810dbc47-af96-4c1b-bdbd-b1dcd6aa4322	5819c072-7410-47ae-99ab-454e1ba0b9ad	2021-08-13 09:23:29.345495+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	3a2032b1-8190-47b2-84d6-28998118838d	feba0481-ce03-49d7-9599-7093a35f59cb	2021-08-05 07:05:27.704083+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	a8663afc-06b9-4e95-a9c8-bd57f898bf52	3a9a1050-e9f8-4841-a44b-f722da51eeb2	2021-08-13 15:58:02.631519+00
7a90bccb-346e-4933-aaeb-cdef732be976	839b9f13-e9ff-49f2-9e11-932b03ed8d10	fe74cd40-ae55-4e44-97fd-9ce3d238b4e3	2021-07-20 13:45:20.56271+00
7879f271-4036-48be-befb-f08de052bcdc	d86f2de5-853a-435a-ac57-dfc200e6a846	dc9029ba-80c2-46e2-a174-cda085fda710	2021-08-11 21:25:00.721199+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	17b401b9-004c-446d-8b31-c072c5ad870d	d9784f9f-da93-4980-9eff-a0dc6ab619a9	2021-08-06 06:57:21.481925+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	17b401b9-004c-446d-8b31-c072c5ad870d	d9784f9f-da93-4980-9eff-a0dc6ab619a9	2021-08-06 19:58:11.321956+00
31f1de58-af98-4946-997c-622cb20d9504	7da19367-6883-4946-b4e6-789744d03b89	2fce887d-ac35-4ed0-b153-1268d3d11783	2021-08-11 13:19:36.874426+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	5d4e1943-67b7-4d68-9baf-3fa7c1df599e	8cd121cc-b932-49de-8511-b59fa5766dc2	2021-08-09 14:14:56.354651+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	9fa78080-867b-4e01-b60a-6f47b55c4b58	46e36af0-49e5-4811-b432-d4b3c11a6e4f	2021-08-05 08:14:56.391176+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	df0bcc2f-0459-4b5a-af3f-6bf616b393f3	c10e0ac9-8a5c-4388-bfaf-9054564ae777	2021-07-22 09:34:17.696578+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	7968122e-e49e-4d59-b1e7-d4e128824615	5207cd77-72d4-42eb-a63b-1c157028b15f	2021-07-20 12:00:13.120574+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	9fa78080-867b-4e01-b60a-6f47b55c4b58	055d299c-3cbd-46ed-bb53-daa2ca8bf69c	2021-08-13 08:22:46.502346+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	447c3879-98b7-45f7-a978-77f20fc8c69a	5051bf3d-cd6e-470c-aa3a-58f9deb28349	2021-08-13 07:27:02.324898+00
ca652ee1-1423-42fe-a0ef-e5761a670845	ec23d178-0a3a-4eaf-b2de-ef36bf46c235	fba5632d-6893-4ff2-bd5b-45087349ebbc	2021-07-20 14:02:07.060861+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	fafc97b7-182c-4bd6-87ac-d444592c2c54	71dfb5a6-7cba-4ae2-b796-fe222b363b14	2021-08-12 11:38:06.921117+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	447c3879-98b7-45f7-a978-77f20fc8c69a	5051bf3d-cd6e-470c-aa3a-58f9deb28349	2021-08-13 08:22:52.93197+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	b9b3f5f8-35a9-40cf-aed4-6f7cde6a2e37	c6e3996c-9029-4e1e-83cc-2e9c59543c6d	2021-07-21 14:53:19.397114+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	9fa78080-867b-4e01-b60a-6f47b55c4b58	055d299c-3cbd-46ed-bb53-daa2ca8bf69c	2021-08-13 09:23:34.912758+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	7968122e-e49e-4d59-b1e7-d4e128824615	5207cd77-72d4-42eb-a63b-1c157028b15f	2021-07-20 11:54:58.404779+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	560f0651-59d7-4641-ab99-24776dceddc6	cda93be0-0f87-4593-9269-d050a86e07ae	2021-07-28 10:05:43.483824+00
ca652ee1-1423-42fe-a0ef-e5761a670845	8318452f-09bc-48ae-b89b-6c479ff3ce34	42765fd4-2d60-48f6-bf4a-6da85851d6e1	2021-08-10 10:03:29.126712+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	c09f5001-8876-40ac-bfb5-7468d65edfc2	dbb2cc36-14ba-4ba9-a67b-16d372ffe697	2021-07-20 12:31:12.621876+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	839b9f13-e9ff-49f2-9e11-932b03ed8d10	2f7b35e9-cf0b-481f-b062-45642d2c94b8	2021-07-20 14:33:25.490865+00
7879f271-4036-48be-befb-f08de052bcdc	950ad578-3e05-4e73-aed4-25a21b5393ac	3578dfe7-b063-4b89-8575-890f3e409292	2021-08-11 09:30:50.292981+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	62a36a3c-e335-4022-90ef-d3a5e3615d11	98bbde58-3ed6-4bf7-b5dc-9b1253e9dad4	2021-07-28 10:22:57.236066+00
f30de478-b560-47f5-8588-8062ffc64a25	3a2032b1-8190-47b2-84d6-28998118838d	763a6c67-a61f-4d3c-8272-d4cfb168f8c1	2021-08-13 07:18:41.358757+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	50cc22f8-e1b5-4e97-b005-57794768edae	5df47275-e69a-463a-8850-5a7a51cca633	2021-07-20 14:25:58.449092+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	44660c03-0bba-42df-b615-b3638a56d282	dfc56311-3d5a-4de5-8eb3-7c6fcc2a5bdf	2021-08-05 08:59:45.338194+00
7879f271-4036-48be-befb-f08de052bcdc	055a8d84-dc22-4aad-8d37-adbe9e19545d	a7048445-6393-4b95-8f93-7bd598be71a5	2021-08-11 12:35:41.319542+00
7a90bccb-346e-4933-aaeb-cdef732be976	2f38aa46-5517-4c9b-b060-81e3a2864bee	ded454bb-ca80-4430-a983-b67c42fce6cc	2021-08-04 08:03:08.571047+00
7879f271-4036-48be-befb-f08de052bcdc	59ebd84d-6382-43e3-b5ed-d5f6ef582f2c	ceede64f-114b-478d-9e04-6956e5d75853	2021-08-11 21:23:39.85838+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	afda9b41-aa30-4dde-9b3b-781c45133b69	eefce1eb-17a5-4a47-ab53-f9659667678f	2021-08-03 10:54:04.641785+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	8819386c-658f-4629-9746-36de21ced530	a1e8d9ad-07b5-4805-8b92-e11d9799ac58	2021-08-13 09:25:35.458457+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	df6b6e91-9e9d-4f59-aa10-58ba5b25f9e0	e3be1bfc-5d2c-4b08-b0b7-a6e391d0c15b	2021-07-20 14:39:31.35481+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	3a2032b1-8190-47b2-84d6-28998118838d	763a6c67-a61f-4d3c-8272-d4cfb168f8c1	2021-08-13 06:59:27.733482+00
7a90bccb-346e-4933-aaeb-cdef732be976	17b401b9-004c-446d-8b31-c072c5ad870d	d2f0a3a8-23ba-45a3-9765-83c4ae9b45c8	2021-06-28 07:32:07.214765+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	839b9f13-e9ff-49f2-9e11-932b03ed8d10	2f7b35e9-cf0b-481f-b062-45642d2c94b8	2021-07-20 15:43:15.659695+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	5d4e1943-67b7-4d68-9baf-3fa7c1df599e	8cd121cc-b932-49de-8511-b59fa5766dc2	2021-08-09 17:23:10.356384+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	1d0464b7-8b84-4731-bb53-37c247f2b179	5fbfa618-762b-491f-a4d6-a550fbbe6382	2021-07-21 14:57:53.309107+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	ed320f20-c3c0-4ffa-9943-37df7eaa5ea8	db64ae10-1444-40c0-89bc-0eb434f484e4	2021-08-11 12:50:47.446128+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	69e20f79-d685-4bf8-b21a-73dbbef108e2	3fbc70f0-c56f-40f9-886b-af0d4a7759fc	2021-08-12 13:13:41.444191+00
7a90bccb-346e-4933-aaeb-cdef732be976	b3abd6a4-3434-4550-bc84-f1f452130e64	954a0596-1a33-4800-9a84-d07ea80c66ab	2021-08-04 08:02:44.131535+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	1ef10234-ceff-4c57-a295-facbed92592d	8ddc7590-9fce-431f-8f39-19e6d3ee9abf	2021-07-21 16:20:34.036484+00
f30de478-b560-47f5-8588-8062ffc64a25	810dbc47-af96-4c1b-bdbd-b1dcd6aa4322	5819c072-7410-47ae-99ab-454e1ba0b9ad	2021-08-13 07:55:58.200053+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	1f144355-4143-4f39-8331-d688eed9a1b8	d1039854-3d2e-4b25-90c2-2ed8e23a66f7	2021-08-11 15:03:09.393398+00
f30de478-b560-47f5-8588-8062ffc64a25	2f38aa46-5517-4c9b-b060-81e3a2864bee	49cd8bf0-e55e-4a87-bfec-2d4dc3fa9b0a	2021-08-13 07:35:36.398197+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	29f7bc2a-76ff-4f94-8cb1-1f11045297a1	8d2ed941-79c3-4319-89ad-1b98789f0ff1	2021-08-13 15:40:32.78921+00
f30de478-b560-47f5-8588-8062ffc64a25	447c3879-98b7-45f7-a978-77f20fc8c69a	5051bf3d-cd6e-470c-aa3a-58f9deb28349	2021-08-13 07:56:05.439275+00
7879f271-4036-48be-befb-f08de052bcdc	daea1cc1-364d-4be3-a8d3-ba1259d61e54	d006e0dd-7681-4f0f-bae7-9a875897b089	2021-08-15 14:43:35.278734+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	81146d99-7c5f-4b86-8826-de0b955093c1	0a95bf22-143d-4af9-9494-3b11e9ccd095	2021-08-13 08:24:10.549856+00
ca652ee1-1423-42fe-a0ef-e5761a670845	fafc97b7-182c-4bd6-87ac-d444592c2c54	71dfb5a6-7cba-4ae2-b796-fe222b363b14	2021-08-11 07:51:34.400067+00
ca652ee1-1423-42fe-a0ef-e5761a670845	67fc219e-072b-4b22-b295-0fd462aae098	00132319-d2d2-4400-b09d-8a39e383d9a1	2021-08-10 12:17:38.366479+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	17b401b9-004c-446d-8b31-c072c5ad870d	d9784f9f-da93-4980-9eff-a0dc6ab619a9	2021-08-05 08:53:23.616123+00
ca652ee1-1423-42fe-a0ef-e5761a670845	e0c2d69a-acfd-4080-9bcd-71fbc7f3a182	16a678fd-824e-4821-98b2-bf3210264a5f	2021-08-03 14:36:02.691201+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	810dbc47-af96-4c1b-bdbd-b1dcd6aa4322	5dc7b73f-0ed2-44da-b641-a166c7e0114d	2021-08-04 08:54:54.933388+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	c09f5001-8876-40ac-bfb5-7468d65edfc2	dbb2cc36-14ba-4ba9-a67b-16d372ffe697	2021-07-20 12:43:50.071879+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	a3df9a5b-6188-4a59-b780-019b5897954c	993750d5-c564-4265-87d6-ff428191e27b	2021-08-13 11:19:10.597073+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	16f2850f-f630-44da-8529-d05b38e03394	186c0683-a50e-45a5-89cd-a20bd26242d9	2021-06-23 08:19:20.44942+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	7e4b0258-e951-48ba-957d-9eb46d06a520	f9a2aae1-7138-4839-be3f-6dee7cef1000	2021-06-24 09:04:43.800463+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	46cfadba-77ea-42f8-b81f-afa0ab158576	593b3b6b-92f7-4a7c-b061-d47e3fcfbd88	2021-06-24 09:30:30.929671+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	6c291865-999e-4a1d-9588-5ad93cedbbf5	c2abe858-db8a-4ec1-8eb0-12fbd48923b9	2021-08-04 08:55:17.260468+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	46cfadba-77ea-42f8-b81f-afa0ab158576	593b3b6b-92f7-4a7c-b061-d47e3fcfbd88	2021-06-25 07:25:12.770671+00
ca652ee1-1423-42fe-a0ef-e5761a670845	6c291865-999e-4a1d-9588-5ad93cedbbf5	465ef5cd-2145-4c88-99f3-92bccec3a0f7	2021-08-10 05:58:33.135491+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	560f0651-59d7-4641-ab99-24776dceddc6	317c6c5e-603b-4afa-a836-80c2e42421ac	2021-07-28 14:15:05.484113+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	fcc42886-7ae4-4f92-b31a-a90d0df23f6d	e30a2dcf-4d73-4bbf-b235-37210c936ae0	2021-07-19 13:02:47.234397+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	447c3879-98b7-45f7-a978-77f20fc8c69a	5051bf3d-cd6e-470c-aa3a-58f9deb28349	2021-08-13 08:28:25.884955+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	46cfadba-77ea-42f8-b81f-afa0ab158576	593b3b6b-92f7-4a7c-b061-d47e3fcfbd88	2021-06-22 16:05:47.493704+00
7a90bccb-346e-4933-aaeb-cdef732be976	447c3879-98b7-45f7-a978-77f20fc8c69a	07f228e6-0c47-4b34-9091-825c15126da8	2021-08-04 19:02:01.035611+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	810dbc47-af96-4c1b-bdbd-b1dcd6aa4322	5819c072-7410-47ae-99ab-454e1ba0b9ad	2021-08-13 08:28:05.674599+00
f30de478-b560-47f5-8588-8062ffc64a25	8209f70d-d1be-4707-834b-3f45dd3b2178	7782e78d-6ffb-4f78-b91c-726b77ad99be	2021-06-24 09:19:57.343597+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	8209f70d-d1be-4707-834b-3f45dd3b2178	7782e78d-6ffb-4f78-b91c-726b77ad99be	2021-06-17 14:58:51.734049+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	46cfadba-77ea-42f8-b81f-afa0ab158576	593b3b6b-92f7-4a7c-b061-d47e3fcfbd88	2021-06-25 07:24:36.178336+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	f761c6ac-aa4c-4da9-bba5-32896711efc4	915ae12a-db4e-4ac6-a9b3-bd3904b31021	2021-06-10 15:52:12.426324+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	8ef2ac54-7d44-4bfd-b897-f88ee920764e	4230fd13-f3b9-4c9b-9137-f0d403e4c60f	2021-08-13 10:53:35.184568+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	39b9b01b-8d3c-4ed5-b161-231d825b7f90	e69cf0a2-ef73-4048-9690-dab54353531e	2021-08-10 10:54:24.756118+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	f761c6ac-aa4c-4da9-bba5-32896711efc4	915ae12a-db4e-4ac6-a9b3-bd3904b31021	2021-06-24 09:04:57.181173+00
7a90bccb-346e-4933-aaeb-cdef732be976	44660c03-0bba-42df-b615-b3638a56d282	dffc1b88-ad58-4596-a03d-9bfb36dae6e6	2021-08-12 13:17:14.002887+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	a1301660-03c4-4d06-820f-b4cd9d0a64a9	6da586e6-2a3a-47ef-a683-e3ef87d9c6ee	2021-06-18 11:05:41.184167+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	8ef2ac54-7d44-4bfd-b897-f88ee920764e	4230fd13-f3b9-4c9b-9137-f0d403e4c60f	2021-08-13 07:27:06.347941+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	8ef2ac54-7d44-4bfd-b897-f88ee920764e	86e95c5b-be42-4b36-b3d8-d95ebd448d59	2021-08-05 06:30:15.942384+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	3ffa3d3c-ee5f-4ec6-b12d-33128498ce3f	1c7b20e9-e396-4a6a-88d5-0ab93a7b5192	2021-08-11 10:12:44.178741+00
7a90bccb-346e-4933-aaeb-cdef732be976	8ef2ac54-7d44-4bfd-b897-f88ee920764e	7e749727-f73b-4435-8846-d718ef972f4f	2021-08-09 11:42:28.340919+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	6c291865-999e-4a1d-9588-5ad93cedbbf5	8d9baf3b-8190-49f1-8c53-854fc751ade6	2021-08-13 08:28:18.368342+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	7e4b0258-e951-48ba-957d-9eb46d06a520	f9a2aae1-7138-4839-be3f-6dee7cef1000	2021-06-10 15:47:04.878528+00
f30de478-b560-47f5-8588-8062ffc64a25	46cfadba-77ea-42f8-b81f-afa0ab158576	593b3b6b-92f7-4a7c-b061-d47e3fcfbd88	2021-07-05 16:48:39.388717+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	a1301660-03c4-4d06-820f-b4cd9d0a64a9	6da586e6-2a3a-47ef-a683-e3ef87d9c6ee	2021-06-24 09:03:39.292055+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	44660c03-0bba-42df-b615-b3638a56d282	3120af3c-3255-4982-95c7-0ab6104e7a49	2021-08-13 08:27:57.178307+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	16f2850f-f630-44da-8529-d05b38e03394	186c0683-a50e-45a5-89cd-a20bd26242d9	2021-06-18 12:51:54.771525+00
7a90bccb-346e-4933-aaeb-cdef732be976	601996cc-a8e9-44e2-adde-4071301dc791	cf5808a1-656f-489e-bb50-d4f7b4ba7981	2021-06-17 14:32:08.877456+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	f761c6ac-aa4c-4da9-bba5-32896711efc4	915ae12a-db4e-4ac6-a9b3-bd3904b31021	2021-06-11 07:05:56.515038+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	a61bd1a0-ab6c-4c3d-8ef2-d90dd7b4ceef	ad804eb9-d31d-4311-aeeb-5e46de6e1802	2021-08-10 08:12:26.323331+00
f30de478-b560-47f5-8588-8062ffc64a25	601996cc-a8e9-44e2-adde-4071301dc791	cf5808a1-656f-489e-bb50-d4f7b4ba7981	2021-06-17 07:56:02.025651+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	eb7722ae-b13b-4a89-9162-6bb597524ee5	c24f7dff-9bee-48c6-be61-8d35e0841692	2021-06-24 09:03:55.612766+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	46cfadba-77ea-42f8-b81f-afa0ab158576	593b3b6b-92f7-4a7c-b061-d47e3fcfbd88	2021-06-28 15:38:26.215775+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	16f2850f-f630-44da-8529-d05b38e03394	186c0683-a50e-45a5-89cd-a20bd26242d9	2021-06-18 11:05:39.36505+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	8209f70d-d1be-4707-834b-3f45dd3b2178	7782e78d-6ffb-4f78-b91c-726b77ad99be	2021-06-10 15:52:43.838312+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	601996cc-a8e9-44e2-adde-4071301dc791	cf5808a1-656f-489e-bb50-d4f7b4ba7981	2021-06-15 08:01:11.721338+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	f761c6ac-aa4c-4da9-bba5-32896711efc4	915ae12a-db4e-4ac6-a9b3-bd3904b31021	2021-06-17 14:58:40.691076+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	a1301660-03c4-4d06-820f-b4cd9d0a64a9	6da586e6-2a3a-47ef-a683-e3ef87d9c6ee	2021-06-22 07:28:40.579643+00
7a90bccb-346e-4933-aaeb-cdef732be976	8209f70d-d1be-4707-834b-3f45dd3b2178	7782e78d-6ffb-4f78-b91c-726b77ad99be	2021-06-17 14:32:42.090467+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	601996cc-a8e9-44e2-adde-4071301dc791	cf5808a1-656f-489e-bb50-d4f7b4ba7981	2021-06-24 09:16:57.65861+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	4bede90b-6829-469f-8735-55a430a0547e	808f0f7a-e2ee-4b15-b2d5-2f175f03272e	2021-06-10 16:00:47.193127+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	8209f70d-d1be-4707-834b-3f45dd3b2178	7782e78d-6ffb-4f78-b91c-726b77ad99be	2021-06-15 11:53:35.352573+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	46cfadba-77ea-42f8-b81f-afa0ab158576	593b3b6b-92f7-4a7c-b061-d47e3fcfbd88	2021-06-24 08:33:42.731311+00
f30de478-b560-47f5-8588-8062ffc64a25	f761c6ac-aa4c-4da9-bba5-32896711efc4	915ae12a-db4e-4ac6-a9b3-bd3904b31021	2021-06-10 14:30:43.550009+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	7e4b0258-e951-48ba-957d-9eb46d06a520	f9a2aae1-7138-4839-be3f-6dee7cef1000	2021-06-14 15:03:24.943225+00
f30de478-b560-47f5-8588-8062ffc64a25	a1301660-03c4-4d06-820f-b4cd9d0a64a9	6da586e6-2a3a-47ef-a683-e3ef87d9c6ee	2021-06-24 09:19:52.224876+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	f761c6ac-aa4c-4da9-bba5-32896711efc4	915ae12a-db4e-4ac6-a9b3-bd3904b31021	2021-06-10 15:53:08.096493+00
f30de478-b560-47f5-8588-8062ffc64a25	16f2850f-f630-44da-8529-d05b38e03394	186c0683-a50e-45a5-89cd-a20bd26242d9	2021-06-24 09:19:56.313963+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	a1301660-03c4-4d06-820f-b4cd9d0a64a9	6da586e6-2a3a-47ef-a683-e3ef87d9c6ee	2021-06-28 15:49:26.643326+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	16f2850f-f630-44da-8529-d05b38e03394	186c0683-a50e-45a5-89cd-a20bd26242d9	2021-06-17 15:03:11.079754+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	4bede90b-6829-469f-8735-55a430a0547e	808f0f7a-e2ee-4b15-b2d5-2f175f03272e	2021-06-10 15:52:39.810895+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	7e4b0258-e951-48ba-957d-9eb46d06a520	f9a2aae1-7138-4839-be3f-6dee7cef1000	2021-06-15 14:55:33.541701+00
f30de478-b560-47f5-8588-8062ffc64a25	7e4b0258-e951-48ba-957d-9eb46d06a520	f9a2aae1-7138-4839-be3f-6dee7cef1000	2021-06-10 16:24:54.043987+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	7e4b0258-e951-48ba-957d-9eb46d06a520	f9a2aae1-7138-4839-be3f-6dee7cef1000	2021-06-10 14:57:17.519969+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	16f2850f-f630-44da-8529-d05b38e03394	186c0683-a50e-45a5-89cd-a20bd26242d9	2021-06-28 15:40:04.241386+00
ca652ee1-1423-42fe-a0ef-e5761a670845	2f38aa46-5517-4c9b-b060-81e3a2864bee	3d2f088d-c7b9-465a-b9d8-75132f0afe6c	2021-08-04 06:41:50.279232+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	a1301660-03c4-4d06-820f-b4cd9d0a64a9	c89ac299-b36f-459b-bdc0-419f2b3b6ed8	2021-06-10 14:57:32.366693+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	eb7722ae-b13b-4a89-9162-6bb597524ee5	c24f7dff-9bee-48c6-be61-8d35e0841692	2021-06-23 07:55:40.773188+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	4bede90b-6829-469f-8735-55a430a0547e	808f0f7a-e2ee-4b15-b2d5-2f175f03272e	2021-06-10 15:03:00.776695+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	4bede90b-6829-469f-8735-55a430a0547e	808f0f7a-e2ee-4b15-b2d5-2f175f03272e	2021-06-10 17:39:15.079148+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	8209f70d-d1be-4707-834b-3f45dd3b2178	7782e78d-6ffb-4f78-b91c-726b77ad99be	2021-06-10 16:12:43.862927+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	7e4b0258-e951-48ba-957d-9eb46d06a520	f9a2aae1-7138-4839-be3f-6dee7cef1000	2021-06-10 15:45:37.138441+00
7a90bccb-346e-4933-aaeb-cdef732be976	cb2365c8-f314-4744-a80e-a709a02817f8	e3ea8bf1-0d92-4b99-9b20-705cc59ee304	2021-08-13 09:25:55.523104+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	4bede90b-6829-469f-8735-55a430a0547e	808f0f7a-e2ee-4b15-b2d5-2f175f03272e	2021-06-10 15:11:23.778742+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	601996cc-a8e9-44e2-adde-4071301dc791	5a587de3-0252-4b82-a9b2-058dc0335fd5	2021-06-10 15:11:23.78979+00
7a90bccb-346e-4933-aaeb-cdef732be976	f761c6ac-aa4c-4da9-bba5-32896711efc4	915ae12a-db4e-4ac6-a9b3-bd3904b31021	2021-06-10 16:06:18.127553+00
ca652ee1-1423-42fe-a0ef-e5761a670845	17b401b9-004c-446d-8b31-c072c5ad870d	f23a7198-4e3e-428c-a63e-02d77be6bcf4	2021-06-24 07:08:45.703583+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	601996cc-a8e9-44e2-adde-4071301dc791	cf5808a1-656f-489e-bb50-d4f7b4ba7981	2021-06-15 05:53:59.415541+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	f761c6ac-aa4c-4da9-bba5-32896711efc4	915ae12a-db4e-4ac6-a9b3-bd3904b31021	2021-06-10 21:42:22.478689+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	25522813-086e-4ef1-ad4b-eac1740a83eb	73be0a1b-f273-43d3-8c4d-c7ffec21d680	2021-08-09 14:27:02.723804+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	4bede90b-6829-469f-8735-55a430a0547e	808f0f7a-e2ee-4b15-b2d5-2f175f03272e	2021-06-10 16:03:26.582408+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	16f2850f-f630-44da-8529-d05b38e03394	186c0683-a50e-45a5-89cd-a20bd26242d9	2021-06-23 15:57:42.604845+00
f30de478-b560-47f5-8588-8062ffc64a25	4bede90b-6829-469f-8735-55a430a0547e	808f0f7a-e2ee-4b15-b2d5-2f175f03272e	2021-06-24 08:01:44.767214+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	a1301660-03c4-4d06-820f-b4cd9d0a64a9	6da586e6-2a3a-47ef-a683-e3ef87d9c6ee	2021-06-23 07:54:10.583983+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	7968122e-e49e-4d59-b1e7-d4e128824615	5207cd77-72d4-42eb-a63b-1c157028b15f	2021-07-20 08:00:25.306338+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	dab455dc-a825-4287-816a-29310bd8c38f	aed02ba8-4855-49ea-9d0e-646904ce5d5e	2021-08-11 09:22:05.086095+00
7a90bccb-346e-4933-aaeb-cdef732be976	3a2032b1-8190-47b2-84d6-28998118838d	1d02e8a6-a380-421a-a077-360d21b019d3	2021-08-04 19:02:31.334483+00
f30de478-b560-47f5-8588-8062ffc64a25	4a2e3c80-7128-4a2a-a727-ca78bd976e77	c5a088d5-0683-4181-8c70-7576bc8e906b	2021-06-24 14:51:42.650161+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	1f1026c2-5246-4788-8f67-933e06dffd7e	c44194cc-f9b0-433f-a798-1a0ed2a4072d	2021-07-19 10:00:09.793448+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	8209f70d-d1be-4707-834b-3f45dd3b2178	7782e78d-6ffb-4f78-b91c-726b77ad99be	2021-06-23 07:54:11.616734+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	faeb4daa-d511-4807-a679-b023576c5540	b877bc1a-63ab-4937-84b0-3904fe049c9f	2021-06-11 10:38:52.047813+00
ca652ee1-1423-42fe-a0ef-e5761a670845	62a36a3c-e335-4022-90ef-d3a5e3615d11	98bbde58-3ed6-4bf7-b5dc-9b1253e9dad4	2021-07-22 08:24:21.157183+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	2d06c3da-ac1f-4dac-9c08-fedee14ed5de	3b41dc59-0c1e-45da-9b8f-558e3aacf6c0	2021-06-17 09:10:38.481036+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	f98de3d4-4dc7-400a-979c-80f15767a230	4e4639a9-557b-44f2-9531-db9c64a7a8e1	2021-06-14 15:36:13.56533+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	eb7722ae-b13b-4a89-9162-6bb597524ee5	c24f7dff-9bee-48c6-be61-8d35e0841692	2021-06-10 17:39:22.161976+00
7a90bccb-346e-4933-aaeb-cdef732be976	cb232862-61c5-4254-bff4-f2b35f0b8817	a956c46f-b3aa-4a8e-8b22-c9907b4b90c1	2021-06-23 11:59:32.678386+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	8209f70d-d1be-4707-834b-3f45dd3b2178	7782e78d-6ffb-4f78-b91c-726b77ad99be	2021-06-15 07:44:21.96944+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	3fd39670-e573-4e14-9623-751ec185e073	308b838d-ddf1-45e9-aadc-e6936b695ded	2021-07-21 15:30:35.800336+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	53de72b0-b18d-4cf3-93ea-a48b894761e8	1445c2dd-52f1-42e4-b248-501bd5d1a646	2021-06-14 15:36:28.637561+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	faeb4daa-d511-4807-a679-b023576c5540	45adb680-6815-4171-b5c5-4963a726e197	2021-06-23 07:53:59.986191+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	12a4253d-c1aa-4858-a8cd-b5c0ef17d220	32816c6c-966f-4501-b308-118503173965	2021-07-20 12:44:04.523619+00
7a90bccb-346e-4933-aaeb-cdef732be976	a1301660-03c4-4d06-820f-b4cd9d0a64a9	6da586e6-2a3a-47ef-a683-e3ef87d9c6ee	2021-06-17 14:48:58.528665+00
31f1de58-af98-4946-997c-622cb20d9504	1f144355-4143-4f39-8331-d688eed9a1b8	ed381feb-41df-4cc9-81b6-07e4b0760277	2021-08-11 13:19:51.911399+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	cb232862-61c5-4254-bff4-f2b35f0b8817	a956c46f-b3aa-4a8e-8b22-c9907b4b90c1	2021-06-24 15:37:31.242767+00
7a90bccb-346e-4933-aaeb-cdef732be976	7e4b0258-e951-48ba-957d-9eb46d06a520	f9a2aae1-7138-4839-be3f-6dee7cef1000	2021-06-10 23:13:48.500543+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	cb232862-61c5-4254-bff4-f2b35f0b8817	a956c46f-b3aa-4a8e-8b22-c9907b4b90c1	2021-06-23 08:29:05.491287+00
7a90bccb-346e-4933-aaeb-cdef732be976	46cfadba-77ea-42f8-b81f-afa0ab158576	593b3b6b-92f7-4a7c-b061-d47e3fcfbd88	2021-06-17 14:30:42.860111+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	454b94ed-7e72-4a9e-b221-efc9aad86483	fe1194a2-9755-4704-ac1e-69f949d49b3d	2021-08-13 14:30:15.498765+00
f30de478-b560-47f5-8588-8062ffc64a25	c09f5001-8876-40ac-bfb5-7468d65edfc2	dbb2cc36-14ba-4ba9-a67b-16d372ffe697	2021-07-20 14:16:32.447735+00
f30de478-b560-47f5-8588-8062ffc64a25	f98de3d4-4dc7-400a-979c-80f15767a230	4e4639a9-557b-44f2-9531-db9c64a7a8e1	2021-06-22 13:36:03.413629+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	63724e58-b0e4-4095-ab63-b9922400702a	50378b79-88cd-44aa-a0cd-38b86a88b393	2021-06-11 12:40:35.243304+00
f30de478-b560-47f5-8588-8062ffc64a25	eb7722ae-b13b-4a89-9162-6bb597524ee5	c24f7dff-9bee-48c6-be61-8d35e0841692	2021-06-17 07:56:08.099664+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	ec23d178-0a3a-4eaf-b2de-ef36bf46c235	fba5632d-6893-4ff2-bd5b-45087349ebbc	2021-07-21 07:08:11.888917+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	601996cc-a8e9-44e2-adde-4071301dc791	cf5808a1-656f-489e-bb50-d4f7b4ba7981	2021-06-16 13:10:09.201709+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	4a2e3c80-7128-4a2a-a727-ca78bd976e77	c5a088d5-0683-4181-8c70-7576bc8e906b	2021-06-22 13:33:33.076291+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	a7e76ba5-9d54-4d3b-be5d-f74e782c6903	5eb81ee3-e13b-4058-a41f-3b1861e7e10a	2021-08-13 08:31:50.46288+00
7a90bccb-346e-4933-aaeb-cdef732be976	63724e58-b0e4-4095-ab63-b9922400702a	50378b79-88cd-44aa-a0cd-38b86a88b393	2021-06-11 11:41:51.101289+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	faeb4daa-d511-4807-a679-b023576c5540	45adb680-6815-4171-b5c5-4963a726e197	2021-06-14 15:03:04.462959+00
7a90bccb-346e-4933-aaeb-cdef732be976	faeb4daa-d511-4807-a679-b023576c5540	c5a088d5-0683-4181-8c70-7576bc8e906b	2021-06-23 11:59:09.354661+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	2d06c3da-ac1f-4dac-9c08-fedee14ed5de	3b41dc59-0c1e-45da-9b8f-558e3aacf6c0	2021-06-21 17:08:07.311702+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	2d06c3da-ac1f-4dac-9c08-fedee14ed5de	3b41dc59-0c1e-45da-9b8f-558e3aacf6c0	2021-06-15 14:54:49.948409+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	2f38aa46-5517-4c9b-b060-81e3a2864bee	9cfb002a-69c5-4be9-b5f0-1deb34799a90	2021-08-05 08:51:11.504435+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	53de72b0-b18d-4cf3-93ea-a48b894761e8	1445c2dd-52f1-42e4-b248-501bd5d1a646	2021-06-23 08:29:14.662163+00
f30de478-b560-47f5-8588-8062ffc64a25	63724e58-b0e4-4095-ab63-b9922400702a	50378b79-88cd-44aa-a0cd-38b86a88b393	2021-06-23 08:20:26.59287+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	601996cc-a8e9-44e2-adde-4071301dc791	cf5808a1-656f-489e-bb50-d4f7b4ba7981	2021-06-15 16:01:56.501373+00
7a90bccb-346e-4933-aaeb-cdef732be976	4a2e3c80-7128-4a2a-a727-ca78bd976e77	c5a088d5-0683-4181-8c70-7576bc8e906b	2021-06-23 11:59:12.421388+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	1d0464b7-8b84-4731-bb53-37c247f2b179	5fbfa618-762b-491f-a4d6-a550fbbe6382	2021-07-20 12:51:13.322702+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	eb7722ae-b13b-4a89-9162-6bb597524ee5	c24f7dff-9bee-48c6-be61-8d35e0841692	2021-06-16 13:00:20.520571+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	f98de3d4-4dc7-400a-979c-80f15767a230	4e4639a9-557b-44f2-9531-db9c64a7a8e1	2021-06-23 08:29:12.906569+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	eb7722ae-b13b-4a89-9162-6bb597524ee5	c24f7dff-9bee-48c6-be61-8d35e0841692	2021-06-14 15:03:28.944693+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	53de72b0-b18d-4cf3-93ea-a48b894761e8	1445c2dd-52f1-42e4-b248-501bd5d1a646	2021-06-16 14:50:08.744432+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	63724e58-b0e4-4095-ab63-b9922400702a	50378b79-88cd-44aa-a0cd-38b86a88b393	2021-06-11 11:57:00.051141+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	12a4253d-c1aa-4858-a8cd-b5c0ef17d220	32816c6c-966f-4501-b308-118503173965	2021-07-20 12:57:51.983922+00
ca652ee1-1423-42fe-a0ef-e5761a670845	950ad578-3e05-4e73-aed4-25a21b5393ac	3578dfe7-b063-4b89-8575-890f3e409292	2021-08-12 06:57:35.271247+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	cb232862-61c5-4254-bff4-f2b35f0b8817	a956c46f-b3aa-4a8e-8b22-c9907b4b90c1	2021-06-23 15:35:25.792308+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	f98de3d4-4dc7-400a-979c-80f15767a230	4e4639a9-557b-44f2-9531-db9c64a7a8e1	2021-06-18 12:30:34.429363+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	4a2e3c80-7128-4a2a-a727-ca78bd976e77	c5a088d5-0683-4181-8c70-7576bc8e906b	2021-06-15 05:54:22.346336+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	12a4253d-c1aa-4858-a8cd-b5c0ef17d220	32816c6c-966f-4501-b308-118503173965	2021-07-20 13:32:00.304772+00
ca652ee1-1423-42fe-a0ef-e5761a670845	4a2e3c80-7128-4a2a-a727-ca78bd976e77	c5a088d5-0683-4181-8c70-7576bc8e906b	2021-06-23 10:15:05.539327+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	f927973b-9861-482c-92b6-390df01bf193	38f8a6ff-a80f-4c8f-99a3-50869722006a	2021-08-09 08:51:46.140316+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	faeb4daa-d511-4807-a679-b023576c5540	45adb680-6815-4171-b5c5-4963a726e197	2021-06-15 05:54:31.550298+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	63724e58-b0e4-4095-ab63-b9922400702a	50378b79-88cd-44aa-a0cd-38b86a88b393	2021-06-15 05:54:52.455795+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	f98de3d4-4dc7-400a-979c-80f15767a230	4e4639a9-557b-44f2-9531-db9c64a7a8e1	2021-06-16 12:07:28.838979+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	12a4253d-c1aa-4858-a8cd-b5c0ef17d220	32816c6c-966f-4501-b308-118503173965	2021-07-20 14:30:11.192661+00
f30de478-b560-47f5-8588-8062ffc64a25	839b9f13-e9ff-49f2-9e11-932b03ed8d10	2f7b35e9-cf0b-481f-b062-45642d2c94b8	2021-07-20 14:39:29.816077+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	4a2e3c80-7128-4a2a-a727-ca78bd976e77	c5a088d5-0683-4181-8c70-7576bc8e906b	2021-06-16 14:52:49.313702+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	3fd39670-e573-4e14-9623-751ec185e073	308b838d-ddf1-45e9-aadc-e6936b695ded	2021-07-23 07:56:37.910564+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	53de72b0-b18d-4cf3-93ea-a48b894761e8	1445c2dd-52f1-42e4-b248-501bd5d1a646	2021-06-16 12:07:31.822938+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	cb232862-61c5-4254-bff4-f2b35f0b8817	a956c46f-b3aa-4a8e-8b22-c9907b4b90c1	2021-06-16 14:09:36.519582+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	2d06c3da-ac1f-4dac-9c08-fedee14ed5de	3b41dc59-0c1e-45da-9b8f-558e3aacf6c0	2021-06-16 12:07:33.843111+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	62a36a3c-e335-4022-90ef-d3a5e3615d11	3f27b26a-bd1b-4b35-8cfc-4cfb362ae236	2021-07-21 14:52:49.121388+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	b9b3f5f8-35a9-40cf-aed4-6f7cde6a2e37	c6e3996c-9029-4e1e-83cc-2e9c59543c6d	2021-07-21 14:41:45.117852+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	1ef10234-ceff-4c57-a295-facbed92592d	8ddc7590-9fce-431f-8f39-19e6d3ee9abf	2021-07-23 07:56:31.148439+00
f30de478-b560-47f5-8588-8062ffc64a25	faeb4daa-d511-4807-a679-b023576c5540	45adb680-6815-4171-b5c5-4963a726e197	2021-06-24 14:51:36.212772+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	18982189-4823-414e-b456-65e09d1237fa	4fa1bbd6-15d4-43b6-8c86-7a9c9a77e3c2	2021-08-11 09:00:21.708413+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	4a2e3c80-7128-4a2a-a727-ca78bd976e77	c5a088d5-0683-4181-8c70-7576bc8e906b	2021-06-17 11:40:39.771627+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	df0bcc2f-0459-4b5a-af3f-6bf616b393f3	c10e0ac9-8a5c-4388-bfaf-9054564ae777	2021-07-22 13:56:04.466318+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	faeb4daa-d511-4807-a679-b023576c5540	45adb680-6815-4171-b5c5-4963a726e197	2021-06-16 14:52:51.315607+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	63724e58-b0e4-4095-ab63-b9922400702a	50378b79-88cd-44aa-a0cd-38b86a88b393	2021-06-16 14:52:53.318439+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	4a2e3c80-7128-4a2a-a727-ca78bd976e77	c5a088d5-0683-4181-8c70-7576bc8e906b	2021-06-16 14:54:37.750115+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	19eda0fd-71e8-49fd-9847-d2b9d8466527	07bcb362-cb64-4029-9f0b-d6516dee551c	2021-07-22 09:05:23.171582+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	a3bb912d-893d-40b9-bda9-5f74c5da9d2a	0eb468cb-7bfb-42d7-9ac8-f7f4d00d8ea9	2021-08-10 11:45:06.95669+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	63724e58-b0e4-4095-ab63-b9922400702a	50378b79-88cd-44aa-a0cd-38b86a88b393	2021-06-23 07:54:04.983664+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	f98de3d4-4dc7-400a-979c-80f15767a230	4e4639a9-557b-44f2-9531-db9c64a7a8e1	2021-06-18 14:26:18.451185+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	92c036e0-1b96-45ad-b529-a227b1e935e4	2a70d4ee-bdb5-4ca4-94a0-298afc28c922	2021-06-22 10:23:41.342404+00
f30de478-b560-47f5-8588-8062ffc64a25	73763d8a-cbda-477a-95cb-36a1f9e4229b	9b8f70a2-8ac3-49f5-a60f-2eaf0c74bb09	2021-06-24 08:02:04.645839+00
f30de478-b560-47f5-8588-8062ffc64a25	986aa5b3-c238-4f52-a600-4db2ece4b9ee	73592f54-9928-4f45-acfa-78576197eb7d	2021-06-24 08:02:00.567678+00
7a90bccb-346e-4933-aaeb-cdef732be976	16f2850f-f630-44da-8529-d05b38e03394	186c0683-a50e-45a5-89cd-a20bd26242d9	2021-06-17 14:47:34.867261+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	289bb606-7ac4-49ea-8147-6a9eed284d36	90e77ce9-9f0c-41c3-8345-813a6945bd11	2021-06-21 07:57:01.940918+00
7a90bccb-346e-4933-aaeb-cdef732be976	eb7722ae-b13b-4a89-9162-6bb597524ee5	c24f7dff-9bee-48c6-be61-8d35e0841692	2021-06-17 14:47:56.983106+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	73763d8a-cbda-477a-95cb-36a1f9e4229b	9b8f70a2-8ac3-49f5-a60f-2eaf0c74bb09	2021-06-24 09:03:56.600275+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	b211ac73-ce13-4b92-a9c8-7e2146db3dd5	df39773e-e3a7-4ee5-ac81-eef227a3dde3	2021-06-21 08:22:15.588456+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	b211ac73-ce13-4b92-a9c8-7e2146db3dd5	df39773e-e3a7-4ee5-ac81-eef227a3dde3	2021-06-21 11:12:35.913619+00
f30de478-b560-47f5-8588-8062ffc64a25	b211ac73-ce13-4b92-a9c8-7e2146db3dd5	df39773e-e3a7-4ee5-ac81-eef227a3dde3	2021-06-23 08:21:21.591041+00
7a90bccb-346e-4933-aaeb-cdef732be976	b211ac73-ce13-4b92-a9c8-7e2146db3dd5	df39773e-e3a7-4ee5-ac81-eef227a3dde3	2021-06-21 09:45:52.677076+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	832f3a41-2f78-4402-9202-78ad6d64f4cd	5cb12417-792c-4558-8326-145012173662	2021-06-28 11:13:43.791173+00
7a90bccb-346e-4933-aaeb-cdef732be976	986aa5b3-c238-4f52-a600-4db2ece4b9ee	73592f54-9928-4f45-acfa-78576197eb7d	2021-06-17 14:56:15.416361+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	73763d8a-cbda-477a-95cb-36a1f9e4229b	9b8f70a2-8ac3-49f5-a60f-2eaf0c74bb09	2021-06-18 11:06:50.709638+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	986aa5b3-c238-4f52-a600-4db2ece4b9ee	73592f54-9928-4f45-acfa-78576197eb7d	2021-06-18 11:06:53.88309+00
ca652ee1-1423-42fe-a0ef-e5761a670845	a3df9a5b-6188-4a59-b780-019b5897954c	993750d5-c564-4265-87d6-ff428191e27b	2021-08-13 08:52:56.468563+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	289bb606-7ac4-49ea-8147-6a9eed284d36	0a79441e-8fe3-4d57-bceb-811029785bff	2021-06-21 08:51:15.005575+00
7a90bccb-346e-4933-aaeb-cdef732be976	73763d8a-cbda-477a-95cb-36a1f9e4229b	9b8f70a2-8ac3-49f5-a60f-2eaf0c74bb09	2021-06-18 11:45:52.885443+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	4a2e3c80-7128-4a2a-a727-ca78bd976e77	c5a088d5-0683-4181-8c70-7576bc8e906b	2021-06-23 07:53:47.88753+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	af921e4f-c64e-4462-b565-b9bbc85dee8b	4092a597-b562-40af-9e34-cfbfd6f4aa6c	2021-06-28 12:59:14.457687+00
ca652ee1-1423-42fe-a0ef-e5761a670845	50cc22f8-e1b5-4e97-b005-57794768edae	5df47275-e69a-463a-8850-5a7a51cca633	2021-07-19 14:41:26.075406+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	2d06c3da-ac1f-4dac-9c08-fedee14ed5de	3b41dc59-0c1e-45da-9b8f-558e3aacf6c0	2021-06-19 09:48:14.200033+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	986aa5b3-c238-4f52-a600-4db2ece4b9ee	73592f54-9928-4f45-acfa-78576197eb7d	2021-06-24 09:04:04.838028+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	34389740-7677-46f3-89d6-76ea52017019	808b5c47-f912-48a8-89d9-82a5da8a55fe	2021-07-20 15:43:12.518141+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	ec23d178-0a3a-4eaf-b2de-ef36bf46c235	fba5632d-6893-4ff2-bd5b-45087349ebbc	2021-07-20 14:38:46.633962+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	df6b6e91-9e9d-4f59-aa10-58ba5b25f9e0	0cb79a53-cde5-423a-bb70-d640b00da5de	2021-07-20 13:01:49.351381+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	add6498d-bbfa-4d87-b3da-ff3115179a0e	9f46ca90-5d75-4635-876e-ecf06bd3077f	2021-08-13 08:27:08.616211+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	53de72b0-b18d-4cf3-93ea-a48b894761e8	1445c2dd-52f1-42e4-b248-501bd5d1a646	2021-06-17 09:43:48.753722+00
7a90bccb-346e-4933-aaeb-cdef732be976	4bede90b-6829-469f-8735-55a430a0547e	808f0f7a-e2ee-4b15-b2d5-2f175f03272e	2021-06-17 14:31:38.494327+00
7a90bccb-346e-4933-aaeb-cdef732be976	289bb606-7ac4-49ea-8147-6a9eed284d36	0a79441e-8fe3-4d57-bceb-811029785bff	2021-06-21 08:19:03.253347+00
ca652ee1-1423-42fe-a0ef-e5761a670845	8a0d6a5d-04cf-454b-b088-34c9386e026c	3454e316-c129-4d9e-be26-ef34dd54668f	2021-06-21 09:30:54.678009+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	73763d8a-cbda-477a-95cb-36a1f9e4229b	9b8f70a2-8ac3-49f5-a60f-2eaf0c74bb09	2021-06-23 07:55:44.904271+00
7a90bccb-346e-4933-aaeb-cdef732be976	832f3a41-2f78-4402-9202-78ad6d64f4cd	aff235a6-e7e1-444b-bcb9-b78650bd0696	2021-06-21 14:42:35.652839+00
f30de478-b560-47f5-8588-8062ffc64a25	cb232862-61c5-4254-bff4-f2b35f0b8817	a956c46f-b3aa-4a8e-8b22-c9907b4b90c1	2021-06-23 15:06:39.625201+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	9c515d50-ad3c-406e-a431-57caed837571	3f11ec55-6ffa-470a-bb9c-42340033ca7d	2021-06-22 12:00:44.6666+00
ca652ee1-1423-42fe-a0ef-e5761a670845	3a2032b1-8190-47b2-84d6-28998118838d	55b03786-ba65-4ddc-aeca-aec5872c4975	2021-07-12 06:50:12.35169+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	cb232862-61c5-4254-bff4-f2b35f0b8817	a956c46f-b3aa-4a8e-8b22-c9907b4b90c1	2021-06-24 12:46:34.682722+00
ca652ee1-1423-42fe-a0ef-e5761a670845	b211ac73-ce13-4b92-a9c8-7e2146db3dd5	df39773e-e3a7-4ee5-ac81-eef227a3dde3	2021-06-21 10:15:58.013099+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	af921e4f-c64e-4462-b565-b9bbc85dee8b	4092a597-b562-40af-9e34-cfbfd6f4aa6c	2021-06-28 20:02:35.912778+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	986aa5b3-c238-4f52-a600-4db2ece4b9ee	73592f54-9928-4f45-acfa-78576197eb7d	2021-06-23 07:56:02.421164+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	ddf30ba1-4908-409d-ab39-cf57d34d658e	006b5ef5-9cfd-41b3-94f0-4fc19ae033b1	2021-08-11 09:29:47.112736+00
ca652ee1-1423-42fe-a0ef-e5761a670845	289bb606-7ac4-49ea-8147-6a9eed284d36	0a79441e-8fe3-4d57-bceb-811029785bff	2021-06-21 08:11:04.07083+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	839b9f13-e9ff-49f2-9e11-932b03ed8d10	5227367e-e95c-4067-8218-4d23a75bb042	2021-07-20 13:01:58.202583+00
ca652ee1-1423-42fe-a0ef-e5761a670845	810dbc47-af96-4c1b-bdbd-b1dcd6aa4322	b4496f12-b372-4ee8-a249-3200acc31f3e	2021-07-26 07:05:11.775034+00
7a90bccb-346e-4933-aaeb-cdef732be976	8a0d6a5d-04cf-454b-b088-34c9386e026c	3454e316-c129-4d9e-be26-ef34dd54668f	2021-06-21 14:25:41.595421+00
7a90bccb-346e-4933-aaeb-cdef732be976	92c036e0-1b96-45ad-b529-a227b1e935e4	fad96098-41e9-4cd1-8c10-b27fbf194b5c	2021-06-21 14:25:44.545594+00
ca652ee1-1423-42fe-a0ef-e5761a670845	af921e4f-c64e-4462-b565-b9bbc85dee8b	4092a597-b562-40af-9e34-cfbfd6f4aa6c	2021-06-21 11:00:34.005624+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	8a0d6a5d-04cf-454b-b088-34c9386e026c	4a414750-b178-47d1-b651-5f2fd300e515	2021-06-22 13:57:26.024326+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	df6b6e91-9e9d-4f59-aa10-58ba5b25f9e0	0cb79a53-cde5-423a-bb70-d640b00da5de	2021-07-20 13:49:32.137702+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	ec3477e0-ea66-4ba8-9275-5d6924345385	5367006e-2679-4e37-8cb4-8b76dc4d01ab	2021-06-22 13:33:22.87041+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	92c036e0-1b96-45ad-b529-a227b1e935e4	2a70d4ee-bdb5-4ca4-94a0-298afc28c922	2021-06-22 10:19:02.021987+00
f30de478-b560-47f5-8588-8062ffc64a25	832f3a41-2f78-4402-9202-78ad6d64f4cd	5cb12417-792c-4558-8326-145012173662	2021-06-23 08:21:04.216813+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	832f3a41-2f78-4402-9202-78ad6d64f4cd	5cb12417-792c-4558-8326-145012173662	2021-06-22 11:38:02.939225+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	839b9f13-e9ff-49f2-9e11-932b03ed8d10	2f7b35e9-cf0b-481f-b062-45642d2c94b8	2021-07-20 13:51:13.590352+00
ca652ee1-1423-42fe-a0ef-e5761a670845	065f3700-82a7-4025-bb40-c5362b53f3ba	361ef2f7-185b-4d85-87ab-003e7042175f	2021-08-03 14:36:17.580951+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	8a0d6a5d-04cf-454b-b088-34c9386e026c	4a414750-b178-47d1-b651-5f2fd300e515	2021-06-22 10:23:37.352908+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	c09f5001-8876-40ac-bfb5-7468d65edfc2	dbb2cc36-14ba-4ba9-a67b-16d372ffe697	2021-07-20 13:32:33.023852+00
7a90bccb-346e-4933-aaeb-cdef732be976	7968122e-e49e-4d59-b1e7-d4e128824615	5207cd77-72d4-42eb-a63b-1c157028b15f	2021-07-30 17:28:42.505921+00
f30de478-b560-47f5-8588-8062ffc64a25	af921e4f-c64e-4462-b565-b9bbc85dee8b	4092a597-b562-40af-9e34-cfbfd6f4aa6c	2021-06-23 08:21:15.461773+00
f30de478-b560-47f5-8588-8062ffc64a25	289bb606-7ac4-49ea-8147-6a9eed284d36	0a79441e-8fe3-4d57-bceb-811029785bff	2021-06-23 08:21:20.224329+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	84d076a1-b88b-4232-8fe4-755f25411d9d	fcdf2627-51d6-4235-b4fd-7a08617ec540	2021-07-20 14:23:25.646318+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	ec3477e0-ea66-4ba8-9275-5d6924345385	5367006e-2679-4e37-8cb4-8b76dc4d01ab	2021-06-23 08:07:09.614599+00
ca652ee1-1423-42fe-a0ef-e5761a670845	832f3a41-2f78-4402-9202-78ad6d64f4cd	5cb12417-792c-4558-8326-145012173662	2021-06-23 10:14:43.104354+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	34389740-7677-46f3-89d6-76ea52017019	808b5c47-f912-48a8-89d9-82a5da8a55fe	2021-07-20 14:42:50.509033+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	9c515d50-ad3c-406e-a431-57caed837571	3f11ec55-6ffa-470a-bb9c-42340033ca7d	2021-06-23 11:55:46.031496+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	839b9f13-e9ff-49f2-9e11-932b03ed8d10	2f7b35e9-cf0b-481f-b062-45642d2c94b8	2021-07-21 12:45:22.486056+00
ca652ee1-1423-42fe-a0ef-e5761a670845	92c036e0-1b96-45ad-b529-a227b1e935e4	2a70d4ee-bdb5-4ca4-94a0-298afc28c922	2021-06-23 10:14:47.295312+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	832f3a41-2f78-4402-9202-78ad6d64f4cd	5cb12417-792c-4558-8326-145012173662	2021-06-25 07:26:38.746313+00
7a90bccb-346e-4933-aaeb-cdef732be976	2d06c3da-ac1f-4dac-9c08-fedee14ed5de	3b41dc59-0c1e-45da-9b8f-558e3aacf6c0	2021-06-23 12:00:08.173423+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	fcc42886-7ae4-4f92-b31a-a90d0df23f6d	e30a2dcf-4d73-4bbf-b235-37210c936ae0	2021-07-30 08:03:05.223027+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	ec3477e0-ea66-4ba8-9275-5d6924345385	5367006e-2679-4e37-8cb4-8b76dc4d01ab	2021-06-23 12:02:41.299331+00
7a90bccb-346e-4933-aaeb-cdef732be976	f98de3d4-4dc7-400a-979c-80f15767a230	4e4639a9-557b-44f2-9531-db9c64a7a8e1	2021-06-23 12:00:12.420899+00
7a90bccb-346e-4933-aaeb-cdef732be976	53de72b0-b18d-4cf3-93ea-a48b894761e8	1445c2dd-52f1-42e4-b248-501bd5d1a646	2021-06-23 12:00:10.194795+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	af921e4f-c64e-4462-b565-b9bbc85dee8b	4092a597-b562-40af-9e34-cfbfd6f4aa6c	2021-06-28 11:43:48.08561+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	af921e4f-c64e-4462-b565-b9bbc85dee8b	4092a597-b562-40af-9e34-cfbfd6f4aa6c	2021-06-23 13:49:01.712007+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	b9b3f5f8-35a9-40cf-aed4-6f7cde6a2e37	c6e3996c-9029-4e1e-83cc-2e9c59543c6d	2021-07-21 14:43:15.274434+00
7a90bccb-346e-4933-aaeb-cdef732be976	af921e4f-c64e-4462-b565-b9bbc85dee8b	4092a597-b562-40af-9e34-cfbfd6f4aa6c	2021-07-13 13:26:52.562181+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	69b94728-fc60-46c6-b9cb-d6485e622725	da33ffc6-f68d-4f2a-8852-5e15c047402d	2021-07-21 14:54:20.055639+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	df0bcc2f-0459-4b5a-af3f-6bf616b393f3	c10e0ac9-8a5c-4388-bfaf-9054564ae777	2021-07-22 09:58:24.41451+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	9c515d50-ad3c-406e-a431-57caed837571	3f11ec55-6ffa-470a-bb9c-42340033ca7d	2021-06-23 14:10:02.662381+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	62a36a3c-e335-4022-90ef-d3a5e3615d11	98bbde58-3ed6-4bf7-b5dc-9b1253e9dad4	2021-07-22 12:01:32.719608+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	19eda0fd-71e8-49fd-9847-d2b9d8466527	07bcb362-cb64-4029-9f0b-d6516dee551c	2021-07-22 13:56:17.88894+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	289bb606-7ac4-49ea-8147-6a9eed284d36	0a79441e-8fe3-4d57-bceb-811029785bff	2021-06-23 13:49:03.265425+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	389d6acf-b00a-42fd-bdbd-4df84f96bbf6	7e870a71-3753-457a-858a-d5a81d240eb4	2021-06-24 12:04:04.597617+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	b211ac73-ce13-4b92-a9c8-7e2146db3dd5	df39773e-e3a7-4ee5-ac81-eef227a3dde3	2021-06-23 13:49:04.685816+00
ca652ee1-1423-42fe-a0ef-e5761a670845	1d0464b7-8b84-4731-bb53-37c247f2b179	cb2c92c7-106b-4b9d-9ff1-0dc6e14e910a	2021-07-20 10:39:35.254778+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	5d4e1943-67b7-4d68-9baf-3fa7c1df599e	8cd121cc-b932-49de-8511-b59fa5766dc2	2021-07-30 15:44:45.491144+00
7a90bccb-346e-4933-aaeb-cdef732be976	368d5a03-d0f1-4af7-9ce4-dc55cb7571a3	ebb06fd7-d31f-4142-8be4-502c85cf1dde	2021-08-11 12:28:21.06803+00
f30de478-b560-47f5-8588-8062ffc64a25	9c515d50-ad3c-406e-a431-57caed837571	3f11ec55-6ffa-470a-bb9c-42340033ca7d	2021-06-23 14:05:59.763258+00
7a90bccb-346e-4933-aaeb-cdef732be976	50cc22f8-e1b5-4e97-b005-57794768edae	5df47275-e69a-463a-8850-5a7a51cca633	2021-08-02 15:10:35.621827+00
f30de478-b560-47f5-8588-8062ffc64a25	2d06c3da-ac1f-4dac-9c08-fedee14ed5de	3b41dc59-0c1e-45da-9b8f-558e3aacf6c0	2021-06-23 15:06:41.688163+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	f159d13d-55aa-42eb-8653-89486d8ba839	cd1d94c9-cbf5-452c-8af9-bd4add46514d	2021-07-19 12:09:50.854187+00
7a90bccb-346e-4933-aaeb-cdef732be976	e6fa7e76-533c-45fa-85b8-ecef973c3c00	5afdcfc6-441b-4f3a-a92e-7c058c17cdfd	2021-08-09 07:43:20.880044+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	47b58a79-58ed-4ab8-91c6-00584868725d	89cff57c-c228-452f-9dd6-298c7aa68c2f	2021-06-24 13:55:47.790398+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	d438642d-c090-43c5-9d22-2c4cedd787a4	144b39fe-8636-46da-925d-088f05324b49	2021-08-09 12:16:48.402235+00
ca652ee1-1423-42fe-a0ef-e5761a670845	b9b3f5f8-35a9-40cf-aed4-6f7cde6a2e37	c6e3996c-9029-4e1e-83cc-2e9c59543c6d	2021-07-20 12:10:26.061105+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	0580623c-90ab-4b56-ae7e-c0a0f97fc6ca	09eec681-50c8-47b3-a313-2e6da8fd61f9	2021-06-25 07:12:21.840999+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	f5d29f20-c37a-489e-9273-4d29f451ad6f	fd6afb0e-8f33-4970-84db-618d16b3e0dd	2021-06-27 19:14:16.114352+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	c2e6c5e7-2558-4d15-b8a2-bd393043db01	ef6dd74c-212f-4042-adde-31c8fa48d035	2021-06-30 13:02:27.103332+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	47b58a79-58ed-4ab8-91c6-00584868725d	89cff57c-c228-452f-9dd6-298c7aa68c2f	2021-06-25 14:20:48.633191+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	44dcd3bf-fb17-401b-a8cc-9cf060f83c01	5e99d6ef-4906-41d6-9dd3-460666f735a0	2021-06-28 12:07:54.007844+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	ec3477e0-ea66-4ba8-9275-5d6924345385	5367006e-2679-4e37-8cb4-8b76dc4d01ab	2021-06-23 15:57:04.813271+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	9c515d50-ad3c-406e-a431-57caed837571	3f11ec55-6ffa-470a-bb9c-42340033ca7d	2021-06-23 15:57:13.825228+00
ca652ee1-1423-42fe-a0ef-e5761a670845	447c3879-98b7-45f7-a978-77f20fc8c69a	e2f2207f-2697-4a53-8429-4cf473ce7c89	2021-07-06 06:28:53.008391+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	47b58a79-58ed-4ab8-91c6-00584868725d	7a29f12f-661b-4a22-9818-f721d71aca52	2021-06-24 11:06:21.792012+00
f30de478-b560-47f5-8588-8062ffc64a25	44dcd3bf-fb17-401b-a8cc-9cf060f83c01	5e99d6ef-4906-41d6-9dd3-460666f735a0	2021-07-05 16:48:11.505159+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	67fc219e-072b-4b22-b295-0fd462aae098	309a68b4-40e6-401f-8039-9c7d1731bc73	2021-08-10 16:38:45.102573+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	44dcd3bf-fb17-401b-a8cc-9cf060f83c01	5e99d6ef-4906-41d6-9dd3-460666f735a0	2021-06-28 09:07:39.959275+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	50cc22f8-e1b5-4e97-b005-57794768edae	5df47275-e69a-463a-8850-5a7a51cca633	2021-08-03 10:55:55.090944+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	47b58a79-58ed-4ab8-91c6-00584868725d	89cff57c-c228-452f-9dd6-298c7aa68c2f	2021-06-24 12:55:34.993542+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	ed0cd994-b487-43f9-a7af-3bd5b64830b4	f4529541-0a80-448a-b4d4-9b4bb6c15568	2021-08-11 09:12:44.025797+00
7a90bccb-346e-4933-aaeb-cdef732be976	df6b6e91-9e9d-4f59-aa10-58ba5b25f9e0	0cb79a53-cde5-423a-bb70-d640b00da5de	2021-07-20 13:41:48.470774+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	f5d29f20-c37a-489e-9273-4d29f451ad6f	667c05da-22db-4709-bb45-abb89dea0ceb	2021-06-24 12:04:06.57124+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	389d6acf-b00a-42fd-bdbd-4df84f96bbf6	0cb75d2b-60ee-4de2-807b-fd2e999b1567	2021-06-29 11:49:13.030617+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	ac7cc3cd-7bd1-4990-95a3-0537ab485bc5	2e80afed-6add-47ea-b073-e2962370a0ff	2021-06-28 07:52:03.558796+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	f49a2562-3073-4a5a-8c77-c2e7a514b63f	ace07a95-e13a-4970-937c-1192c57138a2	2021-07-20 13:01:50.542992+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	72158001-ba0e-426d-9636-d09bf63efe9d	258b9bc3-3456-4d22-b2cc-dc55145570f2	2021-07-20 14:23:38.471051+00
f30de478-b560-47f5-8588-8062ffc64a25	f49a2562-3073-4a5a-8c77-c2e7a514b63f	38d9a706-5fb8-41f8-937d-1d3129d0553f	2021-07-20 14:27:36.077491+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	f5d29f20-c37a-489e-9273-4d29f451ad6f	667c05da-22db-4709-bb45-abb89dea0ceb	2021-06-24 09:58:51.851988+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	ac7cc3cd-7bd1-4990-95a3-0537ab485bc5	2e80afed-6add-47ea-b073-e2962370a0ff	2021-06-28 09:07:33.809475+00
7a90bccb-346e-4933-aaeb-cdef732be976	c09f5001-8876-40ac-bfb5-7468d65edfc2	dbb2cc36-14ba-4ba9-a67b-16d372ffe697	2021-07-20 13:45:27.508102+00
f30de478-b560-47f5-8588-8062ffc64a25	34389740-7677-46f3-89d6-76ea52017019	808b5c47-f912-48a8-89d9-82a5da8a55fe	2021-07-20 14:42:30.393215+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	832f3a41-2f78-4402-9202-78ad6d64f4cd	5cb12417-792c-4558-8326-145012173662	2021-06-24 09:08:25.813649+00
f30de478-b560-47f5-8588-8062ffc64a25	47b58a79-58ed-4ab8-91c6-00584868725d	89cff57c-c228-452f-9dd6-298c7aa68c2f	2021-07-05 16:48:06.375035+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	0580623c-90ab-4b56-ae7e-c0a0f97fc6ca	09eec681-50c8-47b3-a313-2e6da8fd61f9	2021-06-24 13:09:58.720001+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	d8d2844e-e84c-4c27-a1d7-c3310afafda0	80bce362-8c08-4ae9-b060-ee4537ec0365	2021-08-10 10:54:36.049649+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	c2e6c5e7-2558-4d15-b8a2-bd393043db01	e5cdf3be-7519-4e93-8f76-8c1901a7a823	2021-06-24 09:59:12.91095+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	389d6acf-b00a-42fd-bdbd-4df84f96bbf6	7e870a71-3753-457a-858a-d5a81d240eb4	2021-06-24 09:59:13.924411+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	c2e6c5e7-2558-4d15-b8a2-bd393043db01	ef6dd74c-212f-4042-adde-31c8fa48d035	2021-06-30 13:05:48.63923+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	b4bbb420-3344-4331-b867-6c41ddd64536	0990cf48-5a36-4db1-adba-16de6a67d280	2021-06-24 15:55:35.09204+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	ccdf7719-9369-4cf4-8421-70c8a2dedd65	711ec935-6efe-4f66-b541-60e10a143e3c	2021-06-25 11:12:17.241082+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	b4bbb420-3344-4331-b867-6c41ddd64536	0990cf48-5a36-4db1-adba-16de6a67d280	2021-06-25 05:53:00.819399+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	f5d29f20-c37a-489e-9273-4d29f451ad6f	fd6afb0e-8f33-4970-84db-618d16b3e0dd	2021-06-28 06:04:55.652091+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	c56e8548-9a75-43f5-9a52-d45691ab0b13	89cff57c-c228-452f-9dd6-298c7aa68c2f	2021-06-24 12:55:53.439262+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	0580623c-90ab-4b56-ae7e-c0a0f97fc6ca	09eec681-50c8-47b3-a313-2e6da8fd61f9	2021-06-24 13:28:24.945913+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	c56e8548-9a75-43f5-9a52-d45691ab0b13	89cff57c-c228-452f-9dd6-298c7aa68c2f	2021-06-24 13:55:56.62581+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	e738800a-5a93-4e51-90fb-ca78109b076e	a6ad17ea-cb8d-4285-b1de-a1403e961572	2021-06-25 10:45:28.823338+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	c2e6c5e7-2558-4d15-b8a2-bd393043db01	e5cdf3be-7519-4e93-8f76-8c1901a7a823	2021-06-24 12:03:47.37453+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	0580623c-90ab-4b56-ae7e-c0a0f97fc6ca	09eec681-50c8-47b3-a313-2e6da8fd61f9	2021-06-24 14:14:18.590904+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	47b58a79-58ed-4ab8-91c6-00584868725d	89cff57c-c228-452f-9dd6-298c7aa68c2f	2021-06-25 05:53:16.679621+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	ac7cc3cd-7bd1-4990-95a3-0537ab485bc5	2e80afed-6add-47ea-b073-e2962370a0ff	2021-06-28 12:07:56.046952+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	ccdf7719-9369-4cf4-8421-70c8a2dedd65	711ec935-6efe-4f66-b541-60e10a143e3c	2021-06-24 11:38:07.396006+00
f30de478-b560-47f5-8588-8062ffc64a25	0580623c-90ab-4b56-ae7e-c0a0f97fc6ca	09eec681-50c8-47b3-a313-2e6da8fd61f9	2021-06-24 12:46:05.134723+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	ac7cc3cd-7bd1-4990-95a3-0537ab485bc5	7b31cbd5-7630-4dcb-9d99-1ad7e6ff4661	2021-06-24 11:06:19.476835+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	ccdf7719-9369-4cf4-8421-70c8a2dedd65	711ec935-6efe-4f66-b541-60e10a143e3c	2021-06-24 12:04:02.774347+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	0580623c-90ab-4b56-ae7e-c0a0f97fc6ca	09eec681-50c8-47b3-a313-2e6da8fd61f9	2021-06-24 12:50:08.157825+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	47b58a79-58ed-4ab8-91c6-00584868725d	89cff57c-c228-452f-9dd6-298c7aa68c2f	2021-06-25 12:52:14.852826+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	ccdf7719-9369-4cf4-8421-70c8a2dedd65	dae42297-d250-4553-b6db-d16b86f165e1	2021-06-29 11:45:17.508073+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	0580623c-90ab-4b56-ae7e-c0a0f97fc6ca	09eec681-50c8-47b3-a313-2e6da8fd61f9	2021-06-24 12:38:32.228233+00
f30de478-b560-47f5-8588-8062ffc64a25	c56e8548-9a75-43f5-9a52-d45691ab0b13	2e80afed-6add-47ea-b073-e2962370a0ff	2021-07-05 16:47:48.005085+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	7371c4ac-49c3-46b2-8028-7b1c3a9cef76	cae62dc9-09f0-4762-8e6a-874a093a09bd	2021-06-25 13:17:32.087469+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	b4bbb420-3344-4331-b867-6c41ddd64536	0990cf48-5a36-4db1-adba-16de6a67d280	2021-06-24 13:55:33.364739+00
7a90bccb-346e-4933-aaeb-cdef732be976	34389740-7677-46f3-89d6-76ea52017019	808b5c47-f912-48a8-89d9-82a5da8a55fe	2021-07-21 07:51:32.667474+00
f30de478-b560-47f5-8588-8062ffc64a25	b4bbb420-3344-4331-b867-6c41ddd64536	0990cf48-5a36-4db1-adba-16de6a67d280	2021-07-05 16:48:01.077037+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	44dcd3bf-fb17-401b-a8cc-9cf060f83c01	5e99d6ef-4906-41d6-9dd3-460666f735a0	2021-06-24 15:50:26.053332+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	389d6acf-b00a-42fd-bdbd-4df84f96bbf6	0cb75d2b-60ee-4de2-807b-fd2e999b1567	2021-06-30 07:26:04.853898+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	c56e8548-9a75-43f5-9a52-d45691ab0b13	0990cf48-5a36-4db1-adba-16de6a67d280	2021-06-25 05:53:14.192977+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	e738800a-5a93-4e51-90fb-ca78109b076e	a6ad17ea-cb8d-4285-b1de-a1403e961572	2021-06-27 19:02:45.666367+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	560f0651-59d7-4641-ab99-24776dceddc6	bb898ff1-fab9-415e-9de7-f6519f801379	2021-08-04 09:16:13.362074+00
ca652ee1-1423-42fe-a0ef-e5761a670845	7968122e-e49e-4d59-b1e7-d4e128824615	5207cd77-72d4-42eb-a63b-1c157028b15f	2021-07-28 06:59:13.171927+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	ac7cc3cd-7bd1-4990-95a3-0537ab485bc5	2e80afed-6add-47ea-b073-e2962370a0ff	2021-07-01 07:14:10.221505+00
7a90bccb-346e-4933-aaeb-cdef732be976	1d0464b7-8b84-4731-bb53-37c247f2b179	5fbfa618-762b-491f-a4d6-a550fbbe6382	2021-07-21 14:33:24.241892+00
ca652ee1-1423-42fe-a0ef-e5761a670845	96c354e5-89c7-47c2-8a23-3474dde5b7ee	9a383356-6ea8-405d-abf6-ebf8d9f09859	2021-06-28 05:36:45.411212+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	ccdf7719-9369-4cf4-8421-70c8a2dedd65	dae42297-d250-4553-b6db-d16b86f165e1	2021-06-30 07:25:55.527043+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	96c354e5-89c7-47c2-8a23-3474dde5b7ee	9a383356-6ea8-405d-abf6-ebf8d9f09859	2021-06-25 12:11:37.326322+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	96c354e5-89c7-47c2-8a23-3474dde5b7ee	88135e9e-316b-4222-a055-fe8c1bcf5872	2021-06-25 10:13:26.753361+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	ac7cc3cd-7bd1-4990-95a3-0537ab485bc5	2e80afed-6add-47ea-b073-e2962370a0ff	2021-06-28 15:10:45.334792+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	7371c4ac-49c3-46b2-8028-7b1c3a9cef76	7a71e94a-7cf0-4df9-9c48-7ecc0424e3d3	2021-06-25 10:13:28.747844+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	fc45c751-19c6-421e-96e9-a0fe01874f37	9cc6c521-609c-471b-9150-99cebcb81d37	2021-07-21 14:54:50.87559+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	c9082d89-1383-4f85-9a06-b3e2a518eaf5	ade99b60-bc15-45cb-9899-4ee4819d5cf7	2021-08-13 13:13:48.014963+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	44dcd3bf-fb17-401b-a8cc-9cf060f83c01	5e99d6ef-4906-41d6-9dd3-460666f735a0	2021-07-01 07:14:07.196047+00
ca652ee1-1423-42fe-a0ef-e5761a670845	d0b8bf8e-dd2e-4e00-84f5-b6c3ca13ea2a	bb62ac7d-66a1-4621-89cc-c31c272d2e01	2021-07-05 08:18:52.821274+00
ca652ee1-1423-42fe-a0ef-e5761a670845	e738800a-5a93-4e51-90fb-ca78109b076e	a6ad17ea-cb8d-4285-b1de-a1403e961572	2021-06-25 10:36:45.352987+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	4430d17f-63f1-4182-ab5b-608ab06bff29	da00aef3-bf74-4ebb-a993-44ed878ad0b8	2021-07-07 14:10:21.9427+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	26dc18b0-cbc0-4b34-8927-8be0fb231ae2	14598511-68f8-465b-b915-80e876aa2ad6	2021-07-07 14:10:13.540045+00
7a90bccb-346e-4933-aaeb-cdef732be976	47b58a79-58ed-4ab8-91c6-00584868725d	89cff57c-c228-452f-9dd6-298c7aa68c2f	2021-06-28 09:20:55.39789+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	2d29bb62-fa72-47dd-92e2-e97256ad3ae1	c9b93150-0b15-4736-b07f-39e509bd2bc1	2021-07-06 07:45:19.444796+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	d1243295-e6ac-4da5-866f-582a9b419a4f	1d7f98a7-7661-4c6c-a423-50a194196406	2021-08-13 12:57:25.259629+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	806dfed4-1225-47b6-8de7-80b7fbc1cc87	a64a7704-6310-4a04-b169-6deef7f07aeb	2021-06-30 07:25:53.462769+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	44dcd3bf-fb17-401b-a8cc-9cf060f83c01	5e99d6ef-4906-41d6-9dd3-460666f735a0	2021-06-28 15:10:41.082834+00
7a90bccb-346e-4933-aaeb-cdef732be976	7371c4ac-49c3-46b2-8028-7b1c3a9cef76	cae62dc9-09f0-4762-8e6a-874a093a09bd	2021-06-25 18:14:07.202377+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	3cfb5146-8c01-4581-a5f4-a65130a188a3	701f08f1-a329-4938-af86-7034415f3567	2021-07-05 08:40:35.876611+00
ca652ee1-1423-42fe-a0ef-e5761a670845	7371c4ac-49c3-46b2-8028-7b1c3a9cef76	cae62dc9-09f0-4762-8e6a-874a093a09bd	2021-06-28 05:37:38.216956+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	806dfed4-1225-47b6-8de7-80b7fbc1cc87	a64a7704-6310-4a04-b169-6deef7f07aeb	2021-06-28 18:41:06.330053+00
7a90bccb-346e-4933-aaeb-cdef732be976	44dcd3bf-fb17-401b-a8cc-9cf060f83c01	5e99d6ef-4906-41d6-9dd3-460666f735a0	2021-06-25 17:59:12.688345+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	749313b8-ad19-40e1-89bc-63844d9fccec	7dd285c0-48d9-4b51-9b93-5128047a9830	2021-07-15 05:47:49.349324+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	4430d17f-63f1-4182-ab5b-608ab06bff29	da00aef3-bf74-4ebb-a993-44ed878ad0b8	2021-06-30 16:04:40.41607+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	3cfb5146-8c01-4581-a5f4-a65130a188a3	701f08f1-a329-4938-af86-7034415f3567	2021-07-01 15:22:09.819737+00
7a90bccb-346e-4933-aaeb-cdef732be976	0580623c-90ab-4b56-ae7e-c0a0f97fc6ca	09eec681-50c8-47b3-a313-2e6da8fd61f9	2021-06-25 18:00:13.853387+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	b4bbb420-3344-4331-b867-6c41ddd64536	0990cf48-5a36-4db1-adba-16de6a67d280	2021-06-25 14:20:51.704044+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	d6e29e34-926f-43e5-b8ca-d91e53061ae1	c74c1d58-20e9-4353-ae17-8bd7e76c1268	2021-06-30 16:04:52.492253+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	806dfed4-1225-47b6-8de7-80b7fbc1cc87	a64a7704-6310-4a04-b169-6deef7f07aeb	2021-06-30 13:02:25.018235+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	b4bbb420-3344-4331-b867-6c41ddd64536	0990cf48-5a36-4db1-adba-16de6a67d280	2021-06-25 12:52:09.814677+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	7e708d94-ba39-4aed-bd69-f0a7d0c9b957	c2a9a084-5d28-48da-87b0-3b5fab501be7	2021-07-01 08:52:55.677976+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	26dc18b0-cbc0-4b34-8927-8be0fb231ae2	14598511-68f8-465b-b915-80e876aa2ad6	2021-06-29 09:47:19.790835+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	4430d17f-63f1-4182-ab5b-608ab06bff29	da00aef3-bf74-4ebb-a993-44ed878ad0b8	2021-06-29 09:14:58.772142+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	2d29bb62-fa72-47dd-92e2-e97256ad3ae1	c9b93150-0b15-4736-b07f-39e509bd2bc1	2021-07-06 13:50:32.187522+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	08dc2b07-48df-4877-a228-167e962bd960	e28a7017-5425-42e4-8092-8e45a278b391	2021-07-01 08:52:57.706627+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	08dc2b07-48df-4877-a228-167e962bd960	e28a7017-5425-42e4-8092-8e45a278b391	2021-06-25 14:25:03.764215+00
7a90bccb-346e-4933-aaeb-cdef732be976	ac7cc3cd-7bd1-4990-95a3-0537ab485bc5	a169a59d-a296-48e5-b139-1e402411da4b	2021-06-28 07:38:25.517628+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	69b94728-fc60-46c6-b9cb-d6485e622725	da33ffc6-f68d-4f2a-8852-5e15c047402d	2021-08-09 15:18:09.496074+00
ca652ee1-1423-42fe-a0ef-e5761a670845	43856419-1592-4a2d-9ac9-548906db3c28	9075b88c-62a5-4a6b-b222-9bdb5b505567	2021-07-01 14:08:45.308744+00
7a90bccb-346e-4933-aaeb-cdef732be976	b4bbb420-3344-4331-b867-6c41ddd64536	0990cf48-5a36-4db1-adba-16de6a67d280	2021-06-28 07:39:56.249376+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	7e708d94-ba39-4aed-bd69-f0a7d0c9b957	c2a9a084-5d28-48da-87b0-3b5fab501be7	2021-07-05 12:43:33.365985+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	d26b031f-fd54-471c-a6eb-2c481d128340	fd965d72-6df6-4075-90f2-b6e4cfb2b752	2021-07-05 08:40:45.515127+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	61659450-ba26-43cf-bc54-dbdeee7a39c8	3e88d2aa-b217-48b2-9447-676ad71e7995	2021-08-10 10:54:37.631843+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	d26b031f-fd54-471c-a6eb-2c481d128340	fd965d72-6df6-4075-90f2-b6e4cfb2b752	2021-07-01 15:03:05.996528+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	749313b8-ad19-40e1-89bc-63844d9fccec	7dd285c0-48d9-4b51-9b93-5128047a9830	2021-07-27 09:25:12.263921+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	d6e29e34-926f-43e5-b8ca-d91e53061ae1	c74c1d58-20e9-4353-ae17-8bd7e76c1268	2021-07-07 14:10:20.942135+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	6159e96d-a508-45e2-8868-345533482eed	0308ee84-9f2c-48bc-88aa-084eeadc570d	2021-08-11 08:17:54.745087+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	d0b8bf8e-dd2e-4e00-84f5-b6c3ca13ea2a	bb62ac7d-66a1-4621-89cc-c31c272d2e01	2021-07-30 09:23:35.534911+00
ca652ee1-1423-42fe-a0ef-e5761a670845	d26b031f-fd54-471c-a6eb-2c481d128340	fd965d72-6df6-4075-90f2-b6e4cfb2b752	2021-07-01 14:08:46.446429+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	26dc18b0-cbc0-4b34-8927-8be0fb231ae2	14598511-68f8-465b-b915-80e876aa2ad6	2021-06-30 13:07:05.596708+00
7a90bccb-346e-4933-aaeb-cdef732be976	96c354e5-89c7-47c2-8a23-3474dde5b7ee	9a383356-6ea8-405d-abf6-ebf8d9f09859	2021-06-26 14:14:00.881582+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	d6e29e34-926f-43e5-b8ca-d91e53061ae1	c74c1d58-20e9-4353-ae17-8bd7e76c1268	2021-07-01 09:38:27.561569+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	055a8d84-dc22-4aad-8d37-adbe9e19545d	a7048445-6393-4b95-8f93-7bd598be71a5	2021-08-09 17:21:21.231741+00
7a90bccb-346e-4933-aaeb-cdef732be976	27395777-4065-4830-9c4b-65c7516a400a	b922c2cb-0f5e-4798-a2bd-a563e4cea905	2021-07-19 10:53:09.779324+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	43856419-1592-4a2d-9ac9-548906db3c28	9075b88c-62a5-4a6b-b222-9bdb5b505567	2021-07-01 15:03:16.655919+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	d26b031f-fd54-471c-a6eb-2c481d128340	fd965d72-6df6-4075-90f2-b6e4cfb2b752	2021-07-01 14:18:18.639402+00
ca652ee1-1423-42fe-a0ef-e5761a670845	3cfb5146-8c01-4581-a5f4-a65130a188a3	4de87cc2-9e83-4330-b950-b9188d64e545	2021-07-01 14:08:47.669454+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	43856419-1592-4a2d-9ac9-548906db3c28	9075b88c-62a5-4a6b-b222-9bdb5b505567	2021-07-05 08:40:49.906856+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	d6e29e34-926f-43e5-b8ca-d91e53061ae1	c74c1d58-20e9-4353-ae17-8bd7e76c1268	2021-06-29 13:35:28.108001+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	d6e29e34-926f-43e5-b8ca-d91e53061ae1	c74c1d58-20e9-4353-ae17-8bd7e76c1268	2021-07-01 10:50:01.177405+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	3cfb5146-8c01-4581-a5f4-a65130a188a3	701f08f1-a329-4938-af86-7034415f3567	2021-07-01 15:35:29.506513+00
ca652ee1-1423-42fe-a0ef-e5761a670845	69b94728-fc60-46c6-b9cb-d6485e622725	da33ffc6-f68d-4f2a-8852-5e15c047402d	2021-08-10 07:27:40.628184+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	ed320f20-c3c0-4ffa-9943-37df7eaa5ea8	db64ae10-1444-40c0-89bc-0eb434f484e4	2021-07-30 09:29:19.206015+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	43856419-1592-4a2d-9ac9-548906db3c28	9075b88c-62a5-4a6b-b222-9bdb5b505567	2021-07-01 15:01:57.409751+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	d26b031f-fd54-471c-a6eb-2c481d128340	fd965d72-6df6-4075-90f2-b6e4cfb2b752	2021-07-01 15:23:40.369609+00
ca652ee1-1423-42fe-a0ef-e5761a670845	47b58a79-58ed-4ab8-91c6-00584868725d	89cff57c-c228-452f-9dd6-298c7aa68c2f	2021-07-01 14:08:53.014671+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	f2bbb218-3433-4e3c-b3be-759d1c470619	6914f32a-7e56-4490-afd2-72c02cc09102	2021-07-05 10:23:54.03286+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	43856419-1592-4a2d-9ac9-548906db3c28	9075b88c-62a5-4a6b-b222-9bdb5b505567	2021-07-01 15:38:08.125849+00
ca652ee1-1423-42fe-a0ef-e5761a670845	44dcd3bf-fb17-401b-a8cc-9cf060f83c01	5e99d6ef-4906-41d6-9dd3-460666f735a0	2021-07-01 14:08:55.205026+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	19507902-5471-42bb-9dce-2b72d42d3456	cc070e02-4cc9-44a2-bdc3-395bd28f6551	2021-07-05 09:04:07.960369+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	2d29bb62-fa72-47dd-92e2-e97256ad3ae1	c9b93150-0b15-4736-b07f-39e509bd2bc1	2021-07-06 08:03:16.354376+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	7e708d94-ba39-4aed-bd69-f0a7d0c9b957	c2a9a084-5d28-48da-87b0-3b5fab501be7	2021-07-05 16:25:17.653697+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	f2bbb218-3433-4e3c-b3be-759d1c470619	6914f32a-7e56-4490-afd2-72c02cc09102	2021-07-06 08:04:16.698948+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	19507902-5471-42bb-9dce-2b72d42d3456	cc070e02-4cc9-44a2-bdc3-395bd28f6551	2021-07-06 08:04:17.69322+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	19507902-5471-42bb-9dce-2b72d42d3456	cc070e02-4cc9-44a2-bdc3-395bd28f6551	2021-07-06 08:09:49.393995+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	749313b8-ad19-40e1-89bc-63844d9fccec	7dd285c0-48d9-4b51-9b93-5128047a9830	2021-07-15 08:03:40.209579+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	2d29bb62-fa72-47dd-92e2-e97256ad3ae1	c9b93150-0b15-4736-b07f-39e509bd2bc1	2021-07-05 13:58:03.192471+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	ac9192a7-ff8e-4ed9-9d7f-c0c72e71dfd5	c2a9a084-5d28-48da-87b0-3b5fab501be7	2021-07-05 10:13:15.547997+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	08dc2b07-48df-4877-a228-167e962bd960	e28a7017-5425-42e4-8092-8e45a278b391	2021-07-05 09:19:44.176126+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	19507902-5471-42bb-9dce-2b72d42d3456	cc070e02-4cc9-44a2-bdc3-395bd28f6551	2021-07-05 12:21:33.094462+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	f2bbb218-3433-4e3c-b3be-759d1c470619	6914f32a-7e56-4490-afd2-72c02cc09102	2021-07-05 12:32:37.393705+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	f2bbb218-3433-4e3c-b3be-759d1c470619	6914f32a-7e56-4490-afd2-72c02cc09102	2021-07-08 15:01:51.859938+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	1d0464b7-8b84-4731-bb53-37c247f2b179	5fbfa618-762b-491f-a4d6-a550fbbe6382	2021-07-20 12:32:07.513222+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	3cfb5146-8c01-4581-a5f4-a65130a188a3	701f08f1-a329-4938-af86-7034415f3567	2021-07-06 08:11:52.792557+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	f49a2562-3073-4a5a-8c77-c2e7a514b63f	33e38b64-688a-4e41-bc30-f66f60da0534	2021-07-20 13:49:33.868223+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	749313b8-ad19-40e1-89bc-63844d9fccec	7dd285c0-48d9-4b51-9b93-5128047a9830	2021-07-26 14:45:33.252342+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	df6b6e91-9e9d-4f59-aa10-58ba5b25f9e0	e3be1bfc-5d2c-4b08-b0b7-a6e391d0c15b	2021-07-20 14:39:39.716189+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	795d9351-a097-48a7-9c5a-7a0409341af4	42519d93-decc-4f6e-bfc7-b16922e00c34	2021-08-10 09:46:52.097924+00
7a90bccb-346e-4933-aaeb-cdef732be976	87b6097f-6232-43f6-a3a8-0e1c3104212d	4714fd57-9657-48cd-bb67-e7a398cc7423	2021-08-11 12:28:24.009035+00
f30de478-b560-47f5-8588-8062ffc64a25	ac7cc3cd-7bd1-4990-95a3-0537ab485bc5	2e80afed-6add-47ea-b073-e2962370a0ff	2021-07-05 16:47:46.751901+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	199c2d94-5468-46a4-bdef-111304e7d005	4f1c8597-174d-4876-9e4c-91416e74c83b	2021-07-07 08:22:36.887663+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	199c2d94-5468-46a4-bdef-111304e7d005	4f1c8597-174d-4876-9e4c-91416e74c83b	2021-07-20 14:37:43.451653+00
f30de478-b560-47f5-8588-8062ffc64a25	52fba8d8-7964-4248-a182-c72798e80be5	dd86731f-1f8b-47e3-8b1a-da973b40d38f	2021-08-09 12:25:12.810912+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	dc512cc6-7ef4-489b-9187-45a8202156ad	8d05a368-f9eb-43b1-bea3-d1858cbde83c	2021-08-13 12:57:26.207054+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	6219d4cb-232d-4c8c-86a9-7b4ad4444817	de25b322-0d0c-4323-9fb0-7f22e3a63c18	2021-07-06 08:04:14.655099+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	d346172f-a1b2-48f4-b1e1-ea65bfbfaa6c	c3234c77-2ca5-423e-8918-3a286d15ce53	2021-08-11 09:12:45.465947+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	27395777-4065-4830-9c4b-65c7516a400a	b922c2cb-0f5e-4798-a2bd-a563e4cea905	2021-07-30 09:23:42.202341+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	1d0464b7-8b84-4731-bb53-37c247f2b179	5fbfa618-762b-491f-a4d6-a550fbbe6382	2021-08-12 11:38:18.23078+00
f30de478-b560-47f5-8588-8062ffc64a25	d26b031f-fd54-471c-a6eb-2c481d128340	fd965d72-6df6-4075-90f2-b6e4cfb2b752	2021-07-05 16:48:35.259158+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	6219d4cb-232d-4c8c-86a9-7b4ad4444817	de25b322-0d0c-4323-9fb0-7f22e3a63c18	2021-07-05 13:44:07.426402+00
f30de478-b560-47f5-8588-8062ffc64a25	43856419-1592-4a2d-9ac9-548906db3c28	9075b88c-62a5-4a6b-b222-9bdb5b505567	2021-07-05 16:48:36.28099+00
f30de478-b560-47f5-8588-8062ffc64a25	6c291865-999e-4a1d-9588-5ad93cedbbf5	8d9baf3b-8190-49f1-8c53-854fc751ade6	2021-08-12 13:21:16.838019+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	2d29bb62-fa72-47dd-92e2-e97256ad3ae1	c9b93150-0b15-4736-b07f-39e509bd2bc1	2021-07-05 14:33:18.870158+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	6219d4cb-232d-4c8c-86a9-7b4ad4444817	de25b322-0d0c-4323-9fb0-7f22e3a63c18	2021-07-05 14:53:22.244776+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	6219d4cb-232d-4c8c-86a9-7b4ad4444817	de25b322-0d0c-4323-9fb0-7f22e3a63c18	2021-07-06 08:11:19.74687+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	78221c97-282c-40f1-a65a-21522e819307	343299b4-c5bc-42b4-9f10-accdd5f91d22	2021-07-07 14:10:55.980624+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	454b94ed-7e72-4a9e-b221-efc9aad86483	fe1194a2-9755-4704-ac1e-69f949d49b3d	2021-08-01 12:10:13.339797+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	6219d4cb-232d-4c8c-86a9-7b4ad4444817	de25b322-0d0c-4323-9fb0-7f22e3a63c18	2021-07-06 10:59:34.293771+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	065f3700-82a7-4025-bb40-c5362b53f3ba	361ef2f7-185b-4d85-87ab-003e7042175f	2021-08-03 13:14:54.409435+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	09bbcc44-9b82-434a-86cf-337c14f77172	343299b4-c5bc-42b4-9f10-accdd5f91d22	2021-07-07 14:45:56.087704+00
7a90bccb-346e-4933-aaeb-cdef732be976	d0b8bf8e-dd2e-4e00-84f5-b6c3ca13ea2a	bb62ac7d-66a1-4621-89cc-c31c272d2e01	2021-07-19 10:27:39.90068+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	f159d13d-55aa-42eb-8653-89486d8ba839	cd1d94c9-cbf5-452c-8af9-bd4add46514d	2021-07-19 11:38:10.72121+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	1eeb42bc-106a-4487-bf2f-b78f948cddae	a210b0f1-5d55-45b6-98c0-949a90a8e741	2021-07-06 12:28:28.527606+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	d8637f2f-e6d8-4a8a-b647-68c487eecd06	9eec325a-a815-4147-9aca-32576cd28617	2021-07-07 14:10:59.101272+00
f30de478-b560-47f5-8588-8062ffc64a25	2d29bb62-fa72-47dd-92e2-e97256ad3ae1	c9b93150-0b15-4736-b07f-39e509bd2bc1	2021-07-06 11:25:52.929747+00
f30de478-b560-47f5-8588-8062ffc64a25	6219d4cb-232d-4c8c-86a9-7b4ad4444817	de25b322-0d0c-4323-9fb0-7f22e3a63c18	2021-07-06 11:25:53.317908+00
f30de478-b560-47f5-8588-8062ffc64a25	f2bbb218-3433-4e3c-b3be-759d1c470619	6914f32a-7e56-4490-afd2-72c02cc09102	2021-07-06 11:25:53.960817+00
f30de478-b560-47f5-8588-8062ffc64a25	19507902-5471-42bb-9dce-2b72d42d3456	cc070e02-4cc9-44a2-bdc3-395bd28f6551	2021-07-06 11:25:55.223101+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	d7046540-e347-43df-bd08-49e5a13cc30e	4fb18e0c-1012-4601-a72b-de01fbaa9848	2021-07-15 09:05:07.739892+00
f30de478-b560-47f5-8588-8062ffc64a25	3cfb5146-8c01-4581-a5f4-a65130a188a3	701f08f1-a329-4938-af86-7034415f3567	2021-07-06 11:45:19.786763+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	8a5afa50-4bb2-4820-89ee-5f3c51f0a65c	198bb30f-9bf5-4a03-b12a-ad1d2153464d	2021-07-06 11:55:49.177759+00
f30de478-b560-47f5-8588-8062ffc64a25	a666d87d-e793-42da-bbda-6305da5851e6	ccc78f53-bdcb-44cc-a69e-e868b7deaa31	2021-07-06 11:54:42.448629+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	1eeb42bc-106a-4487-bf2f-b78f948cddae	a210b0f1-5d55-45b6-98c0-949a90a8e741	2021-07-08 12:03:43.886674+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	fd31d5d0-5e34-494a-9d25-26a77f0019a8	6f1eca7e-5e4e-4f6f-9f7d-07b2ea9d222b	2021-08-02 09:12:36.456392+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	62bf892c-50fd-4588-8689-457b43cc086f	f7099819-99c2-438f-b550-bda3002b03c0	2021-07-08 15:46:07.60056+00
7a90bccb-346e-4933-aaeb-cdef732be976	5398f1f3-c8c2-4d39-b1d2-b981c57f732a	c1ded02a-9566-44d2-9015-772dc7adf23d	2021-07-06 21:59:56.544835+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	8a5afa50-4bb2-4820-89ee-5f3c51f0a65c	198bb30f-9bf5-4a03-b12a-ad1d2153464d	2021-07-06 13:09:44.523285+00
7a90bccb-346e-4933-aaeb-cdef732be976	d7046540-e347-43df-bd08-49e5a13cc30e	4fb18e0c-1012-4601-a72b-de01fbaa9848	2021-07-14 18:55:28.69388+00
f30de478-b560-47f5-8588-8062ffc64a25	8a5afa50-4bb2-4820-89ee-5f3c51f0a65c	198bb30f-9bf5-4a03-b12a-ad1d2153464d	2021-07-06 11:54:45.705779+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	5398f1f3-c8c2-4d39-b1d2-b981c57f732a	c1ded02a-9566-44d2-9015-772dc7adf23d	2021-07-06 13:09:45.534947+00
f30de478-b560-47f5-8588-8062ffc64a25	5398f1f3-c8c2-4d39-b1d2-b981c57f732a	c1ded02a-9566-44d2-9015-772dc7adf23d	2021-07-06 11:56:19.88944+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	8a5afa50-4bb2-4820-89ee-5f3c51f0a65c	198bb30f-9bf5-4a03-b12a-ad1d2153464d	2021-07-08 09:34:27.411906+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	282e0cf6-ba9f-48b9-af3f-e2441779a201	05953ed1-302a-4994-a67a-7f7c58dde689	2021-07-07 07:28:46.244167+00
7a90bccb-346e-4933-aaeb-cdef732be976	c761769d-faa6-4e2d-8e90-cffde5b87084	718f05bb-8e8c-46ee-90c3-2f3b8327c773	2021-08-02 15:10:39.333544+00
7a90bccb-346e-4933-aaeb-cdef732be976	a666d87d-e793-42da-bbda-6305da5851e6	7ec7bd2c-5e16-4303-9227-f1ff1106f81c	2021-08-02 11:16:24.807893+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	5398f1f3-c8c2-4d39-b1d2-b981c57f732a	c1ded02a-9566-44d2-9015-772dc7adf23d	2021-07-06 11:57:20.815948+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	5a546add-1b24-4216-8a78-e8f0fe03eef3	c0346c21-9800-45cd-a53f-922c3c750c74	2021-07-20 15:03:46.06716+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	c761769d-faa6-4e2d-8e90-cffde5b87084	718f05bb-8e8c-46ee-90c3-2f3b8327c773	2021-07-14 14:16:36.998609+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	a8663afc-06b9-4e95-a9c8-bd57f898bf52	3a9a1050-e9f8-4841-a44b-f722da51eeb2	2021-08-13 16:08:13.720692+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	a666d87d-e793-42da-bbda-6305da5851e6	7ec7bd2c-5e16-4303-9227-f1ff1106f81c	2021-07-14 07:31:46.741405+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	5398f1f3-c8c2-4d39-b1d2-b981c57f732a	c1ded02a-9566-44d2-9015-772dc7adf23d	2021-07-08 09:34:30.402081+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	31ab13dd-4581-4532-9a7f-ae7be2c069f8	a825cdf7-923e-401b-8798-b580f18f30ef	2021-07-08 10:37:44.330218+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	a71bf8c3-a302-483d-8877-bf1f6c1f15b4	3d6b8cd2-2a94-4daa-a253-b7ed197e03f8	2021-07-08 09:55:30.228661+00
ca652ee1-1423-42fe-a0ef-e5761a670845	66b1e85b-fa20-4fa6-8b28-fe963d3688f4	5d606fd1-97fb-4d6d-b9ee-7e982a6c29dd	2021-07-07 06:21:08.568115+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	5a546add-1b24-4216-8a78-e8f0fe03eef3	c0346c21-9800-45cd-a53f-922c3c750c74	2021-07-21 15:23:43.106772+00
7a90bccb-346e-4933-aaeb-cdef732be976	e0c2d69a-acfd-4080-9bcd-71fbc7f3a182	bc8343d9-93de-4db2-ade7-7ab48eaacded	2021-08-03 11:38:08.006345+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	62890a70-c900-42b0-b16b-bacc42a7a036	b15863cf-ec02-43fc-837d-e7e7f585c7e7	2021-07-08 09:14:52.561287+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	452413c4-3e20-4c8a-be25-fda44428c9a0	38822a08-a0bf-4351-b45d-73fd148dc84a	2021-07-08 09:44:01.513507+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	62890a70-c900-42b0-b16b-bacc42a7a036	b15863cf-ec02-43fc-837d-e7e7f585c7e7	2021-07-09 11:50:24.358415+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	282e0cf6-ba9f-48b9-af3f-e2441779a201	05953ed1-302a-4994-a67a-7f7c58dde689	2021-07-08 09:38:28.244265+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	78221c97-282c-40f1-a65a-21522e819307	9eec325a-a815-4147-9aca-32576cd28617	2021-07-07 13:59:37.23493+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	fd31d5d0-5e34-494a-9d25-26a77f0019a8	6f1eca7e-5e4e-4f6f-9f7d-07b2ea9d222b	2021-08-05 11:51:09.339297+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	fd31d5d0-5e34-494a-9d25-26a77f0019a8	9bbac32c-91bc-40fd-89cd-40ef4d0e2aa4	2021-07-07 15:55:35.52573+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	c761769d-faa6-4e2d-8e90-cffde5b87084	718f05bb-8e8c-46ee-90c3-2f3b8327c773	2021-07-16 11:05:34.570061+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	452413c4-3e20-4c8a-be25-fda44428c9a0	38822a08-a0bf-4351-b45d-73fd148dc84a	2021-07-09 07:28:19.059976+00
f30de478-b560-47f5-8588-8062ffc64a25	62bf892c-50fd-4588-8689-457b43cc086f	f7099819-99c2-438f-b550-bda3002b03c0	2021-07-08 15:53:57.08273+00
7a90bccb-346e-4933-aaeb-cdef732be976	66b1e85b-fa20-4fa6-8b28-fe963d3688f4	5d606fd1-97fb-4d6d-b9ee-7e982a6c29dd	2021-07-06 21:59:17.342187+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	6c8e4917-369e-4665-aefb-0ff9e808c0f2	1c693bc4-e391-40a5-86a1-259469ae3ae8	2021-07-14 15:15:31.416958+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	66b1e85b-fa20-4fa6-8b28-fe963d3688f4	a64ff8ed-cd96-47bf-820a-e68848efe0ad	2021-07-08 11:44:06.919164+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	2c680d67-2082-4bde-b507-4ae76898c0e4	ddfbdb7f-1131-43a3-bd8d-6502120b2761	2021-07-08 15:31:08.195479+00
7a90bccb-346e-4933-aaeb-cdef732be976	282e0cf6-ba9f-48b9-af3f-e2441779a201	05953ed1-302a-4994-a67a-7f7c58dde689	2021-07-06 21:59:49.596263+00
7a90bccb-346e-4933-aaeb-cdef732be976	065f3700-82a7-4025-bb40-c5362b53f3ba	121a9aa1-749e-40d9-9b20-9c35adf77479	2021-08-03 11:17:22.872062+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	66b1e85b-fa20-4fa6-8b28-fe963d3688f4	5d606fd1-97fb-4d6d-b9ee-7e982a6c29dd	2021-07-07 09:39:48.334039+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	c761769d-faa6-4e2d-8e90-cffde5b87084	718f05bb-8e8c-46ee-90c3-2f3b8327c773	2021-07-14 07:23:59.4403+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	2c680d67-2082-4bde-b507-4ae76898c0e4	ddfbdb7f-1131-43a3-bd8d-6502120b2761	2021-07-09 11:40:32.244078+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	2c680d67-2082-4bde-b507-4ae76898c0e4	ddfbdb7f-1131-43a3-bd8d-6502120b2761	2021-07-08 09:14:50.521203+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	66b1e85b-fa20-4fa6-8b28-fe963d3688f4	a64ff8ed-cd96-47bf-820a-e68848efe0ad	2021-07-08 09:54:11.408829+00
7879f271-4036-48be-befb-f08de052bcdc	afda9b41-aa30-4dde-9b3b-781c45133b69	eefce1eb-17a5-4a47-ab53-f9659667678f	2021-08-03 13:50:30.539257+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	62bf892c-50fd-4588-8689-457b43cc086f	f7099819-99c2-438f-b550-bda3002b03c0	2021-07-08 16:30:08.11195+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	2c680d67-2082-4bde-b507-4ae76898c0e4	ddfbdb7f-1131-43a3-bd8d-6502120b2761	2021-07-08 09:55:35.524419+00
f30de478-b560-47f5-8588-8062ffc64a25	fd31d5d0-5e34-494a-9d25-26a77f0019a8	6f1eca7e-5e4e-4f6f-9f7d-07b2ea9d222b	2021-07-12 15:27:23.071788+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	c761769d-faa6-4e2d-8e90-cffde5b87084	718f05bb-8e8c-46ee-90c3-2f3b8327c773	2021-07-07 14:07:46.241414+00
f30de478-b560-47f5-8588-8062ffc64a25	62890a70-c900-42b0-b16b-bacc42a7a036	b15863cf-ec02-43fc-837d-e7e7f585c7e7	2021-07-07 15:54:06.308993+00
f30de478-b560-47f5-8588-8062ffc64a25	8819386c-658f-4629-9746-36de21ced530	f6da9540-6ef5-4f23-b702-2e5f775e7d2c	2021-08-09 12:25:06.490499+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	a666d87d-e793-42da-bbda-6305da5851e6	7ec7bd2c-5e16-4303-9227-f1ff1106f81c	2021-07-14 07:29:06.199664+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	66b1e85b-fa20-4fa6-8b28-fe963d3688f4	a64ff8ed-cd96-47bf-820a-e68848efe0ad	2021-07-08 15:18:55.583601+00
7a90bccb-346e-4933-aaeb-cdef732be976	199c2d94-5468-46a4-bdef-111304e7d005	4f1c8597-174d-4876-9e4c-91416e74c83b	2021-08-09 07:44:45.608506+00
7a90bccb-346e-4933-aaeb-cdef732be976	62bf892c-50fd-4588-8689-457b43cc086f	f7099819-99c2-438f-b550-bda3002b03c0	2021-07-12 14:11:56.478799+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	a666d87d-e793-42da-bbda-6305da5851e6	ccc78f53-bdcb-44cc-a69e-e868b7deaa31	2021-07-07 14:07:47.326931+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	a666d87d-e793-42da-bbda-6305da5851e6	7ec7bd2c-5e16-4303-9227-f1ff1106f81c	2021-07-14 08:05:09.396348+00
f30de478-b560-47f5-8588-8062ffc64a25	2c680d67-2082-4bde-b507-4ae76898c0e4	ddfbdb7f-1131-43a3-bd8d-6502120b2761	2021-07-08 08:06:19.441465+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	62890a70-c900-42b0-b16b-bacc42a7a036	b15863cf-ec02-43fc-837d-e7e7f585c7e7	2021-07-08 09:55:43.876326+00
ca652ee1-1423-42fe-a0ef-e5761a670845	0e98bd99-373d-42e4-9d94-aea273569288	9ff71725-b5cc-4651-ab70-f827e775984b	2021-08-03 14:36:48.49658+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	62bf892c-50fd-4588-8689-457b43cc086f	f7099819-99c2-438f-b550-bda3002b03c0	2021-07-08 16:44:50.426055+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	62bf892c-50fd-4588-8689-457b43cc086f	f7099819-99c2-438f-b550-bda3002b03c0	2021-07-09 11:50:14.401762+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	09bbcc44-9b82-434a-86cf-337c14f77172	343299b4-c5bc-42b4-9f10-accdd5f91d22	2021-07-07 17:42:45.235245+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	d8637f2f-e6d8-4a8a-b647-68c487eecd06	9eec325a-a815-4147-9aca-32576cd28617	2021-07-07 14:45:41.770138+00
31f1de58-af98-4946-997c-622cb20d9504	5402f67d-3e1f-46df-a5de-71d8f162e9c6	87aa0a8f-0a0e-4599-9e09-e78b14a334da	2021-08-11 16:41:09.025732+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	62bf892c-50fd-4588-8689-457b43cc086f	f7099819-99c2-438f-b550-bda3002b03c0	2021-07-09 08:56:24.022794+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	6c8e4917-369e-4665-aefb-0ff9e808c0f2	fc0a965f-028b-41ec-9957-ed1483482199	2021-07-07 15:55:43.078879+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	106b166b-b521-4776-bc32-4ec500ee7cd2	5f2b9cf9-310e-42d0-a2bd-66cbd4825fad	2021-08-04 15:14:22.088333+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	a71bf8c3-a302-483d-8877-bf1f6c1f15b4	3d6b8cd2-2a94-4daa-a253-b7ed197e03f8	2021-07-08 15:21:57.134803+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	66b1e85b-fa20-4fa6-8b28-fe963d3688f4	a64ff8ed-cd96-47bf-820a-e68848efe0ad	2021-07-08 15:48:13.793836+00
f30de478-b560-47f5-8588-8062ffc64a25	a71bf8c3-a302-483d-8877-bf1f6c1f15b4	3d6b8cd2-2a94-4daa-a253-b7ed197e03f8	2021-07-07 20:02:45.239638+00
f30de478-b560-47f5-8588-8062ffc64a25	66b1e85b-fa20-4fa6-8b28-fe963d3688f4	a64ff8ed-cd96-47bf-820a-e68848efe0ad	2021-07-08 09:24:31.750456+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	a71bf8c3-a302-483d-8877-bf1f6c1f15b4	3d6b8cd2-2a94-4daa-a253-b7ed197e03f8	2021-07-08 11:43:53.484706+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	282e0cf6-ba9f-48b9-af3f-e2441779a201	05953ed1-302a-4994-a67a-7f7c58dde689	2021-07-09 07:29:21.399934+00
f30de478-b560-47f5-8588-8062ffc64a25	c761769d-faa6-4e2d-8e90-cffde5b87084	718f05bb-8e8c-46ee-90c3-2f3b8327c773	2021-07-14 07:26:04.431133+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	c761769d-faa6-4e2d-8e90-cffde5b87084	718f05bb-8e8c-46ee-90c3-2f3b8327c773	2021-08-02 08:34:29.804825+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	5a546add-1b24-4216-8a78-e8f0fe03eef3	c0346c21-9800-45cd-a53f-922c3c750c74	2021-07-09 07:48:52.730082+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	a71bf8c3-a302-483d-8877-bf1f6c1f15b4	3d6b8cd2-2a94-4daa-a253-b7ed197e03f8	2021-07-08 09:14:57.908752+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	c5c343fd-1570-4bfa-a17e-5bc707d8f07a	5ff7d3fb-4fbf-4d1d-8b86-4351999a0dc0	2021-07-28 09:55:42.927242+00
f30de478-b560-47f5-8588-8062ffc64a25	ae383f79-5f57-418a-a547-dc50269da698	3c7b3f01-3be4-4d68-8592-efbabc954a98	2021-07-09 08:36:54.158576+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	7b0667e5-2d99-454f-95d2-4a1e71e306e3	6eb59070-e3ea-4be7-939f-0bd937d014a7	2021-07-09 08:58:24.802583+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	d891bc22-94e7-42b1-96af-b30f2a5efe2c	2bc3df81-d9ae-4c5d-8a5c-defe0e0afb9a	2021-07-14 15:15:23.94942+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	5a546add-1b24-4216-8a78-e8f0fe03eef3	c0346c21-9800-45cd-a53f-922c3c750c74	2021-07-08 12:03:34.650257+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	82924aaa-5223-4dd1-bbce-65b1f7dd1f37	b0149652-2da7-4f5c-ada9-7dd5bd3b67e7	2021-08-03 16:43:37.834854+00
f30de478-b560-47f5-8588-8062ffc64a25	7b0667e5-2d99-454f-95d2-4a1e71e306e3	6eb59070-e3ea-4be7-939f-0bd937d014a7	2021-07-08 15:44:44.794312+00
f30de478-b560-47f5-8588-8062ffc64a25	31ab13dd-4581-4532-9a7f-ae7be2c069f8	a825cdf7-923e-401b-8798-b580f18f30ef	2021-07-08 11:25:03.797224+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	452413c4-3e20-4c8a-be25-fda44428c9a0	38822a08-a0bf-4351-b45d-73fd148dc84a	2021-07-08 12:03:35.640872+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	7d401447-9caf-4713-812c-f1072d277d5c	ad8a95e0-506d-4b12-8daf-bc47889ff6c2	2021-08-12 11:43:47.049746+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	7b0667e5-2d99-454f-95d2-4a1e71e306e3	6eb59070-e3ea-4be7-939f-0bd937d014a7	2021-07-08 16:16:13.240458+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	7b0667e5-2d99-454f-95d2-4a1e71e306e3	6eb59070-e3ea-4be7-939f-0bd937d014a7	2021-07-09 05:41:57.107083+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	ae383f79-5f57-418a-a547-dc50269da698	3c7b3f01-3be4-4d68-8592-efbabc954a98	2021-07-09 08:15:13.357827+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	ae383f79-5f57-418a-a547-dc50269da698	bc7028de-ca13-49ca-a274-c32269f6070b	2021-07-08 09:55:33.386278+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	d7046540-e347-43df-bd08-49e5a13cc30e	4fb18e0c-1012-4601-a72b-de01fbaa9848	2021-07-16 09:49:15.044072+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	075df733-01b0-4e48-8953-f655868990b1	846a9e2f-d43c-4e28-9333-c05374b60d7a	2021-07-14 06:58:13.55099+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	7b0667e5-2d99-454f-95d2-4a1e71e306e3	6eb59070-e3ea-4be7-939f-0bd937d014a7	2021-07-08 16:32:39.985446+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	31ab13dd-4581-4532-9a7f-ae7be2c069f8	a825cdf7-923e-401b-8798-b580f18f30ef	2021-07-09 11:47:35.708566+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	dd805776-a22f-4897-891a-46ebc6fb4725	48bc50a5-2527-4787-9180-0d59eb28d879	2021-08-11 09:48:25.728644+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	62890a70-c900-42b0-b16b-bacc42a7a036	b15863cf-ec02-43fc-837d-e7e7f585c7e7	2021-07-08 15:43:24.025864+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	c761769d-faa6-4e2d-8e90-cffde5b87084	718f05bb-8e8c-46ee-90c3-2f3b8327c773	2021-08-09 12:16:56.344852+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	5398f1f3-c8c2-4d39-b1d2-b981c57f732a	c1ded02a-9566-44d2-9015-772dc7adf23d	2021-08-09 12:17:06.203951+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	a666d87d-e793-42da-bbda-6305da5851e6	7ec7bd2c-5e16-4303-9227-f1ff1106f81c	2021-08-09 12:17:01.882198+00
f30de478-b560-47f5-8588-8062ffc64a25	60b8e726-b97c-4f77-95bb-2702f8dcc216	84c6c327-f96a-4f92-bad7-3f84652a86e3	2021-08-03 08:47:59.378023+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	62bf892c-50fd-4588-8689-457b43cc086f	f7099819-99c2-438f-b550-bda3002b03c0	2021-07-08 16:32:48.232918+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	8a5afa50-4bb2-4820-89ee-5f3c51f0a65c	198bb30f-9bf5-4a03-b12a-ad1d2153464d	2021-08-09 12:17:04.735066+00
f30de478-b560-47f5-8588-8062ffc64a25	3a3ff258-367a-4236-b2ba-40b2619108db	df24ccd2-e276-4288-b11c-2bb6af3958f5	2021-08-09 12:25:18.219777+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	40464e44-d5df-48cb-b862-5a9b5d4ffa11	f2689615-7043-4f29-a4e7-a741aaec3f9e	2021-08-11 13:50:35.242028+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	31ab13dd-4581-4532-9a7f-ae7be2c069f8	a825cdf7-923e-401b-8798-b580f18f30ef	2021-07-08 10:45:17.72611+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	31ab13dd-4581-4532-9a7f-ae7be2c069f8	a825cdf7-923e-401b-8798-b580f18f30ef	2021-07-08 15:41:23.532754+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	282e0cf6-ba9f-48b9-af3f-e2441779a201	05953ed1-302a-4994-a67a-7f7c58dde689	2021-08-09 12:17:07.735406+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	66b1e85b-fa20-4fa6-8b28-fe963d3688f4	a64ff8ed-cd96-47bf-820a-e68848efe0ad	2021-07-08 15:15:37.333912+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	82924aaa-5223-4dd1-bbce-65b1f7dd1f37	b0149652-2da7-4f5c-ada9-7dd5bd3b67e7	2021-07-14 06:56:55.447404+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	ae383f79-5f57-418a-a547-dc50269da698	3c7b3f01-3be4-4d68-8592-efbabc954a98	2021-07-09 07:29:51.923636+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	6c8e4917-369e-4665-aefb-0ff9e808c0f2	1c693bc4-e391-40a5-86a1-259469ae3ae8	2021-07-13 12:23:39.283843+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	25383b6c-859b-4656-8a24-da4d3110ec97	74b66224-3e40-4c0e-b092-275db0826ef9	2021-08-13 08:23:18.764112+00
ca652ee1-1423-42fe-a0ef-e5761a670845	62bf892c-50fd-4588-8689-457b43cc086f	f7099819-99c2-438f-b550-bda3002b03c0	2021-07-08 15:47:26.149244+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	335d4e03-91e8-4c83-b3c4-29289dd7d04f	e387e6bf-b068-4438-acc5-4cb83d1e6ea4	2021-07-09 08:46:35.822063+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	669cc355-0269-491a-8573-80f7dddb9223	fd521666-a4f8-457e-95a3-270b31630003	2021-07-09 07:57:57.992415+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	335d4e03-91e8-4c83-b3c4-29289dd7d04f	3c7b3f01-3be4-4d68-8592-efbabc954a98	2021-07-09 07:29:53.538205+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	31ab13dd-4581-4532-9a7f-ae7be2c069f8	a825cdf7-923e-401b-8798-b580f18f30ef	2021-07-08 15:46:12.782107+00
ca652ee1-1423-42fe-a0ef-e5761a670845	7b0667e5-2d99-454f-95d2-4a1e71e306e3	6eb59070-e3ea-4be7-939f-0bd937d014a7	2021-07-08 15:55:09.026708+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	452413c4-3e20-4c8a-be25-fda44428c9a0	38822a08-a0bf-4351-b45d-73fd148dc84a	2021-07-09 08:07:21.558404+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	669cc355-0269-491a-8573-80f7dddb9223	fd521666-a4f8-457e-95a3-270b31630003	2021-07-09 08:05:15.462849+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	7b0667e5-2d99-454f-95d2-4a1e71e306e3	6eb59070-e3ea-4be7-939f-0bd937d014a7	2021-07-08 17:04:52.694235+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	ae383f79-5f57-418a-a547-dc50269da698	3c7b3f01-3be4-4d68-8592-efbabc954a98	2021-08-03 13:33:19.084475+00
ca652ee1-1423-42fe-a0ef-e5761a670845	fc45c751-19c6-421e-96e9-a0fe01874f37	9cc6c521-609c-471b-9150-99cebcb81d37	2021-07-19 06:23:57.548243+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	8ef2ac54-7d44-4bfd-b897-f88ee920764e	ead57afc-a01f-424f-bff0-7b97c925e8dd	2021-08-12 07:21:25.458202+00
f30de478-b560-47f5-8588-8062ffc64a25	335d4e03-91e8-4c83-b3c4-29289dd7d04f	e387e6bf-b068-4438-acc5-4cb83d1e6ea4	2021-07-09 08:40:11.2913+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	669cc355-0269-491a-8573-80f7dddb9223	fd521666-a4f8-457e-95a3-270b31630003	2021-07-09 08:01:45.385612+00
ca652ee1-1423-42fe-a0ef-e5761a670845	0558025b-be7f-429b-9736-4764a82933f0	0e310990-2e24-42cf-969a-0568f4657d07	2021-08-12 09:54:15.473613+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	7b0667e5-2d99-454f-95d2-4a1e71e306e3	6eb59070-e3ea-4be7-939f-0bd937d014a7	2021-07-09 11:50:54.557914+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	335d4e03-91e8-4c83-b3c4-29289dd7d04f	e387e6bf-b068-4438-acc5-4cb83d1e6ea4	2021-07-09 09:12:37.163563+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	dd805776-a22f-4897-891a-46ebc6fb4725	48bc50a5-2527-4787-9180-0d59eb28d879	2021-07-29 14:25:24.445914+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	b9b3f5f8-35a9-40cf-aed4-6f7cde6a2e37	c6e3996c-9029-4e1e-83cc-2e9c59543c6d	2021-07-22 08:24:15.797205+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	d5e1da06-f141-4bff-8b38-d480bf6c0b80	b6c3b248-4483-4215-b5fd-16d235c34e0b	2021-08-13 08:31:52.700541+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	8739fd8a-5a75-4c10-a573-12b1053df648	b2253abb-4593-4d3a-9689-3721411b1395	2021-07-14 09:43:05.44022+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	6bdaa572-6d23-417d-8197-fa0872ab8ba5	91831eb8-402b-4455-a421-dcc8d5d772e5	2021-07-12 07:06:32.615185+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	ec23d178-0a3a-4eaf-b2de-ef36bf46c235	fba5632d-6893-4ff2-bd5b-45087349ebbc	2021-08-13 08:24:34.119772+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	82924aaa-5223-4dd1-bbce-65b1f7dd1f37	b0149652-2da7-4f5c-ada9-7dd5bd3b67e7	2021-07-27 19:42:06.031513+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	c5c343fd-1570-4bfa-a17e-5bc707d8f07a	5ff7d3fb-4fbf-4d1d-8b86-4351999a0dc0	2021-08-04 07:28:55.821084+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	c5c343fd-1570-4bfa-a17e-5bc707d8f07a	5ff7d3fb-4fbf-4d1d-8b86-4351999a0dc0	2021-07-27 19:41:45.145095+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	5c601a00-3bdd-4601-836c-dc9a4d9eff3d	6582cedf-b97d-4f5d-9fb1-0600ad219d27	2021-07-29 14:25:26.829386+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	dfbdedcf-3646-4ff7-b094-25cb7c630c24	bb8e3357-6980-4e2f-8e0f-06e384e3076c	2021-07-12 13:36:07.948635+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	897e3352-a959-4262-aae9-ab4a3add9af7	b425c7c0-d320-4b3a-8a18-827c62550c29	2021-07-12 10:26:24.318231+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	8739fd8a-5a75-4c10-a573-12b1053df648	b2253abb-4593-4d3a-9689-3721411b1395	2021-07-27 19:41:57.676433+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	075df733-01b0-4e48-8953-f655868990b1	846a9e2f-d43c-4e28-9333-c05374b60d7a	2021-07-14 08:27:23.177535+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	fd31d5d0-5e34-494a-9d25-26a77f0019a8	6f1eca7e-5e4e-4f6f-9f7d-07b2ea9d222b	2021-07-20 14:23:05.615452+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	6e435fa3-e3f1-48e1-a493-dde16cce43a6	1fce5889-1add-4017-b3aa-d4e07bbeb0d3	2021-08-02 08:37:18.058463+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	a6edd11a-4374-4def-9f96-c3a02e5ed882	71cde7cb-3279-4b05-a209-12441f5f8c7d	2021-07-12 10:28:30.16089+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	8739fd8a-5a75-4c10-a573-12b1053df648	b2253abb-4593-4d3a-9689-3721411b1395	2021-07-14 06:57:20.938268+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	a6edd11a-4374-4def-9f96-c3a02e5ed882	71cde7cb-3279-4b05-a209-12441f5f8c7d	2021-07-12 10:29:34.167821+00
ca652ee1-1423-42fe-a0ef-e5761a670845	ed320f20-c3c0-4ffa-9943-37df7eaa5ea8	db64ae10-1444-40c0-89bc-0eb434f484e4	2021-07-12 09:11:54.064854+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	e6fa7e76-533c-45fa-85b8-ecef973c3c00	5afdcfc6-441b-4f3a-a92e-7c058c17cdfd	2021-08-10 10:54:47.908076+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	897e3352-a959-4262-aae9-ab4a3add9af7	b425c7c0-d320-4b3a-8a18-827c62550c29	2021-07-12 10:30:35.66992+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	065f3700-82a7-4025-bb40-c5362b53f3ba	361ef2f7-185b-4d85-87ab-003e7042175f	2021-08-03 12:40:06.81288+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	dfbdedcf-3646-4ff7-b094-25cb7c630c24	bb8e3357-6980-4e2f-8e0f-06e384e3076c	2021-07-13 08:00:36.09128+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	fb058431-a63e-42a5-bd84-7de87c21427a	18c580c4-dfc2-4a4c-b38b-ce19ad0d8f8b	2021-07-12 12:51:14.006138+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	075df733-01b0-4e48-8953-f655868990b1	846a9e2f-d43c-4e28-9333-c05374b60d7a	2021-07-13 15:27:50.961564+00
7879f271-4036-48be-befb-f08de052bcdc	d167d1c7-ba53-42c5-ac8a-c07c204215c8	cca89c91-94d3-44fa-a131-de21bec52df4	2021-08-15 14:43:52.211956+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	6e435fa3-e3f1-48e1-a493-dde16cce43a6	1fce5889-1add-4017-b3aa-d4e07bbeb0d3	2021-07-12 13:18:44.489616+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	897e3352-a959-4262-aae9-ab4a3add9af7	b425c7c0-d320-4b3a-8a18-827c62550c29	2021-07-12 11:48:29.93201+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	a6edd11a-4374-4def-9f96-c3a02e5ed882	71cde7cb-3279-4b05-a209-12441f5f8c7d	2021-07-12 11:48:42.422997+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	fb058431-a63e-42a5-bd84-7de87c21427a	18c580c4-dfc2-4a4c-b38b-ce19ad0d8f8b	2021-08-02 08:37:18.927399+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	63a7e4fb-03c6-4a8b-9581-063725d3faa5	637e69c9-6756-4b71-9d11-8b1985d1ebf9	2021-08-13 08:23:30.388678+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	6e435fa3-e3f1-48e1-a493-dde16cce43a6	1fce5889-1add-4017-b3aa-d4e07bbeb0d3	2021-07-12 13:13:16.615345+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	a73e3d2e-2e84-4b85-8ade-7d8446010c86	c3e4aec1-a0a2-49ef-a9e8-bba1b199dfbd	2021-07-30 09:23:36.849596+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	e1ae4e58-c24a-4cfd-bb67-db0ebe7a2fc9	826a197b-3441-4c2f-96e0-7b1210963f78	2021-07-12 12:55:20.186333+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	164ebb7f-0c05-45d1-a74a-09d46248d2bf	65602b1e-3b7a-4a58-80d1-8335bf9f5cce	2021-07-12 13:34:03.465444+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	6bdaa572-6d23-417d-8197-fa0872ab8ba5	91831eb8-402b-4455-a421-dcc8d5d772e5	2021-07-14 06:28:19.948721+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	d26b031f-fd54-471c-a6eb-2c481d128340	fd965d72-6df6-4075-90f2-b6e4cfb2b752	2021-07-12 14:12:30.104976+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	fb058431-a63e-42a5-bd84-7de87c21427a	18c580c4-dfc2-4a4c-b38b-ce19ad0d8f8b	2021-08-02 15:01:44.780772+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	dfbdedcf-3646-4ff7-b094-25cb7c630c24	bb8e3357-6980-4e2f-8e0f-06e384e3076c	2021-07-21 09:47:11.407061+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	dfbdedcf-3646-4ff7-b094-25cb7c630c24	bb8e3357-6980-4e2f-8e0f-06e384e3076c	2021-07-12 13:32:27.411973+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	164ebb7f-0c05-45d1-a74a-09d46248d2bf	65602b1e-3b7a-4a58-80d1-8335bf9f5cce	2021-07-12 13:19:22.849909+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	fb058431-a63e-42a5-bd84-7de87c21427a	18c580c4-dfc2-4a4c-b38b-ce19ad0d8f8b	2021-08-02 14:46:15.970766+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	6e435fa3-e3f1-48e1-a493-dde16cce43a6	1fce5889-1add-4017-b3aa-d4e07bbeb0d3	2021-07-12 13:26:38.665359+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	164ebb7f-0c05-45d1-a74a-09d46248d2bf	65602b1e-3b7a-4a58-80d1-8335bf9f5cce	2021-07-21 09:47:13.349105+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	164ebb7f-0c05-45d1-a74a-09d46248d2bf	65602b1e-3b7a-4a58-80d1-8335bf9f5cce	2021-07-12 13:36:35.915955+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	43856419-1592-4a2d-9ac9-548906db3c28	9075b88c-62a5-4a6b-b222-9bdb5b505567	2021-07-12 14:12:34.354506+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	3cfb5146-8c01-4581-a5f4-a65130a188a3	701f08f1-a329-4938-af86-7034415f3567	2021-07-12 14:12:38.840569+00
f30de478-b560-47f5-8588-8062ffc64a25	fb058431-a63e-42a5-bd84-7de87c21427a	18c580c4-dfc2-4a4c-b38b-ce19ad0d8f8b	2021-07-14 07:25:55.567083+00
f30de478-b560-47f5-8588-8062ffc64a25	b3abd6a4-3434-4550-bc84-f1f452130e64	954a0596-1a33-4800-9a84-d07ea80c66ab	2021-08-03 15:18:35.010458+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	fc45c751-19c6-421e-96e9-a0fe01874f37	9cc6c521-609c-471b-9150-99cebcb81d37	2021-07-19 07:01:07.920242+00
f30de478-b560-47f5-8588-8062ffc64a25	6c8e4917-369e-4665-aefb-0ff9e808c0f2	fc0a965f-028b-41ec-9957-ed1483482199	2021-07-12 15:27:23.936834+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	50b7fdb5-5067-4cb4-a178-121e4e61cd43	a4bc9967-3fa1-415c-b8b5-f6a4040cc78b	2021-07-13 14:03:05.768009+00
f30de478-b560-47f5-8588-8062ffc64a25	d891bc22-94e7-42b1-96af-b30f2a5efe2c	2bc3df81-d9ae-4c5d-8a5c-defe0e0afb9a	2021-07-12 15:28:56.87217+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	8739fd8a-5a75-4c10-a573-12b1053df648	b2253abb-4593-4d3a-9689-3721411b1395	2021-07-13 11:18:58.795684+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	fb058431-a63e-42a5-bd84-7de87c21427a	18c580c4-dfc2-4a4c-b38b-ce19ad0d8f8b	2021-07-15 11:59:38.569014+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	fb058431-a63e-42a5-bd84-7de87c21427a	18c580c4-dfc2-4a4c-b38b-ce19ad0d8f8b	2021-07-26 06:35:01.377971+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	6bdaa572-6d23-417d-8197-fa0872ab8ba5	91831eb8-402b-4455-a421-dcc8d5d772e5	2021-07-13 11:19:06.000201+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	60974c19-638b-4345-81f8-ec7195b3be09	7a81b16c-a03c-40f7-83de-3355088b9ae1	2021-07-20 15:03:34.517842+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	1f1026c2-5246-4788-8f67-933e06dffd7e	c44194cc-f9b0-433f-a798-1a0ed2a4072d	2021-07-21 09:18:08.578206+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	1f1026c2-5246-4788-8f67-933e06dffd7e	c44194cc-f9b0-433f-a798-1a0ed2a4072d	2021-07-15 06:08:41.967193+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	84d076a1-b88b-4232-8fe4-755f25411d9d	fcdf2627-51d6-4235-b4fd-7a08617ec540	2021-07-15 18:53:00.004036+00
7a90bccb-346e-4933-aaeb-cdef732be976	a73e3d2e-2e84-4b85-8ade-7d8446010c86	c3e4aec1-a0a2-49ef-a9e8-bba1b199dfbd	2021-07-29 18:50:52.025516+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	8e7acfee-cfe9-4ec0-a9b8-14aae24e0fa9	766a653a-108a-4d3b-8138-e5392f3653e9	2021-07-26 11:33:35.1526+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	8ac1179f-d0ae-4c76-8a3f-ffce22b68723	5ecfeec5-3f0f-487e-abbb-5f4aeda4d57a	2021-07-15 14:34:17.593593+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	d1652c94-3a20-405b-b578-4da26650989f	19f8b1bf-96b3-4b61-9555-65034a445810	2021-07-13 12:41:33.356428+00
f30de478-b560-47f5-8588-8062ffc64a25	164ebb7f-0c05-45d1-a74a-09d46248d2bf	65602b1e-3b7a-4a58-80d1-8335bf9f5cce	2021-07-14 07:25:16.680256+00
f30de478-b560-47f5-8588-8062ffc64a25	d1652c94-3a20-405b-b578-4da26650989f	36c56f46-7680-4c24-9eed-84fbd17a396f	2021-07-13 15:48:39.499432+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	d7046540-e347-43df-bd08-49e5a13cc30e	4fb18e0c-1012-4601-a72b-de01fbaa9848	2021-07-30 15:09:23.686+00
f30de478-b560-47f5-8588-8062ffc64a25	897e3352-a959-4262-aae9-ab4a3add9af7	b425c7c0-d320-4b3a-8a18-827c62550c29	2021-07-13 11:50:20.837918+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	8ac1179f-d0ae-4c76-8a3f-ffce22b68723	5ecfeec5-3f0f-487e-abbb-5f4aeda4d57a	2021-07-15 08:03:40.415395+00
f30de478-b560-47f5-8588-8062ffc64a25	8e7acfee-cfe9-4ec0-a9b8-14aae24e0fa9	766a653a-108a-4d3b-8138-e5392f3653e9	2021-08-02 09:31:28.278229+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	5c601a00-3bdd-4601-836c-dc9a4d9eff3d	d6146f20-fe4d-4389-a332-04c58fd7fd5f	2021-08-11 11:23:12.659414+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	a73e3d2e-2e84-4b85-8ade-7d8446010c86	c3e4aec1-a0a2-49ef-a9e8-bba1b199dfbd	2021-08-04 10:07:12.639485+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	84d076a1-b88b-4232-8fe4-755f25411d9d	fcdf2627-51d6-4235-b4fd-7a08617ec540	2021-08-05 11:41:49.572629+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	72158001-ba0e-426d-9636-d09bf63efe9d	258b9bc3-3456-4d22-b2cc-dc55145570f2	2021-08-05 11:41:55.186583+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	1f1026c2-5246-4788-8f67-933e06dffd7e	c44194cc-f9b0-433f-a798-1a0ed2a4072d	2021-07-14 12:38:17.762589+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	d7046540-e347-43df-bd08-49e5a13cc30e	4fb18e0c-1012-4601-a72b-de01fbaa9848	2021-07-20 11:33:51.949365+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	69b94728-fc60-46c6-b9cb-d6485e622725	da33ffc6-f68d-4f2a-8852-5e15c047402d	2021-08-11 09:00:30.087838+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	d891bc22-94e7-42b1-96af-b30f2a5efe2c	2bc3df81-d9ae-4c5d-8a5c-defe0e0afb9a	2021-07-13 12:31:37.586348+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	d1652c94-3a20-405b-b578-4da26650989f	36c56f46-7680-4c24-9eed-84fbd17a396f	2021-07-13 14:16:54.045429+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	60974c19-638b-4345-81f8-ec7195b3be09	7a81b16c-a03c-40f7-83de-3355088b9ae1	2021-07-13 15:27:37.971723+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	6c8e4917-369e-4665-aefb-0ff9e808c0f2	1c693bc4-e391-40a5-86a1-259469ae3ae8	2021-07-13 12:31:38.593121+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	50b7fdb5-5067-4cb4-a178-121e4e61cd43	36c56f46-7680-4c24-9eed-84fbd17a396f	2021-07-13 14:16:54.855818+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	d1652c94-3a20-405b-b578-4da26650989f	36c56f46-7680-4c24-9eed-84fbd17a396f	2021-07-13 16:21:35.21956+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	6bdaa572-6d23-417d-8197-fa0872ab8ba5	91831eb8-402b-4455-a421-dcc8d5d772e5	2021-07-14 06:58:25.408968+00
ca652ee1-1423-42fe-a0ef-e5761a670845	d1652c94-3a20-405b-b578-4da26650989f	9be33ef8-25c5-4617-933f-d5e961dafd07	2021-07-13 13:49:43.485432+00
7879f271-4036-48be-befb-f08de052bcdc	add6498d-bbfa-4d87-b3da-ff3115179a0e	9f46ca90-5d75-4635-876e-ecf06bd3077f	2021-08-10 15:22:18.335607+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	60974c19-638b-4345-81f8-ec7195b3be09	7a81b16c-a03c-40f7-83de-3355088b9ae1	2021-07-14 06:59:22.559266+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	82924aaa-5223-4dd1-bbce-65b1f7dd1f37	b0149652-2da7-4f5c-ada9-7dd5bd3b67e7	2021-07-20 14:55:20.494452+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	d1652c94-3a20-405b-b578-4da26650989f	36c56f46-7680-4c24-9eed-84fbd17a396f	2021-07-13 14:32:34.450263+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	d1652c94-3a20-405b-b578-4da26650989f	36c56f46-7680-4c24-9eed-84fbd17a396f	2021-07-13 15:12:06.896177+00
f30de478-b560-47f5-8588-8062ffc64a25	dfbdedcf-3646-4ff7-b094-25cb7c630c24	bb8e3357-6980-4e2f-8e0f-06e384e3076c	2021-07-14 07:25:47.04828+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	aee59dba-2ead-47b1-8d38-334fef5ebade	d11fa1db-1d2c-4232-81cc-29f528ef40f8	2021-08-13 08:23:20.911921+00
f30de478-b560-47f5-8588-8062ffc64a25	8ef2ac54-7d44-4bfd-b897-f88ee920764e	4230fd13-f3b9-4c9b-9137-f0d403e4c60f	2021-08-13 07:56:08.442906+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	fd31d5d0-5e34-494a-9d25-26a77f0019a8	6f1eca7e-5e4e-4f6f-9f7d-07b2ea9d222b	2021-08-06 12:54:30.045611+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	a666d87d-e793-42da-bbda-6305da5851e6	7ec7bd2c-5e16-4303-9227-f1ff1106f81c	2021-07-14 12:17:43.289086+00
f30de478-b560-47f5-8588-8062ffc64a25	6e435fa3-e3f1-48e1-a493-dde16cce43a6	1fce5889-1add-4017-b3aa-d4e07bbeb0d3	2021-07-14 07:25:52.361938+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	8a5afa50-4bb2-4820-89ee-5f3c51f0a65c	198bb30f-9bf5-4a03-b12a-ad1d2153464d	2021-07-14 14:43:38.660855+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	84ae1cf9-da5c-49f5-aa64-bdf5796cf16b	daab2e31-9be6-45c7-9754-654df9b43aa3	2021-07-30 09:23:38.883743+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	8ac1179f-d0ae-4c76-8a3f-ffce22b68723	5ecfeec5-3f0f-487e-abbb-5f4aeda4d57a	2021-07-21 09:18:38.785968+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	5398f1f3-c8c2-4d39-b1d2-b981c57f732a	c1ded02a-9566-44d2-9015-772dc7adf23d	2021-07-14 12:18:02.975045+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	d891bc22-94e7-42b1-96af-b30f2a5efe2c	2bc3df81-d9ae-4c5d-8a5c-defe0e0afb9a	2021-07-14 12:45:13.729919+00
ca652ee1-1423-42fe-a0ef-e5761a670845	fb058431-a63e-42a5-bd84-7de87c21427a	18c580c4-dfc2-4a4c-b38b-ce19ad0d8f8b	2021-07-14 10:47:49.603557+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	282e0cf6-ba9f-48b9-af3f-e2441779a201	05953ed1-302a-4994-a67a-7f7c58dde689	2021-07-14 12:18:06.862117+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	72158001-ba0e-426d-9636-d09bf63efe9d	258b9bc3-3456-4d22-b2cc-dc55145570f2	2021-07-16 04:37:56.305532+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	84d076a1-b88b-4232-8fe4-755f25411d9d	fcdf2627-51d6-4235-b4fd-7a08617ec540	2021-08-02 09:12:39.24782+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	0e98bd99-373d-42e4-9d94-aea273569288	9ff71725-b5cc-4651-ab70-f827e775984b	2021-08-03 13:17:14.189665+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	075df733-01b0-4e48-8953-f655868990b1	846a9e2f-d43c-4e28-9333-c05374b60d7a	2021-08-03 16:05:14.378408+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	72158001-ba0e-426d-9636-d09bf63efe9d	258b9bc3-3456-4d22-b2cc-dc55145570f2	2021-07-14 16:18:19.976187+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	60974c19-638b-4345-81f8-ec7195b3be09	7a81b16c-a03c-40f7-83de-3355088b9ae1	2021-07-19 14:53:22.267581+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	fc45c751-19c6-421e-96e9-a0fe01874f37	9cc6c521-609c-471b-9150-99cebcb81d37	2021-07-19 11:41:51.646921+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	69b94728-fc60-46c6-b9cb-d6485e622725	da33ffc6-f68d-4f2a-8852-5e15c047402d	2021-07-19 09:16:43.514169+00
7a90bccb-346e-4933-aaeb-cdef732be976	dd805776-a22f-4897-891a-46ebc6fb4725	48bc50a5-2527-4787-9180-0d59eb28d879	2021-07-14 18:54:22.791004+00
ca652ee1-1423-42fe-a0ef-e5761a670845	13e1cbea-1c54-4cfb-8a19-f87aab0f72ea	bc099f3b-4d47-460f-88ba-7767f6024b06	2021-08-03 15:13:18.25985+00
ca652ee1-1423-42fe-a0ef-e5761a670845	afda9b41-aa30-4dde-9b3b-781c45133b69	eefce1eb-17a5-4a47-ab53-f9659667678f	2021-08-04 08:17:35.631407+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	d0b8bf8e-dd2e-4e00-84f5-b6c3ca13ea2a	bb62ac7d-66a1-4621-89cc-c31c272d2e01	2021-08-04 10:06:58.219257+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	d3b491f4-684e-4161-bc02-a8a2d8b096af	363a2895-62e9-46ab-889d-ec1e404f1b34	2021-07-23 07:21:05.439116+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	12a4253d-c1aa-4858-a8cd-b5c0ef17d220	32816c6c-966f-4501-b308-118503173965	2021-07-20 13:01:52.683546+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	8ac1179f-d0ae-4c76-8a3f-ffce22b68723	b9572640-734e-4e24-bf6e-c5f5e237976f	2021-07-15 05:47:28.49719+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	bb3e81c0-88ed-4458-8d03-8770ea1a5ec1	a502b704-f8db-4601-9614-d1fa8cf9fcae	2021-07-15 08:51:31.691638+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	bb3e81c0-88ed-4458-8d03-8770ea1a5ec1	a502b704-f8db-4601-9614-d1fa8cf9fcae	2021-07-21 09:19:40.632286+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	ec23d178-0a3a-4eaf-b2de-ef36bf46c235	fba5632d-6893-4ff2-bd5b-45087349ebbc	2021-07-21 14:57:22.634497+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	bb3e81c0-88ed-4458-8d03-8770ea1a5ec1	7b7e4aa0-48e2-4490-8b7a-00358ada475f	2021-07-15 05:48:19.458564+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	fafc97b7-182c-4bd6-87ac-d444592c2c54	71dfb5a6-7cba-4ae2-b796-fe222b363b14	2021-07-27 14:02:28.857731+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	7968122e-e49e-4d59-b1e7-d4e128824615	5207cd77-72d4-42eb-a63b-1c157028b15f	2021-07-23 07:40:40.964828+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	749313b8-ad19-40e1-89bc-63844d9fccec	7dd285c0-48d9-4b51-9b93-5128047a9830	2021-07-15 08:03:10.69283+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	62a36a3c-e335-4022-90ef-d3a5e3615d11	98bbde58-3ed6-4bf7-b5dc-9b1253e9dad4	2021-08-09 14:47:41.771348+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	5d4e1943-67b7-4d68-9baf-3fa7c1df599e	8cd121cc-b932-49de-8511-b59fa5766dc2	2021-08-02 10:17:30.065907+00
7a90bccb-346e-4933-aaeb-cdef732be976	0558025b-be7f-429b-9736-4764a82933f0	99a768f5-6491-4839-bd8e-e4039b937836	2021-08-12 07:33:06.838147+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	164ebb7f-0c05-45d1-a74a-09d46248d2bf	65602b1e-3b7a-4a58-80d1-8335bf9f5cce	2021-07-15 11:59:32.137136+00
7a90bccb-346e-4933-aaeb-cdef732be976	84ae1cf9-da5c-49f5-aa64-bdf5796cf16b	daab2e31-9be6-45c7-9754-654df9b43aa3	2021-07-15 00:01:10.664204+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	f159d13d-55aa-42eb-8653-89486d8ba839	cd1d94c9-cbf5-452c-8af9-bd4add46514d	2021-07-20 14:23:39.540915+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	d3b491f4-684e-4161-bc02-a8a2d8b096af	363a2895-62e9-46ab-889d-ec1e404f1b34	2021-07-23 07:31:59.930962+00
f30de478-b560-47f5-8588-8062ffc64a25	df6b6e91-9e9d-4f59-aa10-58ba5b25f9e0	e3be1bfc-5d2c-4b08-b0b7-a6e391d0c15b	2021-07-20 14:25:05.136282+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	bb3e81c0-88ed-4458-8d03-8770ea1a5ec1	a502b704-f8db-4601-9614-d1fa8cf9fcae	2021-07-15 08:06:44.175778+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	dfbdedcf-3646-4ff7-b094-25cb7c630c24	bb8e3357-6980-4e2f-8e0f-06e384e3076c	2021-07-15 09:38:27.434623+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	34389740-7677-46f3-89d6-76ea52017019	808b5c47-f912-48a8-89d9-82a5da8a55fe	2021-07-21 11:20:15.005787+00
7a90bccb-346e-4933-aaeb-cdef732be976	f49a2562-3073-4a5a-8c77-c2e7a514b63f	33e38b64-688a-4e41-bc30-f66f60da0534	2021-07-20 13:45:26.508228+00
7a90bccb-346e-4933-aaeb-cdef732be976	ec23d178-0a3a-4eaf-b2de-ef36bf46c235	f499af00-927d-438d-9fc0-50813b7f38e9	2021-07-20 12:57:21.978328+00
7a90bccb-346e-4933-aaeb-cdef732be976	235faf89-59ed-4520-8957-38fbd49e2490	7eb738ce-9460-4db8-9284-fa210705c4d1	2021-08-04 09:08:59.23807+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	f49a2562-3073-4a5a-8c77-c2e7a514b63f	38d9a706-5fb8-41f8-937d-1d3129d0553f	2021-07-20 14:03:16.901383+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	df0bcc2f-0459-4b5a-af3f-6bf616b393f3	c10e0ac9-8a5c-4388-bfaf-9054564ae777	2021-07-27 12:34:18.230075+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	6e435fa3-e3f1-48e1-a493-dde16cce43a6	1fce5889-1add-4017-b3aa-d4e07bbeb0d3	2021-07-15 12:10:59.708734+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	1ef10234-ceff-4c57-a295-facbed92592d	8ddc7590-9fce-431f-8f39-19e6d3ee9abf	2021-07-21 16:11:16.608214+00
4d783a5d-2c91-4cc0-89f6-42d0b5d189c8	d7046540-e347-43df-bd08-49e5a13cc30e	4fb18e0c-1012-4601-a72b-de01fbaa9848	2021-08-11 10:55:40.605835+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	f159d13d-55aa-42eb-8653-89486d8ba839	cd1d94c9-cbf5-452c-8af9-bd4add46514d	2021-08-05 11:42:02.699332+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	69b94728-fc60-46c6-b9cb-d6485e622725	da33ffc6-f68d-4f2a-8852-5e15c047402d	2021-07-20 11:59:59.267337+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	8ac1179f-d0ae-4c76-8a3f-ffce22b68723	5ecfeec5-3f0f-487e-abbb-5f4aeda4d57a	2021-07-15 11:05:19.48608+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	9e0612da-7c2d-460b-aa24-b762d4202b88	c48eb244-5ab8-4ce2-9f41-d9b47c059a5a	2021-08-09 08:51:43.637661+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	e0a7b845-b083-4f2c-a93b-38bd9d04df10	c2a5ea37-6af1-404d-9706-9594b11d19ff	2021-08-13 14:32:04.133165+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	85eb2862-060e-42da-b0bb-c70844c3e88d	901d2c8c-652b-4240-8d22-578bf585d156	2021-07-26 06:51:57.989693+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	12aee6ec-e255-4446-b825-23a2dbdedcdd	174aaa1d-72aa-4626-a538-bd8d2b5de5dd	2021-08-05 08:59:49.425293+00
7a90bccb-346e-4933-aaeb-cdef732be976	85eb2862-060e-42da-b0bb-c70844c3e88d	901d2c8c-652b-4240-8d22-578bf585d156	2021-08-02 11:40:52.460502+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	3fd39670-e573-4e14-9623-751ec185e073	308b838d-ddf1-45e9-aadc-e6936b695ded	2021-07-21 15:07:24.533253+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	164ebb7f-0c05-45d1-a74a-09d46248d2bf	65602b1e-3b7a-4a58-80d1-8335bf9f5cce	2021-07-26 06:35:47.517604+00
7a90bccb-346e-4933-aaeb-cdef732be976	d3b491f4-684e-4161-bc02-a8a2d8b096af	363a2895-62e9-46ab-889d-ec1e404f1b34	2021-08-02 11:40:27.308104+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	206b161d-acbf-4844-8946-2fa4981de272	fb3e1392-e2dd-4068-8cd9-cbfc2f670cc0	2021-08-13 07:09:50.346047+00
7879f271-4036-48be-befb-f08de052bcdc	2f38aa46-5517-4c9b-b060-81e3a2864bee	49cd8bf0-e55e-4a87-bfec-2d4dc3fa9b0a	2021-08-15 14:52:13.018906+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	d8d2844e-e84c-4c27-a1d7-c3310afafda0	80bce362-8c08-4ae9-b060-ee4537ec0365	2021-08-13 08:27:08.804461+00
7a90bccb-346e-4933-aaeb-cdef732be976	e0a7b845-b083-4f2c-a93b-38bd9d04df10	c2a5ea37-6af1-404d-9706-9594b11d19ff	2021-08-11 12:29:24.582807+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	527f10e5-ce40-4d9f-9db3-1eda40155817	f9ddda15-bd7a-463c-b0c1-c5268c9fcb0a	2021-08-10 12:13:12.897009+00
ca652ee1-1423-42fe-a0ef-e5761a670845	a61bd1a0-ab6c-4c3d-8ef2-d90dd7b4ceef	ad804eb9-d31d-4311-aeeb-5e46de6e1802	2021-08-09 09:27:09.731571+00
7a90bccb-346e-4933-aaeb-cdef732be976	30337aa3-0269-42d8-9e6e-efac86a1db9e	4a5b9c6b-58fd-42bf-ae18-91d52881bef6	2021-08-11 12:29:57.639246+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	6e435fa3-e3f1-48e1-a493-dde16cce43a6	1fce5889-1add-4017-b3aa-d4e07bbeb0d3	2021-07-26 06:35:30.700377+00
ca652ee1-1423-42fe-a0ef-e5761a670845	235faf89-59ed-4520-8957-38fbd49e2490	7eb738ce-9460-4db8-9284-fa210705c4d1	2021-08-13 08:33:57.10773+00
7a90bccb-346e-4933-aaeb-cdef732be976	62a36a3c-e335-4022-90ef-d3a5e3615d11	98bbde58-3ed6-4bf7-b5dc-9b1253e9dad4	2021-07-23 14:44:01.183087+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	5d4e1943-67b7-4d68-9baf-3fa7c1df599e	8cd121cc-b932-49de-8511-b59fa5766dc2	2021-07-30 14:58:29.342221+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	fafc97b7-182c-4bd6-87ac-d444592c2c54	71dfb5a6-7cba-4ae2-b796-fe222b363b14	2021-08-09 14:44:35.782185+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	0e98bd99-373d-42e4-9d94-aea273569288	9ff71725-b5cc-4651-ab70-f827e775984b	2021-08-03 13:16:33.952081+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	9fa70a66-1e09-4dc4-b5da-4fd46e6f3cb4	3e53926f-1c72-45dd-9c60-017daf996ae2	2021-08-10 06:44:21.93375+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	a61b79aa-6905-47ae-bbf8-4bd1df8ea21a	9acfc11a-0599-4689-801d-f18534d7a121	2021-08-02 14:46:06.649731+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	c5707707-dbec-4b11-87e8-bf0f0cb6bbaa	0415fd19-f96b-48b6-87fc-ebdfc049d1c8	2021-08-13 09:47:14.615186+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	fcc42886-7ae4-4f92-b31a-a90d0df23f6d	e30a2dcf-4d73-4bbf-b235-37210c936ae0	2021-07-26 12:19:27.458537+00
ca652ee1-1423-42fe-a0ef-e5761a670845	b7330847-fe0d-4446-83b1-a989f47a959e	65f814cc-bbe8-40cc-b382-19485fc80501	2021-08-13 08:33:59.051159+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	e0c2d69a-acfd-4080-9bcd-71fbc7f3a182	16a678fd-824e-4821-98b2-bf3210264a5f	2021-08-03 15:12:50.371194+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	560f0651-59d7-4641-ab99-24776dceddc6	bb898ff1-fab9-415e-9de7-f6519f801379	2021-08-04 13:38:14.142339+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	ef11cb56-4eff-45f3-a347-702a914cb9f1	0c659dc9-5925-4a87-bc52-0305e6c79704	2021-07-30 15:27:23.970804+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	ac783c23-e52d-4786-97b1-26224a4de472	0e83f620-4504-476d-81bf-fb8da77d8760	2021-08-02 06:23:01.141638+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	52fba8d8-7964-4248-a182-c72798e80be5	dd86731f-1f8b-47e3-8b1a-da973b40d38f	2021-07-28 10:03:24.774781+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	ac783c23-e52d-4786-97b1-26224a4de472	0e83f620-4504-476d-81bf-fb8da77d8760	2021-07-30 17:48:34.265855+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	30337aa3-0269-42d8-9e6e-efac86a1db9e	bd8eb673-0a6b-428a-8af7-5d936dd16eec	2021-08-13 06:18:47.109383+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	a76e9cee-f598-4b10-a3bf-28de9b5f315e	bcf1e5c8-f21a-4551-bec5-e71e51d1f73b	2021-07-27 09:08:45.281396+00
ca652ee1-1423-42fe-a0ef-e5761a670845	ac783c23-e52d-4786-97b1-26224a4de472	0e83f620-4504-476d-81bf-fb8da77d8760	2021-07-27 14:16:45.918969+00
7a90bccb-346e-4933-aaeb-cdef732be976	1b11054e-5c4d-4add-9e63-e72448846652	4dc49a59-d796-4754-9212-4e08fb38ecc2	2021-08-12 14:16:56.721362+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	880ecb5b-b824-4afe-bcbb-59a968d1d803	60a52e92-06b1-4db0-b3d8-c636654548e2	2021-07-30 15:25:35.875749+00
ca652ee1-1423-42fe-a0ef-e5761a670845	9fa78080-867b-4e01-b60a-6f47b55c4b58	68968fa4-c47e-42a0-921f-78030a945dff	2021-08-10 05:59:29.10637+00
7879f271-4036-48be-befb-f08de052bcdc	52fba8d8-7964-4248-a182-c72798e80be5	dd86731f-1f8b-47e3-8b1a-da973b40d38f	2021-08-11 07:53:04.464955+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	a76e9cee-f598-4b10-a3bf-28de9b5f315e	bcf1e5c8-f21a-4551-bec5-e71e51d1f73b	2021-07-27 08:38:20.793085+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	ac783c23-e52d-4786-97b1-26224a4de472	0e83f620-4504-476d-81bf-fb8da77d8760	2021-08-02 15:01:48.806744+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	b3abd6a4-3434-4550-bc84-f1f452130e64	954a0596-1a33-4800-9a84-d07ea80c66ab	2021-08-03 15:12:45.769825+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	77a17631-b400-4aaf-a4cd-09091e8714b0	95b4cb9a-fdab-469e-bed5-cfcbd15b77ed	2021-08-03 10:26:34.523492+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	5c3e89c7-a099-49af-8c7a-54a70088d97a	cf71265a-7757-4d52-8424-71408935b9d4	2021-08-02 12:26:13.018679+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	30337aa3-0269-42d8-9e6e-efac86a1db9e	4a5b9c6b-58fd-42bf-ae18-91d52881bef6	2021-08-02 12:25:54.143325+00
7a90bccb-346e-4933-aaeb-cdef732be976	ac783c23-e52d-4786-97b1-26224a4de472	0e83f620-4504-476d-81bf-fb8da77d8760	2021-08-02 15:02:06.940982+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	a76e9cee-f598-4b10-a3bf-28de9b5f315e	bcf1e5c8-f21a-4551-bec5-e71e51d1f73b	2021-07-27 14:42:39.753171+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	c1c1d528-b74c-4847-8938-df9771bd02c1	224dffc5-fe29-443c-8a6c-4dd5e9958cfc	2021-08-03 10:27:05.184704+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	a61b79aa-6905-47ae-bbf8-4bd1df8ea21a	9acfc11a-0599-4689-801d-f18534d7a121	2021-07-27 12:07:00.153375+00
7879f271-4036-48be-befb-f08de052bcdc	3a3ff258-367a-4236-b2ba-40b2619108db	df24ccd2-e276-4288-b11c-2bb6af3958f5	2021-08-02 15:48:56.423073+00
7a90bccb-346e-4933-aaeb-cdef732be976	ef11cb56-4eff-45f3-a347-702a914cb9f1	0c659dc9-5925-4a87-bc52-0305e6c79704	2021-08-11 12:29:56.628221+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	199c2d94-5468-46a4-bdef-111304e7d005	4f1c8597-174d-4876-9e4c-91416e74c83b	2021-07-27 10:27:38.189346+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	9a0b5d33-e7ca-4a14-b693-44e988d4cc68	50697ff0-0599-4f57-9996-1dcece7cb503	2021-08-04 10:06:55.806328+00
f30de478-b560-47f5-8588-8062ffc64a25	85eb2862-060e-42da-b0bb-c70844c3e88d	901d2c8c-652b-4240-8d22-578bf585d156	2021-07-27 13:58:55.09832+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	d3a11bcb-6569-4772-a537-cf6f64388932	6ea07720-5a29-419e-8b5d-f45000f67a10	2021-08-02 08:02:05.879093+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	a76e9cee-f598-4b10-a3bf-28de9b5f315e	bcf1e5c8-f21a-4551-bec5-e71e51d1f73b	2021-07-28 09:02:48.112629+00
ca652ee1-1423-42fe-a0ef-e5761a670845	a61b79aa-6905-47ae-bbf8-4bd1df8ea21a	9acfc11a-0599-4689-801d-f18534d7a121	2021-07-28 06:53:02.024256+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	880ecb5b-b824-4afe-bcbb-59a968d1d803	60a52e92-06b1-4db0-b3d8-c636654548e2	2021-07-30 15:25:44.611735+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	d1243295-e6ac-4da5-866f-582a9b419a4f	1d7f98a7-7661-4c6c-a423-50a194196406	2021-08-04 09:05:54.996777+00
7879f271-4036-48be-befb-f08de052bcdc	d3b491f4-684e-4161-bc02-a8a2d8b096af	363a2895-62e9-46ab-889d-ec1e404f1b34	2021-07-27 10:18:00.051999+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	50cc22f8-e1b5-4e97-b005-57794768edae	5df47275-e69a-463a-8850-5a7a51cca633	2021-07-27 12:08:43.707559+00
ca652ee1-1423-42fe-a0ef-e5761a670845	d3b491f4-684e-4161-bc02-a8a2d8b096af	363a2895-62e9-46ab-889d-ec1e404f1b34	2021-07-28 06:53:08.660586+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	ed0cd994-b487-43f9-a7af-3bd5b64830b4	f4529541-0a80-448a-b4d4-9b4bb6c15568	2021-08-02 06:51:26.335747+00
ca652ee1-1423-42fe-a0ef-e5761a670845	106b166b-b521-4776-bc32-4ec500ee7cd2	5f2b9cf9-310e-42d0-a2bd-66cbd4825fad	2021-08-09 06:17:42.899343+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	ac783c23-e52d-4786-97b1-26224a4de472	0e83f620-4504-476d-81bf-fb8da77d8760	2021-08-01 16:07:57.79868+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	52fba8d8-7964-4248-a182-c72798e80be5	dd86731f-1f8b-47e3-8b1a-da973b40d38f	2021-07-27 14:47:26.091495+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	5c3e89c7-a099-49af-8c7a-54a70088d97a	cf71265a-7757-4d52-8424-71408935b9d4	2021-08-03 10:26:59.148563+00
ca652ee1-1423-42fe-a0ef-e5761a670845	055a8d84-dc22-4aad-8d37-adbe9e19545d	a7048445-6393-4b95-8f93-7bd598be71a5	2021-08-10 07:06:15.860644+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	d3a11bcb-6569-4772-a537-cf6f64388932	6ea07720-5a29-419e-8b5d-f45000f67a10	2021-08-02 13:51:08.626088+00
7879f271-4036-48be-befb-f08de052bcdc	a61b79aa-6905-47ae-bbf8-4bd1df8ea21a	9acfc11a-0599-4689-801d-f18534d7a121	2021-07-27 10:18:24.290072+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	a76e9cee-f598-4b10-a3bf-28de9b5f315e	bcf1e5c8-f21a-4551-bec5-e71e51d1f73b	2021-08-01 16:08:09.382802+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	a76e9cee-f598-4b10-a3bf-28de9b5f315e	bcf1e5c8-f21a-4551-bec5-e71e51d1f73b	2021-07-30 15:45:57.141991+00
7a90bccb-346e-4933-aaeb-cdef732be976	a76e9cee-f598-4b10-a3bf-28de9b5f315e	bcf1e5c8-f21a-4551-bec5-e71e51d1f73b	2021-07-27 13:35:53.113079+00
f30de478-b560-47f5-8588-8062ffc64a25	ac783c23-e52d-4786-97b1-26224a4de472	0e83f620-4504-476d-81bf-fb8da77d8760	2021-07-27 14:15:31.869438+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	6a3cae7c-a380-4fc7-beb5-5660e516d8f6	689d7c3b-456e-449d-a5b4-261e88519078	2021-07-30 08:02:40.213543+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	c5707707-dbec-4b11-87e8-bf0f0cb6bbaa	0415fd19-f96b-48b6-87fc-ebdfc049d1c8	2021-08-01 12:11:02.677112+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	c5707707-dbec-4b11-87e8-bf0f0cb6bbaa	0415fd19-f96b-48b6-87fc-ebdfc049d1c8	2021-08-02 12:26:15.674824+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	77a17631-b400-4aaf-a4cd-09091e8714b0	da69d1bb-79f9-46a9-85c1-8165d7ad1a8e	2021-07-27 10:41:09.345463+00
ca652ee1-1423-42fe-a0ef-e5761a670845	a76e9cee-f598-4b10-a3bf-28de9b5f315e	bcf1e5c8-f21a-4551-bec5-e71e51d1f73b	2021-07-27 14:18:12.18072+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	62a36a3c-e335-4022-90ef-d3a5e3615d11	98bbde58-3ed6-4bf7-b5dc-9b1253e9dad4	2021-07-27 14:02:41.816711+00
f30de478-b560-47f5-8588-8062ffc64a25	a76e9cee-f598-4b10-a3bf-28de9b5f315e	bcf1e5c8-f21a-4551-bec5-e71e51d1f73b	2021-07-27 14:15:36.219413+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	19eda0fd-71e8-49fd-9847-d2b9d8466527	07bcb362-cb64-4029-9f0b-d6516dee551c	2021-07-27 12:34:23.872584+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	c1c1d528-b74c-4847-8938-df9771bd02c1	224dffc5-fe29-443c-8a6c-4dd5e9958cfc	2021-08-04 09:23:49.419293+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	ed0cd994-b487-43f9-a7af-3bd5b64830b4	f4529541-0a80-448a-b4d4-9b4bb6c15568	2021-08-04 09:01:19.357744+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	52fba8d8-7964-4248-a182-c72798e80be5	dd86731f-1f8b-47e3-8b1a-da973b40d38f	2021-08-10 13:00:59.106374+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	ef11cb56-4eff-45f3-a347-702a914cb9f1	0c659dc9-5925-4a87-bc52-0305e6c79704	2021-08-03 10:27:18.192999+00
f30de478-b560-47f5-8588-8062ffc64a25	a61b79aa-6905-47ae-bbf8-4bd1df8ea21a	9acfc11a-0599-4689-801d-f18534d7a121	2021-07-27 13:52:24.211181+00
7a90bccb-346e-4933-aaeb-cdef732be976	9a0b5d33-e7ca-4a14-b693-44e988d4cc68	50697ff0-0599-4f57-9996-1dcece7cb503	2021-08-03 10:36:35.908297+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	7d4b2466-c340-4bb6-91d1-72f931cec5dc	26ad4d07-daed-4696-a729-95c2774a6848	2021-08-01 19:01:03.786421+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	ac783c23-e52d-4786-97b1-26224a4de472	0e83f620-4504-476d-81bf-fb8da77d8760	2021-08-02 13:40:00.304266+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	3a3ff258-367a-4236-b2ba-40b2619108db	f860c8dd-effc-4191-b6fa-dd84a769e220	2021-07-28 10:03:36.32076+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	f22e69ce-7082-4cb9-a4ce-e6cf8e71d2fc	225b9dc9-4a49-425b-930c-799e823d1b20	2021-08-03 11:39:41.448473+00
ca652ee1-1423-42fe-a0ef-e5761a670845	85eb2862-060e-42da-b0bb-c70844c3e88d	901d2c8c-652b-4240-8d22-578bf585d156	2021-07-28 06:53:23.40345+00
ca652ee1-1423-42fe-a0ef-e5761a670845	12aee6ec-e255-4446-b825-23a2dbdedcdd	c1be8837-8f97-405a-be74-e3d1b060317b	2021-08-13 07:41:47.728246+00
7a90bccb-346e-4933-aaeb-cdef732be976	a61bd1a0-ab6c-4c3d-8ef2-d90dd7b4ceef	ad804eb9-d31d-4311-aeeb-5e46de6e1802	2021-08-09 11:28:24.41595+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	106b166b-b521-4776-bc32-4ec500ee7cd2	5f2b9cf9-310e-42d0-a2bd-66cbd4825fad	2021-08-04 19:02:11.73567+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	12aee6ec-e255-4446-b825-23a2dbdedcdd	c1be8837-8f97-405a-be74-e3d1b060317b	2021-08-13 08:28:23.737983+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	69e20f79-d685-4bf8-b21a-73dbbef108e2	3fbc70f0-c56f-40f9-886b-af0d4a7759fc	2021-08-04 06:35:37.001511+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	6c291865-999e-4a1d-9588-5ad93cedbbf5	8d9baf3b-8190-49f1-8c53-854fc751ade6	2021-08-13 07:00:57.24891+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	6a3cae7c-a380-4fc7-beb5-5660e516d8f6	689d7c3b-456e-449d-a5b4-261e88519078	2021-07-28 10:33:25.025682+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	ac783c23-e52d-4786-97b1-26224a4de472	0e83f620-4504-476d-81bf-fb8da77d8760	2021-07-30 15:46:57.612287+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	f22e69ce-7082-4cb9-a4ce-e6cf8e71d2fc	225b9dc9-4a49-425b-930c-799e823d1b20	2021-07-29 12:14:20.560838+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	106b166b-b521-4776-bc32-4ec500ee7cd2	5f2b9cf9-310e-42d0-a2bd-66cbd4825fad	2021-08-11 11:34:30.903105+00
7a90bccb-346e-4933-aaeb-cdef732be976	12aee6ec-e255-4446-b825-23a2dbdedcdd	cb110e5f-ecee-4949-b633-0eea3fcfc511	2021-08-09 13:31:41.732425+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	d3a11bcb-6569-4772-a537-cf6f64388932	a0db7127-4460-40d5-97e7-d30ee9016e9d	2021-07-29 13:53:08.356583+00
ca652ee1-1423-42fe-a0ef-e5761a670845	8b62b6ad-fe39-40aa-b8b5-44284657b286	2075babd-77fa-4644-943d-2c1f9eb9e39c	2021-08-12 09:59:34.935903+00
7879f271-4036-48be-befb-f08de052bcdc	3a2032b1-8190-47b2-84d6-28998118838d	763a6c67-a61f-4d3c-8272-d4cfb168f8c1	2021-08-15 14:52:07.549347+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	5402f67d-3e1f-46df-a5de-71d8f162e9c6	87aa0a8f-0a0e-4599-9e09-e78b14a334da	2021-08-11 08:17:53.356116+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	6a3cae7c-a380-4fc7-beb5-5660e516d8f6	9149d74d-8872-4d96-af64-523a13802cc0	2021-07-28 10:27:36.948102+00
ca652ee1-1423-42fe-a0ef-e5761a670845	ed0cd994-b487-43f9-a7af-3bd5b64830b4	f4529541-0a80-448a-b4d4-9b4bb6c15568	2021-07-28 13:51:18.715804+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	a442e7be-2447-493d-9403-78b4969d569c	bb488432-e80f-4c1d-b2e4-097ec108335c	2021-08-13 08:24:21.171932+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	f22e69ce-7082-4cb9-a4ce-e6cf8e71d2fc	225b9dc9-4a49-425b-930c-799e823d1b20	2021-07-29 09:43:49.091481+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	d346172f-a1b2-48f4-b1e1-ea65bfbfaa6c	c3234c77-2ca5-423e-8918-3a286d15ce53	2021-07-28 15:13:13.402188+00
7a90bccb-346e-4933-aaeb-cdef732be976	ed320f20-c3c0-4ffa-9943-37df7eaa5ea8	db64ae10-1444-40c0-89bc-0eb434f484e4	2021-07-29 18:50:31.979699+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	9a0b5d33-e7ca-4a14-b693-44e988d4cc68	50697ff0-0599-4f57-9996-1dcece7cb503	2021-08-08 20:41:40.554614+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	63a7e4fb-03c6-4a8b-9581-063725d3faa5	637e69c9-6756-4b71-9d11-8b1985d1ebf9	2021-08-03 10:20:31.290733+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	7d4b2466-c340-4bb6-91d1-72f931cec5dc	26ad4d07-daed-4696-a729-95c2774a6848	2021-07-29 14:00:24.342941+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	e1e350f2-0a06-4d93-93f4-e5ff082a3888	eb9c4920-48f2-4a85-abee-d65880de6c58	2021-08-04 19:02:35.729961+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	25383b6c-859b-4656-8a24-da4d3110ec97	74b66224-3e40-4c0e-b092-275db0826ef9	2021-08-11 07:19:29.225261+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	25383b6c-859b-4656-8a24-da4d3110ec97	74b66224-3e40-4c0e-b092-275db0826ef9	2021-08-11 12:44:18.820316+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	aee59dba-2ead-47b1-8d38-334fef5ebade	d11fa1db-1d2c-4232-81cc-29f528ef40f8	2021-08-03 10:20:01.658058+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	534402d8-8489-44c8-baa4-eb1608ed0df9	5fb26bc1-2e31-456c-8f51-674a6b285ef3	2021-08-04 10:06:30.905955+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	940314a3-c49c-460c-ba31-7dd36450fd1c	ddd4b267-c803-4bad-9317-428afca9f3b0	2021-08-04 14:10:51.612225+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	950ad578-3e05-4e73-aed4-25a21b5393ac	3578dfe7-b063-4b89-8575-890f3e409292	2021-08-11 09:22:44.775479+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	527f10e5-ce40-4d9f-9db3-1eda40155817	f9ddda15-bd7a-463c-b0c1-c5268c9fcb0a	2021-08-10 06:41:00.12886+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	7d401447-9caf-4713-812c-f1072d277d5c	ad8a95e0-506d-4b12-8daf-bc47889ff6c2	2021-08-11 09:00:31.323293+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	527f10e5-ce40-4d9f-9db3-1eda40155817	f9ddda15-bd7a-463c-b0c1-c5268c9fcb0a	2021-08-11 08:53:16.571518+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	63a7e4fb-03c6-4a8b-9581-063725d3faa5	0e65e8ae-3102-45d2-b031-a0f4556770dc	2021-07-28 16:08:22.312434+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	d3b9a5c5-04dd-4875-8440-b5726b3bb231	cb1f3e61-3699-4e82-8122-6621f38c1e53	2021-07-28 16:08:24.549463+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	aee59dba-2ead-47b1-8d38-334fef5ebade	d11fa1db-1d2c-4232-81cc-29f528ef40f8	2021-08-11 08:53:03.270911+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	3339f5b6-bf9d-4e8c-a4b0-91a660ff93a5	d4560110-bb22-4cce-8ea7-a6ce07732ed7	2021-08-02 13:45:57.14881+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	e0a7b845-b083-4f2c-a93b-38bd9d04df10	c2a5ea37-6af1-404d-9706-9594b11d19ff	2021-08-12 09:09:08.301913+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	e1e350f2-0a06-4d93-93f4-e5ff082a3888	eb9c4920-48f2-4a85-abee-d65880de6c58	2021-08-11 11:46:52.20741+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	aee59dba-2ead-47b1-8d38-334fef5ebade	d11fa1db-1d2c-4232-81cc-29f528ef40f8	2021-08-11 09:22:34.537227+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	950ad578-3e05-4e73-aed4-25a21b5393ac	3578dfe7-b063-4b89-8575-890f3e409292	2021-08-13 10:53:46.890635+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	12aee6ec-e255-4446-b825-23a2dbdedcdd	c1be8837-8f97-405a-be74-e3d1b060317b	2021-08-12 09:50:34.466213+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	9a0b5d33-e7ca-4a14-b693-44e988d4cc68	50697ff0-0599-4f57-9996-1dcece7cb503	2021-08-11 12:51:06.484903+00
7a90bccb-346e-4933-aaeb-cdef732be976	534402d8-8489-44c8-baa4-eb1608ed0df9	5fb26bc1-2e31-456c-8f51-674a6b285ef3	2021-07-29 18:51:05.023255+00
7879f271-4036-48be-befb-f08de052bcdc	9fa78080-867b-4e01-b60a-6f47b55c4b58	055d299c-3cbd-46ed-bb53-daa2ca8bf69c	2021-08-15 14:52:08.66385+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	dc61a442-bafe-4280-bc7e-2a068321a6e0	7b7d0b28-0b26-4b87-a8f8-c01b72c68764	2021-08-03 15:00:41.781966+00
ca652ee1-1423-42fe-a0ef-e5761a670845	d346172f-a1b2-48f4-b1e1-ea65bfbfaa6c	c3234c77-2ca5-423e-8918-3a286d15ce53	2021-07-29 07:43:24.092072+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	8e7acfee-cfe9-4ec0-a9b8-14aae24e0fa9	766a653a-108a-4d3b-8138-e5392f3653e9	2021-07-29 14:13:03.665224+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	534402d8-8489-44c8-baa4-eb1608ed0df9	5fb26bc1-2e31-456c-8f51-674a6b285ef3	2021-07-30 08:01:14.141151+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	69e20f79-d685-4bf8-b21a-73dbbef108e2	3fbc70f0-c56f-40f9-886b-af0d4a7759fc	2021-07-29 07:29:33.362478+00
7a90bccb-346e-4933-aaeb-cdef732be976	b7330847-fe0d-4446-83b1-a989f47a959e	65f814cc-bbe8-40cc-b382-19485fc80501	2021-08-11 15:41:40.960938+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	d346172f-a1b2-48f4-b1e1-ea65bfbfaa6c	c3234c77-2ca5-423e-8918-3a286d15ce53	2021-07-29 09:53:57.575124+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	c9082d89-1383-4f85-9a06-b3e2a518eaf5	ade99b60-bc15-45cb-9899-4ee4819d5cf7	2021-08-13 12:59:37.845789+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	d3b9a5c5-04dd-4875-8440-b5726b3bb231	ebcd6f4b-87f6-4d4c-bd11-37a9ca334590	2021-08-03 10:20:40.043152+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	880ecb5b-b824-4afe-bcbb-59a968d1d803	60a52e92-06b1-4db0-b3d8-c636654548e2	2021-07-29 14:04:28.051312+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	534402d8-8489-44c8-baa4-eb1608ed0df9	5fb26bc1-2e31-456c-8f51-674a6b285ef3	2021-07-30 10:58:18.504182+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	065f3700-82a7-4025-bb40-c5362b53f3ba	361ef2f7-185b-4d85-87ab-003e7042175f	2021-08-03 13:16:49.827666+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	52fba8d8-7964-4248-a182-c72798e80be5	dd86731f-1f8b-47e3-8b1a-da973b40d38f	2021-08-03 10:56:17.687153+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	dc61a442-bafe-4280-bc7e-2a068321a6e0	7b7d0b28-0b26-4b87-a8f8-c01b72c68764	2021-08-04 14:16:36.47824+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	afda9b41-aa30-4dde-9b3b-781c45133b69	eefce1eb-17a5-4a47-ab53-f9659667678f	2021-08-03 10:45:55.550072+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	ef11cb56-4eff-45f3-a347-702a914cb9f1	0c659dc9-5925-4a87-bc52-0305e6c79704	2021-08-12 10:03:49.191563+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	32db5328-d846-44c4-867f-e81359e947e2	f465c2bc-d907-47ce-8c4f-f1308675bb74	2021-08-11 12:51:08.495873+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	dab455dc-a825-4287-816a-29310bd8c38f	aed02ba8-4855-49ea-9d0e-646904ce5d5e	2021-08-13 08:23:39.136703+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	8318452f-09bc-48ae-b89b-6c479ff3ce34	42765fd4-2d60-48f6-bf4a-6da85851d6e1	2021-08-13 08:06:34.376074+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	80439d52-b5f8-40d3-af3f-7947802431a3	421e4d37-7830-47d9-b417-d9c93876866d	2021-08-11 10:11:54.55982+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	950ad578-3e05-4e73-aed4-25a21b5393ac	3578dfe7-b063-4b89-8575-890f3e409292	2021-08-04 09:05:50.11847+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	aee59dba-2ead-47b1-8d38-334fef5ebade	d11fa1db-1d2c-4232-81cc-29f528ef40f8	2021-08-11 12:58:46.976488+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	50cc22f8-e1b5-4e97-b005-57794768edae	5df47275-e69a-463a-8850-5a7a51cca633	2021-07-30 08:02:31.798784+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	40464e44-d5df-48cb-b862-5a9b5d4ffa11	f2689615-7043-4f29-a4e7-a741aaec3f9e	2021-08-13 08:23:53.396887+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	63a7e4fb-03c6-4a8b-9581-063725d3faa5	637e69c9-6756-4b71-9d11-8b1985d1ebf9	2021-08-11 12:43:53.981791+00
7879f271-4036-48be-befb-f08de052bcdc	a61bd1a0-ab6c-4c3d-8ef2-d90dd7b4ceef	ad804eb9-d31d-4311-aeeb-5e46de6e1802	2021-08-11 16:41:44.613262+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	d86f2de5-853a-435a-ac57-dfc200e6a846	dc9029ba-80c2-46e2-a174-cda085fda710	2021-08-12 07:31:32.115635+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	d3a11bcb-6569-4772-a537-cf6f64388932	d6c48553-c35f-4e35-a112-9a3aa3dd47f6	2021-08-01 12:10:04.925753+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	d3a11bcb-6569-4772-a537-cf6f64388932	6ea07720-5a29-419e-8b5d-f45000f67a10	2021-08-02 14:36:12.911575+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	807d7448-0f1f-435f-880a-66ff98f39d2a	d70421ef-f38a-4d50-afae-cdf6e5b83ae0	2021-07-30 17:50:20.727694+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	25383b6c-859b-4656-8a24-da4d3110ec97	74b66224-3e40-4c0e-b092-275db0826ef9	2021-08-03 15:09:03.412549+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	13e1cbea-1c54-4cfb-8a19-f87aab0f72ea	bc099f3b-4d47-460f-88ba-7767f6024b06	2021-08-03 15:00:41.294426+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	6bba30f9-e03a-447f-b883-32b548f2df98	49da6ac8-383f-4c2b-9071-78dd496030c6	2021-08-05 07:45:05.813726+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	807d7448-0f1f-435f-880a-66ff98f39d2a	d70421ef-f38a-4d50-afae-cdf6e5b83ae0	2021-08-02 09:53:40.637438+00
f30de478-b560-47f5-8588-8062ffc64a25	90430aff-6410-494f-ad50-94aaf8eb0292	d13ea718-f27e-48a8-8665-8737e1ca3e3b	2021-08-04 12:18:50.421741+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	3a3ff258-367a-4236-b2ba-40b2619108db	df24ccd2-e276-4288-b11c-2bb6af3958f5	2021-08-05 09:25:22.305364+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	dc28716e-8807-4f93-b3f8-278fe40e280a	ae8c71bb-df84-42de-a332-9d1244ed22f5	2021-08-09 08:51:30.549438+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	1596717f-6516-4270-9d63-36cdf11a3427	6c515388-5d55-4741-aaff-d788d17ea43e	2021-08-02 08:22:26.439395+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	24a10f8e-2a51-48ec-ba9a-a756a822ce6e	491fdbc8-606d-4b9d-829b-20e7083cc548	2021-08-09 12:02:49.259415+00
f30de478-b560-47f5-8588-8062ffc64a25	dc28716e-8807-4f93-b3f8-278fe40e280a	ae8c71bb-df84-42de-a332-9d1244ed22f5	2021-08-03 09:39:45.401889+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	bf3664b6-87c1-4932-9b2f-5cc5178c5fa0	2cd2b36c-904d-4c01-b1a6-8eb9ab318c6a	2021-08-09 13:35:13.182234+00
f30de478-b560-47f5-8588-8062ffc64a25	c9082d89-1383-4f85-9a06-b3e2a518eaf5	ade99b60-bc15-45cb-9899-4ee4819d5cf7	2021-08-13 15:41:52.958693+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	3a3ff258-367a-4236-b2ba-40b2619108db	df24ccd2-e276-4288-b11c-2bb6af3958f5	2021-08-03 10:57:07.521168+00
7879f271-4036-48be-befb-f08de052bcdc	a666d87d-e793-42da-bbda-6305da5851e6	7ec7bd2c-5e16-4303-9227-f1ff1106f81c	2021-08-02 06:57:33.205761+00
7879f271-4036-48be-befb-f08de052bcdc	8a5afa50-4bb2-4820-89ee-5f3c51f0a65c	198bb30f-9bf5-4a03-b12a-ad1d2153464d	2021-08-02 06:57:41.024298+00
7879f271-4036-48be-befb-f08de052bcdc	5398f1f3-c8c2-4d39-b1d2-b981c57f732a	c1ded02a-9566-44d2-9015-772dc7adf23d	2021-08-02 06:57:42.126497+00
7879f271-4036-48be-befb-f08de052bcdc	282e0cf6-ba9f-48b9-af3f-e2441779a201	05953ed1-302a-4994-a67a-7f7c58dde689	2021-08-02 06:57:43.406006+00
7879f271-4036-48be-befb-f08de052bcdc	fb058431-a63e-42a5-bd84-7de87c21427a	18c580c4-dfc2-4a4c-b38b-ce19ad0d8f8b	2021-08-02 06:57:49.935693+00
7879f271-4036-48be-befb-f08de052bcdc	6e435fa3-e3f1-48e1-a493-dde16cce43a6	1fce5889-1add-4017-b3aa-d4e07bbeb0d3	2021-08-02 06:57:53.058512+00
7879f271-4036-48be-befb-f08de052bcdc	dfbdedcf-3646-4ff7-b094-25cb7c630c24	bb8e3357-6980-4e2f-8e0f-06e384e3076c	2021-08-02 06:57:55.178733+00
7879f271-4036-48be-befb-f08de052bcdc	164ebb7f-0c05-45d1-a74a-09d46248d2bf	65602b1e-3b7a-4a58-80d1-8335bf9f5cce	2021-08-02 06:57:57.301219+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	795d9351-a097-48a7-9c5a-7a0409341af4	42519d93-decc-4f6e-bfc7-b16922e00c34	2021-08-11 10:13:23.109222+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	aa52c52f-fddc-45a4-945a-ed73947d74c9	fb3fe25b-7d81-43f8-96e6-0f68a87f722a	2021-08-11 08:17:54.349715+00
7879f271-4036-48be-befb-f08de052bcdc	e32c539a-adc3-4ec9-bf15-2d3311a1be29	29a32ba9-a09a-461d-95a8-171298438eb3	2021-08-02 11:38:58.662569+00
7a90bccb-346e-4933-aaeb-cdef732be976	1eeb42bc-106a-4487-bf2f-b78f948cddae	a210b0f1-5d55-45b6-98c0-949a90a8e741	2021-08-02 11:42:23.822985+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	807d7448-0f1f-435f-880a-66ff98f39d2a	d70421ef-f38a-4d50-afae-cdf6e5b83ae0	2021-08-01 19:01:22.792846+00
7879f271-4036-48be-befb-f08de052bcdc	12aee6ec-e255-4446-b825-23a2dbdedcdd	c1be8837-8f97-405a-be74-e3d1b060317b	2021-08-12 09:40:13.93352+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	9b5f2c7c-4df1-48e6-89c1-1ae2d23e57c6	6f5797cf-74d5-4a3d-8126-4c45dbb6eae7	2021-08-02 14:07:08.255002+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	e32c539a-adc3-4ec9-bf15-2d3311a1be29	29a32ba9-a09a-461d-95a8-171298438eb3	2021-08-03 10:56:34.795824+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	375b6658-2684-4295-83c8-09c5d062749d	2c960600-f1d9-47f6-81ef-ef3593fc5ea5	2021-08-13 12:59:27.24738+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	9b5f2c7c-4df1-48e6-89c1-1ae2d23e57c6	6f5797cf-74d5-4a3d-8126-4c45dbb6eae7	2021-08-02 09:42:37.586462+00
7879f271-4036-48be-befb-f08de052bcdc	3c9e5c02-47a1-47b0-95cf-cf2e6f7db188	6508e6bc-2ad8-4ccf-af76-c527cec90c12	2021-08-02 10:08:20.826848+00
f30de478-b560-47f5-8588-8062ffc64a25	0e98bd99-373d-42e4-9d94-aea273569288	9ff71725-b5cc-4651-ab70-f827e775984b	2021-08-03 14:54:21.230303+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	3c9e5c02-47a1-47b0-95cf-cf2e6f7db188	6508e6bc-2ad8-4ccf-af76-c527cec90c12	2021-08-03 10:57:09.814+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	16571812-9e72-46d0-8568-cf402abd1f5e	0a66a977-a400-4070-896c-652b1652f581	2021-08-13 09:53:33.153594+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	24a10f8e-2a51-48ec-ba9a-a756a822ce6e	4b3ecb10-7823-41da-bd20-9a96e8669160	2021-08-02 13:45:00.229743+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	9b5f2c7c-4df1-48e6-89c1-1ae2d23e57c6	6f5797cf-74d5-4a3d-8126-4c45dbb6eae7	2021-08-02 15:00:41.588624+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	9b5f2c7c-4df1-48e6-89c1-1ae2d23e57c6	6f5797cf-74d5-4a3d-8126-4c45dbb6eae7	2021-08-02 15:01:28.96157+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	dc28716e-8807-4f93-b3f8-278fe40e280a	ae8c71bb-df84-42de-a332-9d1244ed22f5	2021-08-02 16:56:17.886823+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	dc28716e-8807-4f93-b3f8-278fe40e280a	ae8c71bb-df84-42de-a332-9d1244ed22f5	2021-08-03 09:34:18.305844+00
7a90bccb-346e-4933-aaeb-cdef732be976	3c9e5c02-47a1-47b0-95cf-cf2e6f7db188	6508e6bc-2ad8-4ccf-af76-c527cec90c12	2021-08-02 11:19:27.248407+00
7a90bccb-346e-4933-aaeb-cdef732be976	3a3ff258-367a-4236-b2ba-40b2619108db	df24ccd2-e276-4288-b11c-2bb6af3958f5	2021-08-02 11:17:35.01441+00
7a90bccb-346e-4933-aaeb-cdef732be976	8a5afa50-4bb2-4820-89ee-5f3c51f0a65c	198bb30f-9bf5-4a03-b12a-ad1d2153464d	2021-08-02 11:16:44.516724+00
7879f271-4036-48be-befb-f08de052bcdc	c761769d-faa6-4e2d-8e90-cffde5b87084	718f05bb-8e8c-46ee-90c3-2f3b8327c773	2021-08-02 13:25:24.05781+00
7a90bccb-346e-4933-aaeb-cdef732be976	e32c539a-adc3-4ec9-bf15-2d3311a1be29	29a32ba9-a09a-461d-95a8-171298438eb3	2021-08-02 11:19:57.505781+00
7879f271-4036-48be-befb-f08de052bcdc	13e1cbea-1c54-4cfb-8a19-f87aab0f72ea	bc099f3b-4d47-460f-88ba-7767f6024b06	2021-08-03 14:04:09.734754+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	0e98bd99-373d-42e4-9d94-aea273569288	9ff71725-b5cc-4651-ab70-f827e775984b	2021-08-03 13:18:50.496862+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	0ac27c5b-fa0a-4079-aa7a-5f76d332081d	c8acac9d-b341-4d4f-9183-5d6e448d7f65	2021-08-03 16:32:00.084978+00
f30de478-b560-47f5-8588-8062ffc64a25	12aee6ec-e255-4446-b825-23a2dbdedcdd	c1be8837-8f97-405a-be74-e3d1b060317b	2021-08-12 10:04:37.889157+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	b3abd6a4-3434-4550-bc84-f1f452130e64	954a0596-1a33-4800-9a84-d07ea80c66ab	2021-08-03 15:29:29.009237+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	dc28716e-8807-4f93-b3f8-278fe40e280a	ae8c71bb-df84-42de-a332-9d1244ed22f5	2021-08-03 15:12:46.135434+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	b3abd6a4-3434-4550-bc84-f1f452130e64	954a0596-1a33-4800-9a84-d07ea80c66ab	2021-08-05 09:28:11.245496+00
7879f271-4036-48be-befb-f08de052bcdc	8318452f-09bc-48ae-b89b-6c479ff3ce34	42765fd4-2d60-48f6-bf4a-6da85851d6e1	2021-08-10 08:37:19.876741+00
ca652ee1-1423-42fe-a0ef-e5761a670845	59ebd84d-6382-43e3-b5ed-d5f6ef582f2c	ab97f489-60a1-4886-90bd-e671ec2ce7b1	2021-08-10 12:17:39.541859+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	c9d1165c-a8f3-496d-8825-74c1cf81684e	66afc351-67fb-459f-b76f-d0e635984579	2021-08-11 15:03:08.299552+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	d8d2844e-e84c-4c27-a1d7-c3310afafda0	b0c5a4b5-8b7e-4afd-a697-cb05015d94ab	2021-08-09 09:41:51.523889+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	880ecb5b-b824-4afe-bcbb-59a968d1d803	60a52e92-06b1-4db0-b3d8-c636654548e2	2021-08-02 12:25:51.239015+00
7879f271-4036-48be-befb-f08de052bcdc	ed320f20-c3c0-4ffa-9943-37df7eaa5ea8	db64ae10-1444-40c0-89bc-0eb434f484e4	2021-08-02 13:25:42.443395+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	c1c1d528-b74c-4847-8938-df9771bd02c1	224dffc5-fe29-443c-8a6c-4dd5e9958cfc	2021-08-02 12:25:59.92911+00
7879f271-4036-48be-befb-f08de052bcdc	a73e3d2e-2e84-4b85-8ade-7d8446010c86	c3e4aec1-a0a2-49ef-a9e8-bba1b199dfbd	2021-08-02 13:25:45.532605+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	25383b6c-859b-4656-8a24-da4d3110ec97	74b66224-3e40-4c0e-b092-275db0826ef9	2021-08-02 12:43:50.831348+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	63a7e4fb-03c6-4a8b-9581-063725d3faa5	637e69c9-6756-4b71-9d11-8b1985d1ebf9	2021-08-11 09:22:22.405537+00
7879f271-4036-48be-befb-f08de052bcdc	87b6097f-6232-43f6-a3a8-0e1c3104212d	9f37bd8c-44be-4d4d-a48d-5f573f7f7909	2021-08-11 21:42:09.693562+00
7a90bccb-346e-4933-aaeb-cdef732be976	afda9b41-aa30-4dde-9b3b-781c45133b69	eefce1eb-17a5-4a47-ab53-f9659667678f	2021-08-04 08:47:26.31899+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	065f3700-82a7-4025-bb40-c5362b53f3ba	361ef2f7-185b-4d85-87ab-003e7042175f	2021-08-03 15:29:30.615231+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	25383b6c-859b-4656-8a24-da4d3110ec97	74b66224-3e40-4c0e-b092-275db0826ef9	2021-08-03 10:22:01.654706+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	e1e350f2-0a06-4d93-93f4-e5ff082a3888	eb9c4920-48f2-4a85-abee-d65880de6c58	2021-08-04 15:15:22.103731+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	dc61a442-bafe-4280-bc7e-2a068321a6e0	7b7d0b28-0b26-4b87-a8f8-c01b72c68764	2021-08-02 11:47:49.476741+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	0cef7d91-df40-49f1-b9ea-be7b1457d560	60864d36-8cc8-4b52-bad1-486180b44f8e	2021-08-03 15:13:10.130315+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	065f3700-82a7-4025-bb40-c5362b53f3ba	361ef2f7-185b-4d85-87ab-003e7042175f	2021-08-03 13:21:20.626132+00
7a90bccb-346e-4933-aaeb-cdef732be976	69e20f79-d685-4bf8-b21a-73dbbef108e2	3fbc70f0-c56f-40f9-886b-af0d4a7759fc	2021-08-02 15:01:36.779287+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	aff449b5-f49f-4417-8258-8a671518962e	4d729ab4-9a6d-44eb-909d-363564cf4f71	2021-08-05 11:47:22.811946+00
7a90bccb-346e-4933-aaeb-cdef732be976	106b166b-b521-4776-bc32-4ec500ee7cd2	cc9a964c-2fd5-46a8-aa21-b59b1bda7bf3	2021-08-02 15:01:41.228514+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	21870c63-93c0-4ec3-841e-bd813ae079d4	f3b8cd18-a5f7-43b3-8a86-aacc044b01c9	2021-08-03 08:18:57.843518+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	b3abd6a4-3434-4550-bc84-f1f452130e64	954a0596-1a33-4800-9a84-d07ea80c66ab	2021-08-03 13:21:26.50277+00
f30de478-b560-47f5-8588-8062ffc64a25	e0c2d69a-acfd-4080-9bcd-71fbc7f3a182	16a678fd-824e-4821-98b2-bf3210264a5f	2021-08-03 15:18:52.960409+00
7a90bccb-346e-4933-aaeb-cdef732be976	950ad578-3e05-4e73-aed4-25a21b5393ac	3578dfe7-b063-4b89-8575-890f3e409292	2021-08-02 15:01:44.615493+00
7a90bccb-346e-4933-aaeb-cdef732be976	61659450-ba26-43cf-bc54-dbdeee7a39c8	3e88d2aa-b217-48b2-9447-676ad71e7995	2021-08-04 15:07:02.252668+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	32db5328-d846-44c4-867f-e81359e947e2	f465c2bc-d907-47ce-8c4f-f1308675bb74	2021-08-04 10:14:16.823713+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	21870c63-93c0-4ec3-841e-bd813ae079d4	f3b8cd18-a5f7-43b3-8a86-aacc044b01c9	2021-08-02 15:00:13.307101+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	d3b9a5c5-04dd-4875-8440-b5726b3bb231	ebcd6f4b-87f6-4d4c-bd11-37a9ca334590	2021-08-02 12:29:48.025201+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	0cef7d91-df40-49f1-b9ea-be7b1457d560	60864d36-8cc8-4b52-bad1-486180b44f8e	2021-08-02 14:50:48.50109+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	940314a3-c49c-460c-ba31-7dd36450fd1c	ddd4b267-c803-4bad-9317-428afca9f3b0	2021-08-11 19:31:57.10648+00
31f1de58-af98-4946-997c-622cb20d9504	9fa70a66-1e09-4dc4-b5da-4fd46e6f3cb4	3e53926f-1c72-45dd-9c60-017daf996ae2	2021-08-11 13:19:32.7723+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	60b8e726-b97c-4f77-95bb-2702f8dcc216	84c6c327-f96a-4f92-bad7-3f84652a86e3	2021-08-02 17:37:29.653255+00
7879f271-4036-48be-befb-f08de052bcdc	61659450-ba26-43cf-bc54-dbdeee7a39c8	3e88d2aa-b217-48b2-9447-676ad71e7995	2021-08-04 08:59:48.191082+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	60b8e726-b97c-4f77-95bb-2702f8dcc216	84c6c327-f96a-4f92-bad7-3f84652a86e3	2021-08-03 08:44:58.916285+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	ef11cb56-4eff-45f3-a347-702a914cb9f1	0c659dc9-5925-4a87-bc52-0305e6c79704	2021-08-02 12:25:32.981296+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	21870c63-93c0-4ec3-841e-bd813ae079d4	f3b8cd18-a5f7-43b3-8a86-aacc044b01c9	2021-08-02 17:37:46.521386+00
f30de478-b560-47f5-8588-8062ffc64a25	13e1cbea-1c54-4cfb-8a19-f87aab0f72ea	bc099f3b-4d47-460f-88ba-7767f6024b06	2021-08-03 15:00:36.582601+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	dc28716e-8807-4f93-b3f8-278fe40e280a	ae8c71bb-df84-42de-a332-9d1244ed22f5	2021-08-03 10:51:23.592554+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	0cef7d91-df40-49f1-b9ea-be7b1457d560	60864d36-8cc8-4b52-bad1-486180b44f8e	2021-08-02 16:09:23.756498+00
7879f271-4036-48be-befb-f08de052bcdc	235faf89-59ed-4520-8957-38fbd49e2490	7eb738ce-9460-4db8-9284-fa210705c4d1	2021-08-03 12:04:40.645014+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	aff449b5-f49f-4417-8258-8a671518962e	4d729ab4-9a6d-44eb-909d-363564cf4f71	2021-08-11 16:54:02.586837+00
f30de478-b560-47f5-8588-8062ffc64a25	21870c63-93c0-4ec3-841e-bd813ae079d4	f3b8cd18-a5f7-43b3-8a86-aacc044b01c9	2021-08-03 08:47:54.987963+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	dced53b7-5ea8-453b-b0d2-8b1aa88e87fd	fe73ae76-ef33-4f90-a406-e86cf8d45eb2	2021-08-11 09:22:55.939524+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	fc45c751-19c6-421e-96e9-a0fe01874f37	9cc6c521-609c-471b-9150-99cebcb81d37	2021-08-11 09:00:32.697701+00
7879f271-4036-48be-befb-f08de052bcdc	b3abd6a4-3434-4550-bc84-f1f452130e64	954a0596-1a33-4800-9a84-d07ea80c66ab	2021-08-03 14:01:50.413409+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	21870c63-93c0-4ec3-841e-bd813ae079d4	f3b8cd18-a5f7-43b3-8a86-aacc044b01c9	2021-08-03 07:57:15.275779+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	527f10e5-ce40-4d9f-9db3-1eda40155817	f9ddda15-bd7a-463c-b0c1-c5268c9fcb0a	2021-08-03 16:43:14.51466+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	9fa70a66-1e09-4dc4-b5da-4fd46e6f3cb4	3e53926f-1c72-45dd-9c60-017daf996ae2	2021-08-11 08:17:59.091307+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	e0c2d69a-acfd-4080-9bcd-71fbc7f3a182	16a678fd-824e-4821-98b2-bf3210264a5f	2021-08-05 09:56:44.847334+00
f30de478-b560-47f5-8588-8062ffc64a25	065f3700-82a7-4025-bb40-c5362b53f3ba	361ef2f7-185b-4d85-87ab-003e7042175f	2021-08-03 14:46:21.15918+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	527f10e5-ce40-4d9f-9db3-1eda40155817	f9ddda15-bd7a-463c-b0c1-c5268c9fcb0a	2021-08-11 09:22:18.936412+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	39b9b01b-8d3c-4ed5-b161-231d825b7f90	e69cf0a2-ef73-4048-9690-dab54353531e	2021-08-06 12:54:24.349158+00
7a90bccb-346e-4933-aaeb-cdef732be976	32db5328-d846-44c4-867f-e81359e947e2	f465c2bc-d907-47ce-8c4f-f1308675bb74	2021-08-04 14:55:30.842012+00
f30de478-b560-47f5-8588-8062ffc64a25	9e0612da-7c2d-460b-aa24-b762d4202b88	c48eb244-5ab8-4ce2-9f41-d9b47c059a5a	2021-08-09 07:45:25.310652+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	e32c539a-adc3-4ec9-bf15-2d3311a1be29	29a32ba9-a09a-461d-95a8-171298438eb3	2021-08-04 09:17:53.294749+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	d5e1da06-f141-4bff-8b38-d480bf6c0b80	b6c3b248-4483-4215-b5fd-16d235c34e0b	2021-08-12 16:25:12.075666+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	fdc4af0e-d8ac-46de-a2fa-0e0045529c67	3efdb58b-9d36-412e-9890-a8d2091c56cb	2021-08-06 12:53:41.896869+00
ca652ee1-1423-42fe-a0ef-e5761a670845	61659450-ba26-43cf-bc54-dbdeee7a39c8	3e88d2aa-b217-48b2-9447-676ad71e7995	2021-08-04 09:03:25.748225+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	206b161d-acbf-4844-8946-2fa4981de272	fb3e1392-e2dd-4068-8cd9-cbfc2f670cc0	2021-08-13 08:24:14.760314+00
31f1de58-af98-4946-997c-622cb20d9504	90430aff-6410-494f-ad50-94aaf8eb0292	d13ea718-f27e-48a8-8665-8737e1ca3e3b	2021-08-04 10:20:33.691545+00
ca652ee1-1423-42fe-a0ef-e5761a670845	3ffa3d3c-ee5f-4ec6-b12d-33128498ce3f	1c7b20e9-e396-4a6a-88d5-0ab93a7b5192	2021-08-04 09:52:37.089512+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	a442e7be-2447-493d-9403-78b4969d569c	bb488432-e80f-4c1d-b2e4-097ec108335c	2021-08-04 10:02:44.76784+00
7879f271-4036-48be-befb-f08de052bcdc	69e24a15-a7a5-408c-ae3c-523a89b58799	5fa5694e-24f6-47bb-984d-2615c2ea388c	2021-08-04 11:25:28.327717+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	90430aff-6410-494f-ad50-94aaf8eb0292	d13ea718-f27e-48a8-8665-8737e1ca3e3b	2021-08-04 10:17:45.921666+00
ca652ee1-1423-42fe-a0ef-e5761a670845	69e24a15-a7a5-408c-ae3c-523a89b58799	5fa5694e-24f6-47bb-984d-2615c2ea388c	2021-08-04 11:28:54.503687+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	60b8e726-b97c-4f77-95bb-2702f8dcc216	84c6c327-f96a-4f92-bad7-3f84652a86e3	2021-08-08 17:55:17.142846+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	1b11054e-5c4d-4add-9e63-e72448846652	6a453f62-a2a0-476e-81cc-e52ddc91287f	2021-08-13 08:24:28.671286+00
f30de478-b560-47f5-8588-8062ffc64a25	6bba30f9-e03a-447f-b883-32b548f2df98	49da6ac8-383f-4c2b-9071-78dd496030c6	2021-08-09 07:44:31.287815+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	a442e7be-2447-493d-9403-78b4969d569c	bb488432-e80f-4c1d-b2e4-097ec108335c	2021-08-10 09:53:13.459801+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	517f6e60-ddc7-48ad-b7c4-6a08167efc09	15c6cfe4-6a58-4115-b1b4-4249aab00426	2021-08-10 08:42:36.081285+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	3ffa3d3c-ee5f-4ec6-b12d-33128498ce3f	1c7b20e9-e396-4a6a-88d5-0ab93a7b5192	2021-08-09 14:47:32.017122+00
7879f271-4036-48be-befb-f08de052bcdc	fdc4af0e-d8ac-46de-a2fa-0e0045529c67	3efdb58b-9d36-412e-9890-a8d2091c56cb	2021-08-09 08:31:06.904431+00
ca652ee1-1423-42fe-a0ef-e5761a670845	fdc4af0e-d8ac-46de-a2fa-0e0045529c67	3efdb58b-9d36-412e-9890-a8d2091c56cb	2021-08-09 07:46:16.790376+00
7879f271-4036-48be-befb-f08de052bcdc	517f6e60-ddc7-48ad-b7c4-6a08167efc09	15c6cfe4-6a58-4115-b1b4-4249aab00426	2021-08-04 11:40:44.311587+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	7fe5f795-13fb-4cb0-b888-a06f3ddf6cac	a9d46b6e-a172-43fe-9ade-e79f2b1cff15	2021-08-11 08:18:00.215879+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	0ac27c5b-fa0a-4079-aa7a-5f76d332081d	c8acac9d-b341-4d4f-9183-5d6e448d7f65	2021-08-04 10:05:52.192062+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	59ebd84d-6382-43e3-b5ed-d5f6ef582f2c	ceede64f-114b-478d-9e04-6956e5d75853	2021-08-12 07:31:37.639466+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	e0c2d69a-acfd-4080-9bcd-71fbc7f3a182	16a678fd-824e-4821-98b2-bf3210264a5f	2021-08-04 20:08:59.73591+00
ca652ee1-1423-42fe-a0ef-e5761a670845	39b9b01b-8d3c-4ed5-b161-231d825b7f90	e69cf0a2-ef73-4048-9690-dab54353531e	2021-08-05 06:15:22.801604+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	61659450-ba26-43cf-bc54-dbdeee7a39c8	3e88d2aa-b217-48b2-9447-676ad71e7995	2021-08-04 12:30:19.153792+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	4260972d-58a7-41bc-8ebb-a2c94c6cbe8c	c93e721c-241e-4be8-8e9a-49ff42c48b0b	2021-08-13 09:12:09.046116+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	84ae1cf9-da5c-49f5-aa64-bdf5796cf16b	daab2e31-9be6-45c7-9754-654df9b43aa3	2021-08-11 12:51:05.279094+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	81146d99-7c5f-4b86-8826-de0b955093c1	0a95bf22-143d-4af9-9494-3b11e9ccd095	2021-08-11 14:37:11.271913+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	e0c2d69a-acfd-4080-9bcd-71fbc7f3a182	b955c864-315b-40f1-9144-74416a083935	2021-08-03 10:46:02.916881+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	d5e1da06-f141-4bff-8b38-d480bf6c0b80	b6c3b248-4483-4215-b5fd-16d235c34e0b	2021-08-13 09:26:29.86096+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	2afaa7d4-89ee-49ec-9391-dc10c7f9bd6c	4bb60ea6-5f3d-4192-8dba-add8365440bf	2021-08-04 13:12:10.582278+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	6bba30f9-e03a-447f-b883-32b548f2df98	49da6ac8-383f-4c2b-9071-78dd496030c6	2021-08-04 08:11:23.371319+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	13e1cbea-1c54-4cfb-8a19-f87aab0f72ea	bc099f3b-4d47-460f-88ba-7767f6024b06	2021-08-03 15:08:08.402269+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	517f6e60-ddc7-48ad-b7c4-6a08167efc09	15c6cfe4-6a58-4115-b1b4-4249aab00426	2021-08-04 13:13:11.862227+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	fe1bcd9c-03c9-48e7-85c5-b4de3ade9287	c913c0f2-2363-4201-973c-8f078d82a21d	2021-08-04 11:33:18.440424+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	13e1cbea-1c54-4cfb-8a19-f87aab0f72ea	bc099f3b-4d47-460f-88ba-7767f6024b06	2021-08-03 16:06:51.69487+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	c5c343fd-1570-4bfa-a17e-5bc707d8f07a	5ff7d3fb-4fbf-4d1d-8b86-4351999a0dc0	2021-08-03 16:43:27.311126+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	6bba30f9-e03a-447f-b883-32b548f2df98	49da6ac8-383f-4c2b-9071-78dd496030c6	2021-08-09 07:38:07.225569+00
f30de478-b560-47f5-8588-8062ffc64a25	f927973b-9861-482c-92b6-390df01bf193	38f8a6ff-a80f-4c8f-99a3-50869722006a	2021-08-09 08:01:27.617436+00
7879f271-4036-48be-befb-f08de052bcdc	e0c2d69a-acfd-4080-9bcd-71fbc7f3a182	16a678fd-824e-4821-98b2-bf3210264a5f	2021-08-03 14:49:08.939492+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	27187133-565c-4d11-9227-c8a068cdd154	af5e0272-de38-4b9f-9264-21d7327f61ce	2021-08-10 13:27:16.844207+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	ed320f20-c3c0-4ffa-9943-37df7eaa5ea8	db64ae10-1444-40c0-89bc-0eb434f484e4	2021-08-04 10:07:14.869906+00
7a90bccb-346e-4933-aaeb-cdef732be976	0ac27c5b-fa0a-4079-aa7a-5f76d332081d	c8acac9d-b341-4d4f-9183-5d6e448d7f65	2021-08-04 08:03:37.009797+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	1b11054e-5c4d-4add-9e63-e72448846652	6a453f62-a2a0-476e-81cc-e52ddc91287f	2021-08-13 07:53:55.845633+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	fdc4af0e-d8ac-46de-a2fa-0e0045529c67	3efdb58b-9d36-412e-9890-a8d2091c56cb	2021-08-10 07:59:54.48924+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	b620880f-3182-471f-88ed-2726bcebf800	dbc48fdf-3014-4a56-b8f3-1cefa783184f	2021-08-11 10:35:39.624106+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	90430aff-6410-494f-ad50-94aaf8eb0292	d13ea718-f27e-48a8-8665-8737e1ca3e3b	2021-08-10 12:32:22.71337+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	6bba30f9-e03a-447f-b883-32b548f2df98	49da6ac8-383f-4c2b-9071-78dd496030c6	2021-08-04 09:42:24.113679+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	b3abd6a4-3434-4550-bc84-f1f452130e64	954a0596-1a33-4800-9a84-d07ea80c66ab	2021-08-03 14:55:53.329458+00
f30de478-b560-47f5-8588-8062ffc64a25	a442e7be-2447-493d-9403-78b4969d569c	bb488432-e80f-4c1d-b2e4-097ec108335c	2021-08-04 10:13:29.212131+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	ec23d178-0a3a-4eaf-b2de-ef36bf46c235	fba5632d-6893-4ff2-bd5b-45087349ebbc	2021-08-11 09:00:34.123646+00
7a90bccb-346e-4933-aaeb-cdef732be976	2a2c495e-2921-45b6-9dd6-5c8245c63ea0	119384a7-a4b5-4181-b66f-4533d43dcb5d	2021-08-10 14:49:50.176473+00
7879f271-4036-48be-befb-f08de052bcdc	065f3700-82a7-4025-bb40-c5362b53f3ba	361ef2f7-185b-4d85-87ab-003e7042175f	2021-08-03 14:58:33.117305+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	7ef55206-4dc3-44f9-89f2-8f141237b3a7	4a007c82-5a78-4b18-ad5b-49b76ba93a18	2021-08-11 11:33:18.987525+00
7879f271-4036-48be-befb-f08de052bcdc	9ba172a0-a1a7-4caa-a221-b8a2704e5a9c	7a3416fe-0729-42f9-b5b8-be52b18793d8	2021-08-11 15:46:36.265334+00
7879f271-4036-48be-befb-f08de052bcdc	795d9351-a097-48a7-9c5a-7a0409341af4	42519d93-decc-4f6e-bfc7-b16922e00c34	2021-08-10 09:51:36.209172+00
31f1de58-af98-4946-997c-622cb20d9504	6bba30f9-e03a-447f-b883-32b548f2df98	49da6ac8-383f-4c2b-9071-78dd496030c6	2021-08-06 00:37:12.855284+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	8318452f-09bc-48ae-b89b-6c479ff3ce34	42765fd4-2d60-48f6-bf4a-6da85851d6e1	2021-08-10 14:19:12.64914+00
ca652ee1-1423-42fe-a0ef-e5761a670845	517f6e60-ddc7-48ad-b7c4-6a08167efc09	15c6cfe4-6a58-4115-b1b4-4249aab00426	2021-08-05 08:59:30.445904+00
7a90bccb-346e-4933-aaeb-cdef732be976	ddf30ba1-4908-409d-ab39-cf57d34d658e	f07ee408-e933-42ba-8f28-1b63dff5a5a7	2021-08-11 07:26:24.540094+00
7879f271-4036-48be-befb-f08de052bcdc	39b9b01b-8d3c-4ed5-b161-231d825b7f90	e69cf0a2-ef73-4048-9690-dab54353531e	2021-08-11 16:41:42.386982+00
7a90bccb-346e-4933-aaeb-cdef732be976	517f6e60-ddc7-48ad-b7c4-6a08167efc09	15c6cfe4-6a58-4115-b1b4-4249aab00426	2021-08-04 14:57:23.590587+00
ca652ee1-1423-42fe-a0ef-e5761a670845	9ba172a0-a1a7-4caa-a221-b8a2704e5a9c	0d295ef4-ed79-4c2f-8c2e-826801bb0fc4	2021-08-10 12:19:29.893839+00
7879f271-4036-48be-befb-f08de052bcdc	59add48e-eb2e-41cc-babf-e37172728fce	fe91b95b-4612-499e-acd4-7437c5a3dcc1	2021-08-09 10:20:41.374394+00
7a90bccb-346e-4933-aaeb-cdef732be976	daea1cc1-364d-4be3-a8d3-ba1259d61e54	d006e0dd-7681-4f0f-bae7-9a875897b089	2021-08-13 14:46:40.646158+00
7879f271-4036-48be-befb-f08de052bcdc	2d595a43-5d31-45d0-b38f-0323c78dc7cb	a200c8e2-ef10-4b96-937f-c2edf81a0f30	2021-08-11 19:29:55.171735+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	2f38aa46-5517-4c9b-b060-81e3a2864bee	49cd8bf0-e55e-4a87-bfec-2d4dc3fa9b0a	2021-08-13 09:23:57.533116+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	7ef55206-4dc3-44f9-89f2-8f141237b3a7	4a007c82-5a78-4b18-ad5b-49b76ba93a18	2021-08-11 10:43:44.945952+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	ce8a900c-eab9-44c2-bf95-873272fa5e77	faac881f-8a62-469e-afdd-7bb20061ddae	2021-08-13 15:28:07.503403+00
f30de478-b560-47f5-8588-8062ffc64a25	b09018a0-a20b-4bd3-9852-e711754efbf5	9f88b614-b23d-4878-84ce-b6fde7ab8c63	2021-08-13 07:12:50.145595+00
31f1de58-af98-4946-997c-622cb20d9504	aa52c52f-fddc-45a4-945a-ed73947d74c9	f9c11603-6b10-49b0-b4be-225fe02f04a3	2021-08-11 13:19:55.553837+00
f30de478-b560-47f5-8588-8062ffc64a25	4225e883-1e99-4cab-9000-eee3c4dfd200	518786b5-b6a0-4c54-b3c5-6a16ecb1342f	2021-08-13 14:52:25.039087+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	2d595a43-5d31-45d0-b38f-0323c78dc7cb	a200c8e2-ef10-4b96-937f-c2edf81a0f30	2021-08-13 08:27:03.371792+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	9fa78080-867b-4e01-b60a-6f47b55c4b58	055d299c-3cbd-46ed-bb53-daa2ca8bf69c	2021-08-13 12:57:34.846596+00
7a90bccb-346e-4933-aaeb-cdef732be976	fafc97b7-182c-4bd6-87ac-d444592c2c54	71dfb5a6-7cba-4ae2-b796-fe222b363b14	2021-08-11 12:41:57.891934+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	30337aa3-0269-42d8-9e6e-efac86a1db9e	bd8eb673-0a6b-428a-8af7-5d936dd16eec	2021-08-12 13:29:10.788793+00
ca652ee1-1423-42fe-a0ef-e5761a670845	48f01dec-6f89-41eb-a461-5c8aed9b8c76	f713bf4e-6aa0-4014-846c-1d7e8489487c	2021-08-13 09:50:12.466084+00
7a90bccb-346e-4933-aaeb-cdef732be976	074089ce-2f23-49b6-bfa5-7b8b2f7a1f31	fe2c8cce-48bd-463d-89a4-a0969e5eba2d	2021-08-11 15:41:27.95404+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	a3bb912d-893d-40b9-bda9-5f74c5da9d2a	0eb468cb-7bfb-42d7-9ac8-f7f4d00d8ea9	2021-08-13 08:27:07.543161+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	aff449b5-f49f-4417-8258-8a671518962e	4d729ab4-9a6d-44eb-909d-363564cf4f71	2021-08-12 12:23:46.98467+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	25522813-086e-4ef1-ad4b-eac1740a83eb	73be0a1b-f273-43d3-8c4d-c7ffec21d680	2021-08-13 08:24:23.346946+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	810dbc47-af96-4c1b-bdbd-b1dcd6aa4322	5819c072-7410-47ae-99ab-454e1ba0b9ad	2021-08-13 07:26:53.548441+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	9fa78080-867b-4e01-b60a-6f47b55c4b58	055d299c-3cbd-46ed-bb53-daa2ca8bf69c	2021-08-13 09:24:27.716903+00
f30de478-b560-47f5-8588-8062ffc64a25	c5ec9832-9fac-4c5f-b44f-de7dacedf5da	6b6cd268-40da-4c91-8dc9-c386f82311fb	2021-08-13 15:41:40.486632+00
7879f271-4036-48be-befb-f08de052bcdc	44660c03-0bba-42df-b615-b3638a56d282	3120af3c-3255-4982-95c7-0ab6104e7a49	2021-08-15 14:52:01.463325+00
7a90bccb-346e-4933-aaeb-cdef732be976	d5e1da06-f141-4bff-8b38-d480bf6c0b80	b6c3b248-4483-4215-b5fd-16d235c34e0b	2021-08-13 15:19:30.78387+00
7879f271-4036-48be-befb-f08de052bcdc	29f7bc2a-76ff-4f94-8cb1-1f11045297a1	8d2ed941-79c3-4319-89ad-1b98789f0ff1	2021-08-15 14:46:05.1868+00
7879f271-4036-48be-befb-f08de052bcdc	78dc049f-b901-4a54-8068-05f5e3c879b8	ade4de71-12dc-489d-8ed0-c51f7fc26644	2021-08-15 14:46:35.725087+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	d167d1c7-ba53-42c5-ac8a-c07c204215c8	80d0e409-fd64-44fa-b7dd-9b76d78ed5d6	2021-08-15 19:11:38.067383+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	90430aff-6410-494f-ad50-94aaf8eb0292	d13ea718-f27e-48a8-8665-8737e1ca3e3b	2021-08-04 13:15:43.670002+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	517f6e60-ddc7-48ad-b7c4-6a08167efc09	15c6cfe4-6a58-4115-b1b4-4249aab00426	2021-08-04 10:25:22.147206+00
7879f271-4036-48be-befb-f08de052bcdc	d8d2844e-e84c-4c27-a1d7-c3310afafda0	80bce362-8c08-4ae9-b060-ee4537ec0365	2021-08-11 16:41:43.448074+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	ba6f00ff-074e-41ab-b0f2-110e08b72e23	2bc7f4ec-677d-499a-8165-17bbadaff44a	2021-08-13 08:27:03.855473+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	dced53b7-5ea8-453b-b0d2-8b1aa88e87fd	ee79ebcd-fbd3-47ed-af61-c9697f538c8e	2021-08-03 15:08:48.160916+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	32db5328-d846-44c4-867f-e81359e947e2	f465c2bc-d907-47ce-8c4f-f1308675bb74	2021-08-04 13:51:19.316066+00
31f1de58-af98-4946-997c-622cb20d9504	6159e96d-a508-45e2-8868-345533482eed	0308ee84-9f2c-48bc-88aa-084eeadc570d	2021-08-11 13:19:50.318731+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	fdc4af0e-d8ac-46de-a2fa-0e0045529c67	3efdb58b-9d36-412e-9890-a8d2091c56cb	2021-08-04 09:05:45.598759+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	2a2c495e-2921-45b6-9dd6-5c8245c63ea0	119384a7-a4b5-4181-b66f-4533d43dcb5d	2021-08-10 13:19:56.560341+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	e0c2d69a-acfd-4080-9bcd-71fbc7f3a182	16a678fd-824e-4821-98b2-bf3210264a5f	2021-08-03 15:14:09.154959+00
f30de478-b560-47f5-8588-8062ffc64a25	9ba172a0-a1a7-4caa-a221-b8a2704e5a9c	7a3416fe-0729-42f9-b5b8-be52b18793d8	2021-08-12 14:42:41.942291+00
ca652ee1-1423-42fe-a0ef-e5761a670845	59add48e-eb2e-41cc-babf-e37172728fce	48323b98-5c4c-4784-8987-6db050e000fc	2021-08-09 09:19:55.131056+00
7879f271-4036-48be-befb-f08de052bcdc	0e98bd99-373d-42e4-9d94-aea273569288	9ff71725-b5cc-4651-ab70-f827e775984b	2021-08-03 14:49:46.343327+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	302234fb-76ed-42cd-b9d2-959f66e7bdff	0fcfc38e-cf8f-48c5-bec6-70814a885eb3	2021-08-11 09:29:14.01396+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	2d595a43-5d31-45d0-b38f-0323c78dc7cb	a200c8e2-ef10-4b96-937f-c2edf81a0f30	2021-08-11 11:33:13.252472+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	60b8e726-b97c-4f77-95bb-2702f8dcc216	84c6c327-f96a-4f92-bad7-3f84652a86e3	2021-08-04 10:05:55.255355+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	7da19367-6883-4946-b4e6-789744d03b89	2fce887d-ac35-4ed0-b153-1268d3d11783	2021-08-11 09:32:13.269467+00
31f1de58-af98-4946-997c-622cb20d9504	a442e7be-2447-493d-9403-78b4969d569c	bb488432-e80f-4c1d-b2e4-097ec108335c	2021-08-04 13:54:16.692446+00
ca652ee1-1423-42fe-a0ef-e5761a670845	ddf30ba1-4908-409d-ab39-cf57d34d658e	006b5ef5-9cfd-41b3-94f0-4fc19ae033b1	2021-08-11 07:53:05.751736+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	fe1bcd9c-03c9-48e7-85c5-b4de3ade9287	c913c0f2-2363-4201-973c-8f078d82a21d	2021-08-05 07:45:09.472884+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	a442e7be-2447-493d-9403-78b4969d569c	bb488432-e80f-4c1d-b2e4-097ec108335c	2021-08-05 07:45:40.389511+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	90430aff-6410-494f-ad50-94aaf8eb0292	d13ea718-f27e-48a8-8665-8737e1ca3e3b	2021-08-04 13:20:19.790986+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	69e24a15-a7a5-408c-ae3c-523a89b58799	5fa5694e-24f6-47bb-984d-2615c2ea388c	2021-08-04 15:12:53.285568+00
7879f271-4036-48be-befb-f08de052bcdc	7ef55206-4dc3-44f9-89f2-8f141237b3a7	4a007c82-5a78-4b18-ad5b-49b76ba93a18	2021-08-11 16:42:02.95331+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	3c9e5c02-47a1-47b0-95cf-cf2e6f7db188	6508e6bc-2ad8-4ccf-af76-c527cec90c12	2021-08-10 13:01:01.496592+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	0e98bd99-373d-42e4-9d94-aea273569288	9ff71725-b5cc-4651-ab70-f827e775984b	2021-08-03 16:06:49.941928+00
ca652ee1-1423-42fe-a0ef-e5761a670845	dab455dc-a825-4287-816a-29310bd8c38f	aed02ba8-4855-49ea-9d0e-646904ce5d5e	2021-08-10 07:25:04.708898+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	6f4d0bba-4553-4747-bd7b-0f91ab5617a2	f92b5c30-83a1-44a9-a1b7-17121f3e02a5	2021-08-12 14:23:37.441251+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	13e1cbea-1c54-4cfb-8a19-f87aab0f72ea	bc099f3b-4d47-460f-88ba-7767f6024b06	2021-08-03 14:56:04.79295+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	21870c63-93c0-4ec3-841e-bd813ae079d4	f3b8cd18-a5f7-43b3-8a86-aacc044b01c9	2021-08-13 08:29:43.053709+00
7879f271-4036-48be-befb-f08de052bcdc	0ac27c5b-fa0a-4079-aa7a-5f76d332081d	c8acac9d-b341-4d4f-9183-5d6e448d7f65	2021-08-04 06:39:08.590421+00
7879f271-4036-48be-befb-f08de052bcdc	2afaa7d4-89ee-49ec-9391-dc10c7f9bd6c	4bb60ea6-5f3d-4192-8dba-add8365440bf	2021-08-05 08:24:51.533461+00
7879f271-4036-48be-befb-f08de052bcdc	17b401b9-004c-446d-8b31-c072c5ad870d	d9784f9f-da93-4980-9eff-a0dc6ab619a9	2021-08-05 08:54:42.523922+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	daea1cc1-364d-4be3-a8d3-ba1259d61e54	7fbf7ad2-3e2f-4262-a757-c34ec5a8d9bc	2021-08-13 13:48:18.531387+00
ca652ee1-1423-42fe-a0ef-e5761a670845	d438642d-c090-43c5-9d22-2c4cedd787a4	144b39fe-8636-46da-925d-088f05324b49	2021-08-10 12:17:06.830323+00
7879f271-4036-48be-befb-f08de052bcdc	67fc219e-072b-4b22-b295-0fd462aae098	309a68b4-40e6-401f-8039-9c7d1731bc73	2021-08-10 15:19:04.816937+00
ca652ee1-1423-42fe-a0ef-e5761a670845	2afaa7d4-89ee-49ec-9391-dc10c7f9bd6c	4bb60ea6-5f3d-4192-8dba-add8365440bf	2021-08-04 14:00:35.36882+00
f30de478-b560-47f5-8588-8062ffc64a25	dd805776-a22f-4897-891a-46ebc6fb4725	48bc50a5-2527-4787-9180-0d59eb28d879	2021-08-11 10:46:28.214211+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	fe1bcd9c-03c9-48e7-85c5-b4de3ade9287	c913c0f2-2363-4201-973c-8f078d82a21d	2021-08-05 18:51:44.063411+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	2f38aa46-5517-4c9b-b060-81e3a2864bee	49cd8bf0-e55e-4a87-bfec-2d4dc3fa9b0a	2021-08-13 07:26:56.838608+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	28799055-2bf2-420e-b6fb-6cb332de30b4	6c37acfd-5f47-4c39-9cbd-b362bccc244f	2021-08-13 16:19:35.513106+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	cb2365c8-f314-4744-a80e-a709a02817f8	e3ea8bf1-0d92-4b99-9b20-705cc59ee304	2021-08-13 09:29:30.429779+00
7a90bccb-346e-4933-aaeb-cdef732be976	d1243295-e6ac-4da5-866f-582a9b419a4f	1d7f98a7-7661-4c6c-a423-50a194196406	2021-08-12 18:52:57.048663+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	17b401b9-004c-446d-8b31-c072c5ad870d	d9784f9f-da93-4980-9eff-a0dc6ab619a9	2021-08-05 07:05:35.08234+00
7a90bccb-346e-4933-aaeb-cdef732be976	fdc4af0e-d8ac-46de-a2fa-0e0045529c67	3efdb58b-9d36-412e-9890-a8d2091c56cb	2021-08-10 08:50:41.591098+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	1d0464b7-8b84-4731-bb53-37c247f2b179	5fbfa618-762b-491f-a4d6-a550fbbe6382	2021-08-11 09:12:30.111788+00
f30de478-b560-47f5-8588-8062ffc64a25	9fa70a66-1e09-4dc4-b5da-4fd46e6f3cb4	3e53926f-1c72-45dd-9c60-017daf996ae2	2021-08-10 08:01:27.686742+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	c5ec9832-9fac-4c5f-b44f-de7dacedf5da	6b6cd268-40da-4c91-8dc9-c386f82311fb	2021-08-13 15:27:50.692064+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	48f01dec-6f89-41eb-a461-5c8aed9b8c76	865e980c-a3fe-4851-a46d-eb52c4a6fed1	2021-08-13 12:57:21.93657+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	d5e1da06-f141-4bff-8b38-d480bf6c0b80	b6c3b248-4483-4215-b5fd-16d235c34e0b	2021-08-13 09:36:15.587276+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	0558025b-be7f-429b-9736-4764a82933f0	0e310990-2e24-42cf-969a-0568f4657d07	2021-08-13 08:24:28.934494+00
7a90bccb-346e-4933-aaeb-cdef732be976	2d595a43-5d31-45d0-b38f-0323c78dc7cb	838fed91-36ee-486d-b037-90f56262d1ed	2021-08-10 15:35:48.417735+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	7d401447-9caf-4713-812c-f1072d277d5c	ad8a95e0-506d-4b12-8daf-bc47889ff6c2	2021-08-13 08:24:33.027936+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	447c3879-98b7-45f7-a978-77f20fc8c69a	5051bf3d-cd6e-470c-aa3a-58f9deb28349	2021-08-13 07:00:55.173173+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	d2495640-61f5-4c4d-95ee-59999fe26f27	9571501e-cdc8-4e57-9c98-0edf0420a480	2021-08-13 16:19:37.606253+00
f30de478-b560-47f5-8588-8062ffc64a25	795d9351-a097-48a7-9c5a-7a0409341af4	42519d93-decc-4f6e-bfc7-b16922e00c34	2021-08-13 07:11:25.8782+00
7a90bccb-346e-4933-aaeb-cdef732be976	8b62b6ad-fe39-40aa-b8b5-44284657b286	db39bd91-5cb0-460b-8042-e9e08917987f	2021-08-12 19:39:06.706553+00
7a90bccb-346e-4933-aaeb-cdef732be976	48f01dec-6f89-41eb-a461-5c8aed9b8c76	865e980c-a3fe-4851-a46d-eb52c4a6fed1	2021-08-13 15:16:58.783392+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	a3df9a5b-6188-4a59-b780-019b5897954c	993750d5-c564-4265-87d6-ff428191e27b	2021-08-13 09:22:09.630283+00
7a90bccb-346e-4933-aaeb-cdef732be976	8bdd2810-4147-4198-9008-67bdb770b440	a5126690-8fd7-4714-a038-f6d81c7036b2	2021-08-13 15:19:32.774047+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	daea1cc1-364d-4be3-a8d3-ba1259d61e54	d006e0dd-7681-4f0f-bae7-9a875897b089	2021-08-13 15:04:01.416042+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	a7e76ba5-9d54-4d3b-be5d-f74e782c6903	d5c2d3f4-41ba-494f-bd5c-8094d6ab6dd8	2021-08-13 09:25:43.064219+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	447c3879-98b7-45f7-a978-77f20fc8c69a	5051bf3d-cd6e-470c-aa3a-58f9deb28349	2021-08-13 15:28:47.22929+00
7879f271-4036-48be-befb-f08de052bcdc	6eaf91dc-0e6f-4760-a528-272403cdc422	300c98c8-2136-47f5-a738-d8e6eda86f4a	2021-08-15 14:46:17.810496+00
7879f271-4036-48be-befb-f08de052bcdc	8bdd2810-4147-4198-9008-67bdb770b440	a92b291f-15c8-4009-9a2e-36e8d896d6c6	2021-08-15 14:52:32.006983+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	a3bb912d-893d-40b9-bda9-5f74c5da9d2a	0eb468cb-7bfb-42d7-9ac8-f7f4d00d8ea9	2021-08-11 08:52:52.573278+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	d438642d-c090-43c5-9d22-2c4cedd787a4	549e45b9-5e73-4f5b-941a-24bf5e42ad65	2021-08-11 14:58:44.532606+00
7a90bccb-346e-4933-aaeb-cdef732be976	39b9b01b-8d3c-4ed5-b161-231d825b7f90	e69cf0a2-ef73-4048-9690-dab54353531e	2021-08-10 09:44:46.169638+00
31f1de58-af98-4946-997c-622cb20d9504	7fe5f795-13fb-4cb0-b888-a06f3ddf6cac	a9d46b6e-a172-43fe-9ade-e79f2b1cff15	2021-08-06 00:37:14.768248+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	896e7658-05a4-449b-8c25-89c4c7d11be1	d1a6ed3a-2d4c-485c-9008-08375c028367	2021-08-05 11:51:55.258648+00
7879f271-4036-48be-befb-f08de052bcdc	759033ee-010f-4517-8506-b65d6ad11ee8	cca02cba-abd7-4001-8623-91aa9ab6402c	2021-08-12 07:19:55.771141+00
7a90bccb-346e-4933-aaeb-cdef732be976	2afaa7d4-89ee-49ec-9391-dc10c7f9bd6c	4bb60ea6-5f3d-4192-8dba-add8365440bf	2021-08-04 14:57:54.226983+00
f30de478-b560-47f5-8588-8062ffc64a25	aa52c52f-fddc-45a4-945a-ed73947d74c9	fb3fe25b-7d81-43f8-96e6-0f68a87f722a	2021-08-11 08:48:35.479714+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	fdc4af0e-d8ac-46de-a2fa-0e0045529c67	3efdb58b-9d36-412e-9890-a8d2091c56cb	2021-08-04 14:25:01.408658+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	fe1bcd9c-03c9-48e7-85c5-b4de3ade9287	c913c0f2-2363-4201-973c-8f078d82a21d	2021-08-04 13:15:45.839773+00
ca652ee1-1423-42fe-a0ef-e5761a670845	e6fa7e76-533c-45fa-85b8-ecef973c3c00	5afdcfc6-441b-4f3a-a92e-7c058c17cdfd	2021-08-06 13:49:00.409386+00
31f1de58-af98-4946-997c-622cb20d9504	fe1bcd9c-03c9-48e7-85c5-b4de3ade9287	c913c0f2-2363-4201-973c-8f078d82a21d	2021-08-04 13:54:14.161259+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	d438642d-c090-43c5-9d22-2c4cedd787a4	144b39fe-8636-46da-925d-088f05324b49	2021-08-04 17:32:21.367152+00
f30de478-b560-47f5-8588-8062ffc64a25	d438642d-c090-43c5-9d22-2c4cedd787a4	549e45b9-5e73-4f5b-941a-24bf5e42ad65	2021-08-12 14:43:12.762837+00
ca652ee1-1423-42fe-a0ef-e5761a670845	a3bb912d-893d-40b9-bda9-5f74c5da9d2a	11555c0e-f664-485a-8927-63e387f87eff	2021-08-05 06:15:25.916375+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	25522813-086e-4ef1-ad4b-eac1740a83eb	73be0a1b-f273-43d3-8c4d-c7ffec21d680	2021-08-05 10:15:26.11829+00
7a90bccb-346e-4933-aaeb-cdef732be976	69e24a15-a7a5-408c-ae3c-523a89b58799	5fa5694e-24f6-47bb-984d-2615c2ea388c	2021-08-05 07:17:53.195901+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	302234fb-76ed-42cd-b9d2-959f66e7bdff	0fcfc38e-cf8f-48c5-bec6-70814a885eb3	2021-08-11 07:07:36.729432+00
f30de478-b560-47f5-8588-8062ffc64a25	25522813-086e-4ef1-ad4b-eac1740a83eb	73be0a1b-f273-43d3-8c4d-c7ffec21d680	2021-08-05 16:15:51.401752+00
f30de478-b560-47f5-8588-8062ffc64a25	7fe5f795-13fb-4cb0-b888-a06f3ddf6cac	a9d46b6e-a172-43fe-9ade-e79f2b1cff15	2021-08-09 07:44:00.782795+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	8318452f-09bc-48ae-b89b-6c479ff3ce34	42765fd4-2d60-48f6-bf4a-6da85851d6e1	2021-08-11 10:13:21.956533+00
7a90bccb-346e-4933-aaeb-cdef732be976	d8d2844e-e84c-4c27-a1d7-c3310afafda0	80bce362-8c08-4ae9-b060-ee4537ec0365	2021-08-09 11:29:21.21133+00
31f1de58-af98-4946-997c-622cb20d9504	25522813-086e-4ef1-ad4b-eac1740a83eb	73be0a1b-f273-43d3-8c4d-c7ffec21d680	2021-08-05 18:44:17.236628+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	896e7658-05a4-449b-8c25-89c4c7d11be1	d1a6ed3a-2d4c-485c-9008-08375c028367	2021-08-06 12:54:32.920893+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	25522813-086e-4ef1-ad4b-eac1740a83eb	73be0a1b-f273-43d3-8c4d-c7ffec21d680	2021-08-05 16:05:38.49867+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	7fe5f795-13fb-4cb0-b888-a06f3ddf6cac	a9d46b6e-a172-43fe-9ade-e79f2b1cff15	2021-08-09 07:02:34.20295+00
f30de478-b560-47f5-8588-8062ffc64a25	80439d52-b5f8-40d3-af3f-7947802431a3	421e4d37-7830-47d9-b417-d9c93876866d	2021-08-11 09:57:49.458115+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	7fe5f795-13fb-4cb0-b888-a06f3ddf6cac	a9d46b6e-a172-43fe-9ade-e79f2b1cff15	2021-08-05 16:05:45.193956+00
ca652ee1-1423-42fe-a0ef-e5761a670845	8ef2ac54-7d44-4bfd-b897-f88ee920764e	4230fd13-f3b9-4c9b-9137-f0d403e4c60f	2021-08-13 07:41:30.040889+00
25db9c19-f84e-40d8-9dfb-ee94478ca40a	7fe5f795-13fb-4cb0-b888-a06f3ddf6cac	a9d46b6e-a172-43fe-9ade-e79f2b1cff15	2021-08-05 09:33:13.969311+00
7879f271-4036-48be-befb-f08de052bcdc	e6fa7e76-533c-45fa-85b8-ecef973c3c00	5afdcfc6-441b-4f3a-a92e-7c058c17cdfd	2021-08-06 13:45:24.945854+00
ca652ee1-1423-42fe-a0ef-e5761a670845	d8d2844e-e84c-4c27-a1d7-c3310afafda0	80bce362-8c08-4ae9-b060-ee4537ec0365	2021-08-10 07:23:00.127234+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	896e7658-05a4-449b-8c25-89c4c7d11be1	d1a6ed3a-2d4c-485c-9008-08375c028367	2021-08-05 12:50:11.312032+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	25522813-086e-4ef1-ad4b-eac1740a83eb	73be0a1b-f273-43d3-8c4d-c7ffec21d680	2021-08-06 07:18:24.087096+00
ca652ee1-1423-42fe-a0ef-e5761a670845	44660c03-0bba-42df-b615-b3638a56d282	dffc1b88-ad58-4596-a03d-9bfb36dae6e6	2021-08-13 07:10:21.21723+00
7879f271-4036-48be-befb-f08de052bcdc	a3bb912d-893d-40b9-bda9-5f74c5da9d2a	0eb468cb-7bfb-42d7-9ac8-f7f4d00d8ea9	2021-08-10 11:32:32.634555+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	e6fa7e76-533c-45fa-85b8-ecef973c3c00	5afdcfc6-441b-4f3a-a92e-7c058c17cdfd	2021-08-06 12:53:54.639461+00
f30de478-b560-47f5-8588-8062ffc64a25	8318452f-09bc-48ae-b89b-6c479ff3ce34	42765fd4-2d60-48f6-bf4a-6da85851d6e1	2021-08-13 07:11:30.647693+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	d438642d-c090-43c5-9d22-2c4cedd787a4	549e45b9-5e73-4f5b-941a-24bf5e42ad65	2021-08-11 16:30:13.876602+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	ddf30ba1-4908-409d-ab39-cf57d34d658e	006b5ef5-9cfd-41b3-94f0-4fc19ae033b1	2021-08-13 08:27:06.461797+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	d438642d-c090-43c5-9d22-2c4cedd787a4	549e45b9-5e73-4f5b-941a-24bf5e42ad65	2021-08-11 09:24:01.513934+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	dced53b7-5ea8-453b-b0d2-8b1aa88e87fd	fe73ae76-ef33-4f90-a406-e86cf8d45eb2	2021-08-10 06:40:36.649316+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	2f38aa46-5517-4c9b-b060-81e3a2864bee	49cd8bf0-e55e-4a87-bfec-2d4dc3fa9b0a	2021-08-13 07:51:58.279854+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	3ffa3d3c-ee5f-4ec6-b12d-33128498ce3f	1c7b20e9-e396-4a6a-88d5-0ab93a7b5192	2021-08-13 08:24:31.919781+00
7a90bccb-346e-4933-aaeb-cdef732be976	d438642d-c090-43c5-9d22-2c4cedd787a4	549e45b9-5e73-4f5b-941a-24bf5e42ad65	2021-08-11 08:47:18.006379+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	c1c1d528-b74c-4847-8938-df9771bd02c1	224dffc5-fe29-443c-8a6c-4dd5e9958cfc	2021-08-12 13:29:13.201248+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	d346172f-a1b2-48f4-b1e1-ea65bfbfaa6c	c3234c77-2ca5-423e-8918-3a286d15ce53	2021-08-13 08:24:35.201392+00
f30de478-b560-47f5-8588-8062ffc64a25	24a10f8e-2a51-48ec-ba9a-a756a822ce6e	491fdbc8-606d-4b9d-829b-20e7083cc548	2021-08-13 12:02:34.565086+00
ca652ee1-1423-42fe-a0ef-e5761a670845	7d401447-9caf-4713-812c-f1072d277d5c	ad8a95e0-506d-4b12-8daf-bc47889ff6c2	2021-08-12 09:30:00.776031+00
7a90bccb-346e-4933-aaeb-cdef732be976	a3bb912d-893d-40b9-bda9-5f74c5da9d2a	0eb468cb-7bfb-42d7-9ac8-f7f4d00d8ea9	2021-08-10 14:20:21.549303+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	8819386c-658f-4629-9746-36de21ced530	a1e8d9ad-07b5-4805-8b92-e11d9799ac58	2021-08-13 08:31:34.905112+00
7879f271-4036-48be-befb-f08de052bcdc	a3df9a5b-6188-4a59-b780-019b5897954c	993750d5-c564-4265-87d6-ff428191e27b	2021-08-15 14:46:19.897583+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	59add48e-eb2e-41cc-babf-e37172728fce	fe91b95b-4612-499e-acd4-7437c5a3dcc1	2021-08-10 08:42:33.42358+00
7a90bccb-346e-4933-aaeb-cdef732be976	add6498d-bbfa-4d87-b3da-ff3115179a0e	72aed269-8c3e-42b1-b59e-f14f75d7b7e3	2021-08-10 14:21:08.424389+00
ca652ee1-1423-42fe-a0ef-e5761a670845	795d9351-a097-48a7-9c5a-7a0409341af4	42519d93-decc-4f6e-bfc7-b16922e00c34	2021-08-10 10:03:27.480363+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	aa52c52f-fddc-45a4-945a-ed73947d74c9	fb3fe25b-7d81-43f8-96e6-0f68a87f722a	2021-08-10 14:21:53.205071+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	b7330847-fe0d-4446-83b1-a989f47a959e	65f814cc-bbe8-40cc-b382-19485fc80501	2021-08-13 15:46:15.573406+00
7a90bccb-346e-4933-aaeb-cdef732be976	18982189-4823-414e-b456-65e09d1237fa	4fa1bbd6-15d4-43b6-8c86-7a9c9a77e3c2	2021-08-11 12:42:22.402396+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	52fe8757-21c1-4e21-b75f-c20bf1efdee4	b1f58e87-c038-4202-936e-de0ee5e90d66	2021-08-13 07:26:22.648699+00
7a90bccb-346e-4933-aaeb-cdef732be976	59add48e-eb2e-41cc-babf-e37172728fce	fe91b95b-4612-499e-acd4-7437c5a3dcc1	2021-08-10 07:23:51.303692+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	517f6e60-ddc7-48ad-b7c4-6a08167efc09	15c6cfe4-6a58-4115-b1b4-4249aab00426	2021-08-13 08:27:34.620006+00
7a90bccb-346e-4933-aaeb-cdef732be976	3ffa3d3c-ee5f-4ec6-b12d-33128498ce3f	1c7b20e9-e396-4a6a-88d5-0ab93a7b5192	2021-08-11 12:44:01.534573+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	759033ee-010f-4517-8506-b65d6ad11ee8	cca02cba-abd7-4001-8623-91aa9ab6402c	2021-08-11 12:55:36.486904+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	a61bd1a0-ab6c-4c3d-8ef2-d90dd7b4ceef	ad804eb9-d31d-4311-aeeb-5e46de6e1802	2021-08-13 08:27:34.635288+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	a3bb912d-893d-40b9-bda9-5f74c5da9d2a	0eb468cb-7bfb-42d7-9ac8-f7f4d00d8ea9	2021-08-10 11:47:53.153401+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	59add48e-eb2e-41cc-babf-e37172728fce	fe91b95b-4612-499e-acd4-7437c5a3dcc1	2021-08-13 08:27:35.731856+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	2a2c495e-2921-45b6-9dd6-5c8245c63ea0	119384a7-a4b5-4181-b66f-4533d43dcb5d	2021-08-10 11:50:54.87609+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	ed0cd994-b487-43f9-a7af-3bd5b64830b4	f4529541-0a80-448a-b4d4-9b4bb6c15568	2021-08-13 08:24:34.233394+00
7a90bccb-346e-4933-aaeb-cdef732be976	8819386c-658f-4629-9746-36de21ced530	a1e8d9ad-07b5-4805-8b92-e11d9799ac58	2021-08-13 08:47:17.413943+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	39b9b01b-8d3c-4ed5-b161-231d825b7f90	e69cf0a2-ef73-4048-9690-dab54353531e	2021-08-10 06:03:57.017316+00
ca652ee1-1423-42fe-a0ef-e5761a670845	18982189-4823-414e-b456-65e09d1237fa	4fa1bbd6-15d4-43b6-8c86-7a9c9a77e3c2	2021-08-12 07:22:50.89854+00
f30de478-b560-47f5-8588-8062ffc64a25	5c601a00-3bdd-4601-836c-dc9a4d9eff3d	d6146f20-fe4d-4389-a332-04c58fd7fd5f	2021-08-11 10:46:29.654436+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	b620880f-3182-471f-88ed-2726bcebf800	dbc48fdf-3014-4a56-b8f3-1cefa783184f	2021-08-11 11:14:09.572127+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	759033ee-010f-4517-8506-b65d6ad11ee8	cca02cba-abd7-4001-8623-91aa9ab6402c	2021-08-11 11:32:09.362379+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	b620880f-3182-471f-88ed-2726bcebf800	dbc48fdf-3014-4a56-b8f3-1cefa783184f	2021-08-11 10:46:49.785925+00
7a90bccb-346e-4933-aaeb-cdef732be976	302234fb-76ed-42cd-b9d2-959f66e7bdff	0fcfc38e-cf8f-48c5-bec6-70814a885eb3	2021-08-11 04:41:05.83157+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	1b11054e-5c4d-4add-9e63-e72448846652	6a453f62-a2a0-476e-81cc-e52ddc91287f	2021-08-13 07:22:09.291759+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	d438642d-c090-43c5-9d22-2c4cedd787a4	549e45b9-5e73-4f5b-941a-24bf5e42ad65	2021-08-11 15:53:31.930849+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	ce8a900c-eab9-44c2-bf95-873272fa5e77	faac881f-8a62-469e-afdd-7bb20061ddae	2021-08-13 16:19:59.547878+00
7879f271-4036-48be-befb-f08de052bcdc	ddf30ba1-4908-409d-ab39-cf57d34d658e	006b5ef5-9cfd-41b3-94f0-4fc19ae033b1	2021-08-11 16:41:50.648572+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	b09018a0-a20b-4bd3-9852-e711754efbf5	9f88b614-b23d-4878-84ce-b6fde7ab8c63	2021-08-13 07:22:25.045254+00
7879f271-4036-48be-befb-f08de052bcdc	48f01dec-6f89-41eb-a461-5c8aed9b8c76	865e980c-a3fe-4851-a46d-eb52c4a6fed1	2021-08-15 14:43:37.27094+00
7879f271-4036-48be-befb-f08de052bcdc	5e1d4688-01f9-4040-8367-402d346492e5	ffd98f82-f176-4063-8a95-20ce5aa63d79	2021-08-12 17:25:51.000112+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	78dc049f-b901-4a54-8068-05f5e3c879b8	ade4de71-12dc-489d-8ed0-c51f7fc26644	2021-08-13 15:24:32.819829+00
7879f271-4036-48be-befb-f08de052bcdc	375b6658-2684-4295-83c8-09c5d062749d	2c960600-f1d9-47f6-81ef-ef3593fc5ea5	2021-08-15 14:46:53.744557+00
7879f271-4036-48be-befb-f08de052bcdc	8ef2ac54-7d44-4bfd-b897-f88ee920764e	4230fd13-f3b9-4c9b-9137-f0d403e4c60f	2021-08-15 14:52:05.413473+00
f30de478-b560-47f5-8588-8062ffc64a25	3339f5b6-bf9d-4e8c-a4b0-91a660ff93a5	d4560110-bb22-4cce-8ea7-a6ce07732ed7	2021-08-13 09:23:14.887012+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	8bdd2810-4147-4198-9008-67bdb770b440	a92b291f-15c8-4009-9a2e-36e8d896d6c6	2021-08-15 19:10:45.898572+00
f30de478-b560-47f5-8588-8062ffc64a25	44660c03-0bba-42df-b615-b3638a56d282	3120af3c-3255-4982-95c7-0ab6104e7a49	2021-08-13 13:57:57.145085+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	39b9b01b-8d3c-4ed5-b161-231d825b7f90	e69cf0a2-ef73-4048-9690-dab54353531e	2021-08-10 08:42:20.758414+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	b79e885e-41bd-4fd6-8fb1-9e04ef3424fa	bb4672b1-9b38-41ce-9c0d-9f9ef361b72c	2021-08-13 16:20:04.704074+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	6159e96d-a508-45e2-8868-345533482eed	0308ee84-9f2c-48bc-88aa-084eeadc570d	2021-08-10 13:19:17.679787+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	206b161d-acbf-4844-8946-2fa4981de272	fb3e1392-e2dd-4068-8cd9-cbfc2f670cc0	2021-08-13 09:12:15.419814+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	235faf89-59ed-4520-8957-38fbd49e2490	7eb738ce-9460-4db8-9284-fa210705c4d1	2021-08-12 09:06:06.092873+00
7879f271-4036-48be-befb-f08de052bcdc	302234fb-76ed-42cd-b9d2-959f66e7bdff	0fcfc38e-cf8f-48c5-bec6-70814a885eb3	2021-08-11 16:41:51.624614+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	1eeb42bc-106a-4487-bf2f-b78f948cddae	a210b0f1-5d55-45b6-98c0-949a90a8e741	2021-08-12 13:32:14.658715+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	52fe8757-21c1-4e21-b75f-c20bf1efdee4	b1f58e87-c038-4202-936e-de0ee5e90d66	2021-08-13 08:23:08.59126+00
ca652ee1-1423-42fe-a0ef-e5761a670845	25383b6c-859b-4656-8a24-da4d3110ec97	74b66224-3e40-4c0e-b092-275db0826ef9	2021-08-09 13:45:46.144344+00
7879f271-4036-48be-befb-f08de052bcdc	8819386c-658f-4629-9746-36de21ced530	a1e8d9ad-07b5-4805-8b92-e11d9799ac58	2021-08-15 14:43:33.986779+00
ca652ee1-1423-42fe-a0ef-e5761a670845	dced53b7-5ea8-453b-b0d2-8b1aa88e87fd	fe73ae76-ef33-4f90-a406-e86cf8d45eb2	2021-08-10 08:07:54.420054+00
7879f271-4036-48be-befb-f08de052bcdc	c9082d89-1383-4f85-9a06-b3e2a518eaf5	ade99b60-bc15-45cb-9899-4ee4819d5cf7	2021-08-15 14:46:58.052865+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	8819386c-658f-4629-9746-36de21ced530	a1e8d9ad-07b5-4805-8b92-e11d9799ac58	2021-08-13 08:26:55.946552+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	d3b9a5c5-04dd-4875-8440-b5726b3bb231	ebcd6f4b-87f6-4d4c-bd11-37a9ca334590	2021-08-11 12:43:55.2602+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	2afaa7d4-89ee-49ec-9391-dc10c7f9bd6c	4bb60ea6-5f3d-4192-8dba-add8365440bf	2021-08-13 08:27:34.707479+00
7879f271-4036-48be-befb-f08de052bcdc	447c3879-98b7-45f7-a978-77f20fc8c69a	5051bf3d-cd6e-470c-aa3a-58f9deb28349	2021-08-15 14:52:04.36854+00
ca652ee1-1423-42fe-a0ef-e5761a670845	2a2c495e-2921-45b6-9dd6-5c8245c63ea0	119384a7-a4b5-4181-b66f-4533d43dcb5d	2021-08-11 06:48:53.435775+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	52fe8757-21c1-4e21-b75f-c20bf1efdee4	b1f58e87-c038-4202-936e-de0ee5e90d66	2021-08-13 09:28:17.954439+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	759033ee-010f-4517-8506-b65d6ad11ee8	cca02cba-abd7-4001-8623-91aa9ab6402c	2021-08-11 12:55:20.530372+00
ca652ee1-1423-42fe-a0ef-e5761a670845	8819386c-658f-4629-9746-36de21ced530	a1e8d9ad-07b5-4805-8b92-e11d9799ac58	2021-08-13 08:47:32.55161+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	fafc97b7-182c-4bd6-87ac-d444592c2c54	71dfb5a6-7cba-4ae2-b796-fe222b363b14	2021-08-11 09:23:07.223026+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	c9d1165c-a8f3-496d-8825-74c1cf81684e	66afc351-67fb-459f-b76f-d0e635984579	2021-08-11 18:49:31.207403+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	67fc219e-072b-4b22-b295-0fd462aae098	309a68b4-40e6-401f-8039-9c7d1731bc73	2021-08-11 11:22:30.236434+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	add6498d-bbfa-4d87-b3da-ff3115179a0e	9f46ca90-5d75-4635-876e-ecf06bd3077f	2021-08-11 11:33:28.187508+00
f30de478-b560-47f5-8588-8062ffc64a25	e0a7b845-b083-4f2c-a93b-38bd9d04df10	c2a5ea37-6af1-404d-9706-9594b11d19ff	2021-08-13 14:39:25.06543+00
ca652ee1-1423-42fe-a0ef-e5761a670845	1b11054e-5c4d-4add-9e63-e72448846652	6a453f62-a2a0-476e-81cc-e52ddc91287f	2021-08-13 07:10:00.987845+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	cb2365c8-f314-4744-a80e-a709a02817f8	e3ea8bf1-0d92-4b99-9b20-705cc59ee304	2021-08-13 10:47:47.395669+00
7a90bccb-346e-4933-aaeb-cdef732be976	759033ee-010f-4517-8506-b65d6ad11ee8	cca02cba-abd7-4001-8623-91aa9ab6402c	2021-08-12 07:40:35.032995+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	dc512cc6-7ef4-489b-9187-45a8202156ad	8d05a368-f9eb-43b1-bea3-d1858cbde83c	2021-08-13 10:53:03.636531+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	28799055-2bf2-420e-b6fb-6cb332de30b4	6c37acfd-5f47-4c39-9cbd-b362bccc244f	2021-08-13 15:20:16.854798+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	055a8d84-dc22-4aad-8d37-adbe9e19545d	a7048445-6393-4b95-8f93-7bd598be71a5	2021-08-13 07:26:32.290323+00
f30de478-b560-47f5-8588-8062ffc64a25	17b401b9-004c-446d-8b31-c072c5ad870d	d9784f9f-da93-4980-9eff-a0dc6ab619a9	2021-08-09 07:55:43.883907+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	d8d2844e-e84c-4c27-a1d7-c3310afafda0	80bce362-8c08-4ae9-b060-ee4537ec0365	2021-08-10 08:42:31.471057+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	a442e7be-2447-493d-9403-78b4969d569c	bb488432-e80f-4c1d-b2e4-097ec108335c	2021-08-11 08:27:58.078835+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	7ef55206-4dc3-44f9-89f2-8f141237b3a7	4a007c82-5a78-4b18-ad5b-49b76ba93a18	2021-08-11 09:25:05.584204+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	199c2d94-5468-46a4-bdef-111304e7d005	4f1c8597-174d-4876-9e4c-91416e74c83b	2021-08-12 13:32:20.144418+00
7879f271-4036-48be-befb-f08de052bcdc	ba6f00ff-074e-41ab-b0f2-110e08b72e23	3441fd36-6f5d-40d1-a93e-681c27d99493	2021-08-11 16:41:53.900561+00
7879f271-4036-48be-befb-f08de052bcdc	3a5978db-27ab-471b-88cf-fd7431226e17	69464dec-6547-4dbf-a8bb-46554ca9f1cb	2021-08-11 16:41:59.79431+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	2d595a43-5d31-45d0-b38f-0323c78dc7cb	a200c8e2-ef10-4b96-937f-c2edf81a0f30	2021-08-11 12:35:41.302836+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	1b11054e-5c4d-4add-9e63-e72448846652	6a453f62-a2a0-476e-81cc-e52ddc91287f	2021-08-13 07:09:49.056314+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	59ebd84d-6382-43e3-b5ed-d5f6ef582f2c	ceede64f-114b-478d-9e04-6956e5d75853	2021-08-10 16:13:38.846064+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	61659450-ba26-43cf-bc54-dbdeee7a39c8	3e88d2aa-b217-48b2-9447-676ad71e7995	2021-08-13 08:27:34.721708+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	52fe8757-21c1-4e21-b75f-c20bf1efdee4	b1f58e87-c038-4202-936e-de0ee5e90d66	2021-08-13 14:30:23.743625+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	44660c03-0bba-42df-b615-b3638a56d282	dffc1b88-ad58-4596-a03d-9bfb36dae6e6	2021-08-13 08:22:41.183195+00
f30de478-b560-47f5-8588-8062ffc64a25	206b161d-acbf-4844-8946-2fa4981de272	fb3e1392-e2dd-4068-8cd9-cbfc2f670cc0	2021-08-12 17:41:34.330887+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	206b161d-acbf-4844-8946-2fa4981de272	fb3e1392-e2dd-4068-8cd9-cbfc2f670cc0	2021-08-12 17:42:31.507952+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	199c2d94-5468-46a4-bdef-111304e7d005	4f1c8597-174d-4876-9e4c-91416e74c83b	2021-08-11 16:55:00.980897+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	12aee6ec-e255-4446-b825-23a2dbdedcdd	c1be8837-8f97-405a-be74-e3d1b060317b	2021-08-12 12:24:49.411379+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	5e1d4688-01f9-4040-8367-402d346492e5	ffd98f82-f176-4063-8a95-20ce5aa63d79	2021-08-13 07:12:20.454859+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	3a2032b1-8190-47b2-84d6-28998118838d	763a6c67-a61f-4d3c-8272-d4cfb168f8c1	2021-08-13 08:22:48.708259+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	7d401447-9caf-4713-812c-f1072d277d5c	ad8a95e0-506d-4b12-8daf-bc47889ff6c2	2021-08-10 11:50:05.724298+00
7879f271-4036-48be-befb-f08de052bcdc	2a2c495e-2921-45b6-9dd6-5c8245c63ea0	119384a7-a4b5-4181-b66f-4533d43dcb5d	2021-08-10 11:50:29.33611+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	950ad578-3e05-4e73-aed4-25a21b5393ac	3578dfe7-b063-4b89-8575-890f3e409292	2021-08-11 12:43:50.068852+00
7879f271-4036-48be-befb-f08de052bcdc	b09018a0-a20b-4bd3-9852-e711754efbf5	9f88b614-b23d-4878-84ce-b6fde7ab8c63	2021-08-15 14:51:52.696141+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	3a5978db-27ab-471b-88cf-fd7431226e17	69464dec-6547-4dbf-a8bb-46554ca9f1cb	2021-08-11 12:55:39.198458+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	aa52c52f-fddc-45a4-945a-ed73947d74c9	fb3fe25b-7d81-43f8-96e6-0f68a87f722a	2021-08-13 08:24:19.074137+00
ca652ee1-1423-42fe-a0ef-e5761a670845	81146d99-7c5f-4b86-8826-de0b955093c1	0a95bf22-143d-4af9-9494-3b11e9ccd095	2021-08-12 06:58:02.655885+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	d2495640-61f5-4c4d-95ee-59999fe26f27	9571501e-cdc8-4e57-9c98-0edf0420a480	2021-08-13 15:27:57.024651+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	9752c7ba-94e3-4441-ae79-37118fcbd72e	41c81df6-c7b1-4b28-be4c-373127d128bd	2021-08-13 15:27:59.147318+00
7879f271-4036-48be-befb-f08de052bcdc	b79e885e-41bd-4fd6-8fb1-9e04ef3424fa	bb4672b1-9b38-41ce-9c0d-9f9ef361b72c	2021-08-15 14:53:38.325927+00
f30de478-b560-47f5-8588-8062ffc64a25	28799055-2bf2-420e-b6fb-6cb332de30b4	6c37acfd-5f47-4c39-9cbd-b362bccc244f	2021-08-13 15:41:45.630198+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	27395777-4065-4830-9c4b-65c7516a400a	b922c2cb-0f5e-4798-a2bd-a563e4cea905	2021-08-12 09:10:35.55948+00
7879f271-4036-48be-befb-f08de052bcdc	885eabe5-ee9d-4574-b03a-921865923f62	03c741c6-6a09-4433-bd2e-eb3099097c55	2021-08-15 14:53:46.612152+00
f30de478-b560-47f5-8588-8062ffc64a25	375b6658-2684-4295-83c8-09c5d062749d	2c960600-f1d9-47f6-81ef-ef3593fc5ea5	2021-08-13 15:41:50.853236+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	b09018a0-a20b-4bd3-9852-e711754efbf5	9f88b614-b23d-4878-84ce-b6fde7ab8c63	2021-08-13 09:34:12.603563+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	055a8d84-dc22-4aad-8d37-adbe9e19545d	a7048445-6393-4b95-8f93-7bd598be71a5	2021-08-13 09:34:42.772194+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	235faf89-59ed-4520-8957-38fbd49e2490	7eb738ce-9460-4db8-9284-fa210705c4d1	2021-08-12 15:52:19.495052+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	d167d1c7-ba53-42c5-ac8a-c07c204215c8	cca89c91-94d3-44fa-a131-de21bec52df4	2021-08-15 16:39:36.213662+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	b09018a0-a20b-4bd3-9852-e711754efbf5	9f88b614-b23d-4878-84ce-b6fde7ab8c63	2021-08-13 07:43:12.426232+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	daea1cc1-364d-4be3-a8d3-ba1259d61e54	73463e9c-de91-441b-9b5a-77865d78f570	2021-08-13 09:25:38.645753+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	a61bd1a0-ab6c-4c3d-8ef2-d90dd7b4ceef	ad804eb9-d31d-4311-aeeb-5e46de6e1802	2021-08-10 08:42:33.230975+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	6c291865-999e-4a1d-9588-5ad93cedbbf5	8d9baf3b-8190-49f1-8c53-854fc751ade6	2021-08-12 13:22:03.738878+00
7a90bccb-346e-4933-aaeb-cdef732be976	40464e44-d5df-48cb-b862-5a9b5d4ffa11	f2689615-7043-4f29-a4e7-a741aaec3f9e	2021-08-11 12:27:35.639807+00
7879f271-4036-48be-befb-f08de052bcdc	b620880f-3182-471f-88ed-2726bcebf800	dbc48fdf-3014-4a56-b8f3-1cefa783184f	2021-08-11 16:42:00.67393+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	81146d99-7c5f-4b86-8826-de0b955093c1	0a95bf22-143d-4af9-9494-3b11e9ccd095	2021-08-13 16:20:11.924261+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	3a5978db-27ab-471b-88cf-fd7431226e17	69464dec-6547-4dbf-a8bb-46554ca9f1cb	2021-08-13 08:27:02.308708+00
7a90bccb-346e-4933-aaeb-cdef732be976	ba6f00ff-074e-41ab-b0f2-110e08b72e23	3441fd36-6f5d-40d1-a93e-681c27d99493	2021-08-11 11:42:21.361386+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	8b62b6ad-fe39-40aa-b8b5-44284657b286	2075babd-77fa-4644-943d-2c1f9eb9e39c	2021-08-11 16:54:52.060818+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	27395777-4065-4830-9c4b-65c7516a400a	b922c2cb-0f5e-4798-a2bd-a563e4cea905	2021-08-11 12:52:55.88513+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	30337aa3-0269-42d8-9e6e-efac86a1db9e	bd8eb673-0a6b-428a-8af7-5d936dd16eec	2021-08-13 08:27:36.68786+00
ca652ee1-1423-42fe-a0ef-e5761a670845	759033ee-010f-4517-8506-b65d6ad11ee8	0bb3c6e3-45cc-4cd5-ae4a-bde4291d1cbf	2021-08-11 08:46:47.342202+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	8318452f-09bc-48ae-b89b-6c479ff3ce34	42765fd4-2d60-48f6-bf4a-6da85851d6e1	2021-08-13 07:10:47.348237+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	795d9351-a097-48a7-9c5a-7a0409341af4	42519d93-decc-4f6e-bfc7-b16922e00c34	2021-08-11 08:48:00.095976+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	52fe8757-21c1-4e21-b75f-c20bf1efdee4	b1f58e87-c038-4202-936e-de0ee5e90d66	2021-08-13 07:22:15.520998+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	8e7acfee-cfe9-4ec0-a9b8-14aae24e0fa9	766a653a-108a-4d3b-8138-e5392f3653e9	2021-08-11 09:54:29.660974+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	8819386c-658f-4629-9746-36de21ced530	a1e8d9ad-07b5-4805-8b92-e11d9799ac58	2021-08-13 12:45:32.812001+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	81146d99-7c5f-4b86-8826-de0b955093c1	0a95bf22-143d-4af9-9494-3b11e9ccd095	2021-08-12 09:09:09.405305+00
7879f271-4036-48be-befb-f08de052bcdc	d5e1da06-f141-4bff-8b38-d480bf6c0b80	b6c3b248-4483-4215-b5fd-16d235c34e0b	2021-08-12 17:27:41.443155+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	25522813-086e-4ef1-ad4b-eac1740a83eb	73be0a1b-f273-43d3-8c4d-c7ffec21d680	2021-08-11 08:27:59.332609+00
f30de478-b560-47f5-8588-8062ffc64a25	6159e96d-a508-45e2-8868-345533482eed	0308ee84-9f2c-48bc-88aa-084eeadc570d	2021-08-12 17:41:29.097262+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	44660c03-0bba-42df-b615-b3638a56d282	3120af3c-3255-4982-95c7-0ab6104e7a49	2021-08-13 14:45:42.921872+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	5e1d4688-01f9-4040-8367-402d346492e5	ffd98f82-f176-4063-8a95-20ce5aa63d79	2021-08-12 14:26:14.326824+00
f30de478-b560-47f5-8588-8062ffc64a25	d2495640-61f5-4c4d-95ee-59999fe26f27	9571501e-cdc8-4e57-9c98-0edf0420a480	2021-08-13 14:52:19.797621+00
f30de478-b560-47f5-8588-8062ffc64a25	9fa78080-867b-4e01-b60a-6f47b55c4b58	055d299c-3cbd-46ed-bb53-daa2ca8bf69c	2021-08-13 07:59:58.639798+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	8dac34bd-e5d0-4e88-97be-76ef1da6965a	3e7f4cb4-d26f-4d98-ace2-09d980921d00	2021-08-13 15:24:49.305061+00
7879f271-4036-48be-befb-f08de052bcdc	cb2365c8-f314-4744-a80e-a709a02817f8	e3ea8bf1-0d92-4b99-9b20-705cc59ee304	2021-08-15 14:52:37.863377+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	80439d52-b5f8-40d3-af3f-7947802431a3	421e4d37-7830-47d9-b417-d9c93876866d	2021-08-11 12:42:08.719232+00
7879f271-4036-48be-befb-f08de052bcdc	81146d99-7c5f-4b86-8826-de0b955093c1	0a95bf22-143d-4af9-9494-3b11e9ccd095	2021-08-15 14:53:47.711454+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	2a2c495e-2921-45b6-9dd6-5c8245c63ea0	119384a7-a4b5-4181-b66f-4533d43dcb5d	2021-08-10 11:45:04.656542+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	dab455dc-a825-4287-816a-29310bd8c38f	aed02ba8-4855-49ea-9d0e-646904ce5d5e	2021-08-11 12:43:59.690984+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	4225e883-1e99-4cab-9000-eee3c4dfd200	518786b5-b6a0-4c54-b3c5-6a16ecb1342f	2021-08-13 15:28:00.208011+00
f30de478-b560-47f5-8588-8062ffc64a25	8dac34bd-e5d0-4e88-97be-76ef1da6965a	3e7f4cb4-d26f-4d98-ace2-09d980921d00	2021-08-13 15:41:31.143476+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	9e0612da-7c2d-460b-aa24-b762d4202b88	c48eb244-5ab8-4ce2-9f41-d9b47c059a5a	2021-08-09 07:33:08.400938+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	ddf30ba1-4908-409d-ab39-cf57d34d658e	006b5ef5-9cfd-41b3-94f0-4fc19ae033b1	2021-08-11 08:49:01.486648+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	69e20f79-d685-4bf8-b21a-73dbbef108e2	3fbc70f0-c56f-40f9-886b-af0d4a7759fc	2021-08-11 07:20:13.103291+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	dab455dc-a825-4287-816a-29310bd8c38f	aed02ba8-4855-49ea-9d0e-646904ce5d5e	2021-08-11 07:20:29.386581+00
ca652ee1-1423-42fe-a0ef-e5761a670845	3a5978db-27ab-471b-88cf-fd7431226e17	a22a14a4-c4d8-47eb-a40e-234d11bb6af6	2021-08-11 07:20:46.504932+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	0558025b-be7f-429b-9736-4764a82933f0	0e310990-2e24-42cf-969a-0568f4657d07	2021-08-12 10:04:14.116884+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	1eeb42bc-106a-4487-bf2f-b78f948cddae	a210b0f1-5d55-45b6-98c0-949a90a8e741	2021-08-11 16:55:03.210697+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	dced53b7-5ea8-453b-b0d2-8b1aa88e87fd	fe73ae76-ef33-4f90-a406-e86cf8d45eb2	2021-08-11 12:44:11.610769+00
4d783a5d-2c91-4cc0-89f6-42d0b5d189c8	81146d99-7c5f-4b86-8826-de0b955093c1	0a95bf22-143d-4af9-9494-3b11e9ccd095	2021-08-12 11:06:31.172052+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	d0b8bf8e-dd2e-4e00-84f5-b6c3ca13ea2a	bb62ac7d-66a1-4621-89cc-c31c272d2e01	2021-08-11 12:50:58.165093+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	27187133-565c-4d11-9227-c8a068cdd154	af5e0272-de38-4b9f-9264-21d7327f61ce	2021-08-10 11:45:14.844403+00
7a90bccb-346e-4933-aaeb-cdef732be976	81146d99-7c5f-4b86-8826-de0b955093c1	0a95bf22-143d-4af9-9494-3b11e9ccd095	2021-08-11 13:05:12.568684+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	18982189-4823-414e-b456-65e09d1237fa	4fa1bbd6-15d4-43b6-8c86-7a9c9a77e3c2	2021-08-10 13:03:15.893049+00
f30de478-b560-47f5-8588-8062ffc64a25	9752c7ba-94e3-4441-ae79-37118fcbd72e	41c81df6-c7b1-4b28-be4c-373127d128bd	2021-08-13 14:52:30.559588+00
7879f271-4036-48be-befb-f08de052bcdc	a7e76ba5-9d54-4d3b-be5d-f74e782c6903	230ade3d-ad79-428b-871d-6022a6da40f7	2021-08-15 14:43:29.854069+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	206b161d-acbf-4844-8946-2fa4981de272	fb3e1392-e2dd-4068-8cd9-cbfc2f670cc0	2021-08-13 07:14:25.381848+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	cb2365c8-f314-4744-a80e-a709a02817f8	e3ea8bf1-0d92-4b99-9b20-705cc59ee304	2021-08-13 12:23:27.778323+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	67fc219e-072b-4b22-b295-0fd462aae098	309a68b4-40e6-401f-8039-9c7d1731bc73	2021-08-12 14:34:54.679606+00
f30de478-b560-47f5-8588-8062ffc64a25	5402f67d-3e1f-46df-a5de-71d8f162e9c6	87aa0a8f-0a0e-4599-9e09-e78b14a334da	2021-08-11 08:04:39.645693+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	e0a7b845-b083-4f2c-a93b-38bd9d04df10	c2a5ea37-6af1-404d-9706-9594b11d19ff	2021-08-13 15:02:58.067749+00
7879f271-4036-48be-befb-f08de052bcdc	4225e883-1e99-4cab-9000-eee3c4dfd200	518786b5-b6a0-4c54-b3c5-6a16ecb1342f	2021-08-15 14:53:27.853237+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	a3df9a5b-6188-4a59-b780-019b5897954c	993750d5-c564-4265-87d6-ff428191e27b	2021-08-13 12:59:05.416999+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	c9082d89-1383-4f85-9a06-b3e2a518eaf5	ade99b60-bc15-45cb-9899-4ee4819d5cf7	2021-08-13 09:55:42.143875+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	29f7bc2a-76ff-4f94-8cb1-1f11045297a1	8d2ed941-79c3-4319-89ad-1b98789f0ff1	2021-08-13 15:26:34.354097+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	6c291865-999e-4a1d-9588-5ad93cedbbf5	8d9baf3b-8190-49f1-8c53-854fc751ade6	2021-08-12 13:36:25.76994+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	8dac34bd-e5d0-4e88-97be-76ef1da6965a	3e7f4cb4-d26f-4d98-ace2-09d980921d00	2021-08-13 13:12:15.921225+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	b79e885e-41bd-4fd6-8fb1-9e04ef3424fa	bb4672b1-9b38-41ce-9c0d-9f9ef361b72c	2021-08-13 15:28:01.260385+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	48f01dec-6f89-41eb-a461-5c8aed9b8c76	865e980c-a3fe-4851-a46d-eb52c4a6fed1	2021-08-13 13:13:58.024166+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	e6fa7e76-533c-45fa-85b8-ecef973c3c00	5afdcfc6-441b-4f3a-a92e-7c058c17cdfd	2021-08-10 08:42:34.200757+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	dc512cc6-7ef4-489b-9187-45a8202156ad	8d05a368-f9eb-43b1-bea3-d1858cbde83c	2021-08-13 14:01:08.226623+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	885eabe5-ee9d-4574-b03a-921865923f62	03c741c6-6a09-4433-bd2e-eb3099097c55	2021-08-13 15:28:05.417478+00
f30de478-b560-47f5-8588-8062ffc64a25	ce8a900c-eab9-44c2-bf95-873272fa5e77	faac881f-8a62-469e-afdd-7bb20061ddae	2021-08-13 15:31:29.86498+00
f30de478-b560-47f5-8588-8062ffc64a25	fe1bcd9c-03c9-48e7-85c5-b4de3ade9287	c913c0f2-2363-4201-973c-8f078d82a21d	2021-08-09 11:16:32.373162+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	dab455dc-a825-4287-816a-29310bd8c38f	aed02ba8-4855-49ea-9d0e-646904ce5d5e	2021-08-10 06:57:29.176019+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	074089ce-2f23-49b6-bfa5-7b8b2f7a1f31	46b37065-1d1e-4e99-ba51-da879b5f3ccd	2021-08-11 15:09:21.485962+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	59add48e-eb2e-41cc-babf-e37172728fce	fe91b95b-4612-499e-acd4-7437c5a3dcc1	2021-08-10 10:48:25.329527+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	759033ee-010f-4517-8506-b65d6ad11ee8	cca02cba-abd7-4001-8623-91aa9ab6402c	2021-08-12 07:48:11.983767+00
f30de478-b560-47f5-8588-8062ffc64a25	b79e885e-41bd-4fd6-8fb1-9e04ef3424fa	bb4672b1-9b38-41ce-9c0d-9f9ef361b72c	2021-08-13 14:52:39.861285+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	ba6f00ff-074e-41ab-b0f2-110e08b72e23	3441fd36-6f5d-40d1-a93e-681c27d99493	2021-08-11 11:38:36.897059+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	bf3664b6-87c1-4932-9b2f-5cc5178c5fa0	b2b2c9b8-e886-4385-888d-e3b631ae77e8	2021-08-09 14:23:16.423117+00
7a90bccb-346e-4933-aaeb-cdef732be976	3a5978db-27ab-471b-88cf-fd7431226e17	69464dec-6547-4dbf-a8bb-46554ca9f1cb	2021-08-12 14:19:27.865524+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	a73e3d2e-2e84-4b85-8ade-7d8446010c86	c3e4aec1-a0a2-49ef-a9e8-bba1b199dfbd	2021-08-11 12:51:01.215873+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	2f38aa46-5517-4c9b-b060-81e3a2864bee	49cd8bf0-e55e-4a87-bfec-2d4dc3fa9b0a	2021-08-13 08:28:01.532489+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	3a5978db-27ab-471b-88cf-fd7431226e17	69464dec-6547-4dbf-a8bb-46554ca9f1cb	2021-08-11 12:55:32.912033+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	13041466-28d1-49be-9f9c-baea49780335	bba48c56-8d9a-47c1-8ffa-3b499b2496a7	2021-08-13 16:07:44.80985+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	44660c03-0bba-42df-b615-b3638a56d282	3120af3c-3255-4982-95c7-0ab6104e7a49	2021-08-13 12:57:33.003723+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	5402f67d-3e1f-46df-a5de-71d8f162e9c6	87aa0a8f-0a0e-4599-9e09-e78b14a334da	2021-08-11 07:08:51.527608+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	3a2032b1-8190-47b2-84d6-28998118838d	763a6c67-a61f-4d3c-8272-d4cfb168f8c1	2021-08-13 06:29:37.550325+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	6eaf91dc-0e6f-4760-a528-272403cdc422	300c98c8-2136-47f5-a738-d8e6eda86f4a	2021-08-13 12:59:00.246145+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	8b62b6ad-fe39-40aa-b8b5-44284657b286	93d96d24-752f-44f3-a664-7fded0195e15	2021-08-15 09:42:16.79817+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	a3df9a5b-6188-4a59-b780-019b5897954c	993750d5-c564-4265-87d6-ff428191e27b	2021-08-13 15:24:22.143776+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	61659450-ba26-43cf-bc54-dbdeee7a39c8	3e88d2aa-b217-48b2-9447-676ad71e7995	2021-08-10 08:42:34.915829+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	c5ec9832-9fac-4c5f-b44f-de7dacedf5da	6b6cd268-40da-4c91-8dc9-c386f82311fb	2021-08-13 15:31:06.776298+00
7a90bccb-346e-4933-aaeb-cdef732be976	5e1d4688-01f9-4040-8367-402d346492e5	ffd98f82-f176-4063-8a95-20ce5aa63d79	2021-08-12 14:38:03.364987+00
4d783a5d-2c91-4cc0-89f6-42d0b5d189c8	e0a7b845-b083-4f2c-a93b-38bd9d04df10	c2a5ea37-6af1-404d-9706-9594b11d19ff	2021-08-12 11:07:01.163337+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	12aee6ec-e255-4446-b825-23a2dbdedcdd	c1be8837-8f97-405a-be74-e3d1b060317b	2021-08-12 09:51:46.45288+00
f30de478-b560-47f5-8588-8062ffc64a25	59ebd84d-6382-43e3-b5ed-d5f6ef582f2c	ceede64f-114b-478d-9e04-6956e5d75853	2021-08-12 14:41:57.843675+00
7a90bccb-346e-4933-aaeb-cdef732be976	dc512cc6-7ef4-489b-9187-45a8202156ad	594e5dd8-9fe3-4650-8329-f421e891b0cf	2021-08-13 08:46:36.675901+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	9ba172a0-a1a7-4caa-a221-b8a2704e5a9c	7a3416fe-0729-42f9-b5b8-be52b18793d8	2021-08-11 15:01:38.621868+00
7879f271-4036-48be-befb-f08de052bcdc	c5ec9832-9fac-4c5f-b44f-de7dacedf5da	6b6cd268-40da-4c91-8dc9-c386f82311fb	2021-08-15 14:53:30.99474+00
f30de478-b560-47f5-8588-8062ffc64a25	1f144355-4143-4f39-8331-d688eed9a1b8	d1039854-3d2e-4b25-90c2-2ed8e23a66f7	2021-08-12 17:41:12.652661+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	f927973b-9861-482c-92b6-390df01bf193	38f8a6ff-a80f-4c8f-99a3-50869722006a	2021-08-09 08:00:59.351611+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	59ebd84d-6382-43e3-b5ed-d5f6ef582f2c	ceede64f-114b-478d-9e04-6956e5d75853	2021-08-11 09:56:05.960768+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	6eaf91dc-0e6f-4760-a528-272403cdc422	300c98c8-2136-47f5-a738-d8e6eda86f4a	2021-08-13 09:08:44.289512+00
ca652ee1-1423-42fe-a0ef-e5761a670845	d5e1da06-f141-4bff-8b38-d480bf6c0b80	b6c3b248-4483-4215-b5fd-16d235c34e0b	2021-08-13 04:00:55.760153+00
ca652ee1-1423-42fe-a0ef-e5761a670845	d86f2de5-853a-435a-ac57-dfc200e6a846	dc9029ba-80c2-46e2-a174-cda085fda710	2021-08-13 04:01:13.887452+00
7a90bccb-346e-4933-aaeb-cdef732be976	8dac34bd-e5d0-4e88-97be-76ef1da6965a	80742c12-3fb4-4724-990d-d0e6dff3f916	2021-08-13 09:45:32.548431+00
7879f271-4036-48be-befb-f08de052bcdc	ce8a900c-eab9-44c2-bf95-873272fa5e77	faac881f-8a62-469e-afdd-7bb20061ddae	2021-08-15 14:53:39.299378+00
ca652ee1-1423-42fe-a0ef-e5761a670845	5e1d4688-01f9-4040-8367-402d346492e5	ffd98f82-f176-4063-8a95-20ce5aa63d79	2021-08-13 04:04:16.130898+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	add6498d-bbfa-4d87-b3da-ff3115179a0e	9f46ca90-5d75-4635-876e-ecf06bd3077f	2021-08-10 18:30:54.509855+00
ca652ee1-1423-42fe-a0ef-e5761a670845	302234fb-76ed-42cd-b9d2-959f66e7bdff	0fcfc38e-cf8f-48c5-bec6-70814a885eb3	2021-08-11 06:54:14.31745+00
ca652ee1-1423-42fe-a0ef-e5761a670845	ba6f00ff-074e-41ab-b0f2-110e08b72e23	2bc7f4ec-677d-499a-8165-17bbadaff44a	2021-08-11 06:54:44.481288+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	8ef2ac54-7d44-4bfd-b897-f88ee920764e	4230fd13-f3b9-4c9b-9137-f0d403e4c60f	2021-08-13 08:28:26.966172+00
ca652ee1-1423-42fe-a0ef-e5761a670845	7ef55206-4dc3-44f9-89f2-8f141237b3a7	4a007c82-5a78-4b18-ad5b-49b76ba93a18	2021-08-11 06:54:53.067336+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	302234fb-76ed-42cd-b9d2-959f66e7bdff	0fcfc38e-cf8f-48c5-bec6-70814a885eb3	2021-08-11 08:49:48.625772+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	2afaa7d4-89ee-49ec-9391-dc10c7f9bd6c	4bb60ea6-5f3d-4192-8dba-add8365440bf	2021-08-11 11:38:45.614864+00
f30de478-b560-47f5-8588-8062ffc64a25	81146d99-7c5f-4b86-8826-de0b955093c1	0a95bf22-143d-4af9-9494-3b11e9ccd095	2021-08-13 14:39:13.345145+00
4d783a5d-2c91-4cc0-89f6-42d0b5d189c8	44660c03-0bba-42df-b615-b3638a56d282	dffc1b88-ad58-4596-a03d-9bfb36dae6e6	2021-08-12 11:18:28.245549+00
4d783a5d-2c91-4cc0-89f6-42d0b5d189c8	447c3879-98b7-45f7-a978-77f20fc8c69a	b640d13f-68c7-4ea2-8f23-eb3aef27e860	2021-08-12 11:19:09.640689+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	5402f67d-3e1f-46df-a5de-71d8f162e9c6	87aa0a8f-0a0e-4599-9e09-e78b14a334da	2021-08-11 07:34:11.877282+00
f30de478-b560-47f5-8588-8062ffc64a25	52fe8757-21c1-4e21-b75f-c20bf1efdee4	b1f58e87-c038-4202-936e-de0ee5e90d66	2021-08-13 07:11:42.909379+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	d86f2de5-853a-435a-ac57-dfc200e6a846	dc9029ba-80c2-46e2-a174-cda085fda710	2021-08-13 09:13:49.069991+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	3a2032b1-8190-47b2-84d6-28998118838d	763a6c67-a61f-4d3c-8272-d4cfb168f8c1	2021-08-13 07:27:00.15659+00
f30de478-b560-47f5-8588-8062ffc64a25	885eabe5-ee9d-4574-b03a-921865923f62	03c741c6-6a09-4433-bd2e-eb3099097c55	2021-08-13 14:52:45.013788+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	d86f2de5-853a-435a-ac57-dfc200e6a846	dc9029ba-80c2-46e2-a174-cda085fda710	2021-08-11 13:22:44.387593+00
7a90bccb-346e-4933-aaeb-cdef732be976	29f7bc2a-76ff-4f94-8cb1-1f11045297a1	b7ae015d-c012-4d15-ac3e-6b627ce13b0c	2021-08-13 10:00:57.82136+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	28799055-2bf2-420e-b6fb-6cb332de30b4	6c37acfd-5f47-4c39-9cbd-b362bccc244f	2021-08-13 15:31:48.857839+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	17b401b9-004c-446d-8b31-c072c5ad870d	d9784f9f-da93-4980-9eff-a0dc6ab619a9	2021-08-12 09:24:00.525178+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	78dc049f-b901-4a54-8068-05f5e3c879b8	ade4de71-12dc-489d-8ed0-c51f7fc26644	2021-08-13 12:59:22.551448+00
f30de478-b560-47f5-8588-8062ffc64a25	6eaf91dc-0e6f-4760-a528-272403cdc422	300c98c8-2136-47f5-a738-d8e6eda86f4a	2021-08-13 15:41:16.281817+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	b7330847-fe0d-4446-83b1-a989f47a959e	65f814cc-bbe8-40cc-b382-19485fc80501	2021-08-12 15:51:26.697617+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	5e1d4688-01f9-4040-8367-402d346492e5	ffd98f82-f176-4063-8a95-20ce5aa63d79	2021-08-12 14:19:06.078673+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	6f4d0bba-4553-4747-bd7b-0f91ab5617a2	f92b5c30-83a1-44a9-a1b7-17121f3e02a5	2021-08-12 15:52:16.077546+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	2afaa7d4-89ee-49ec-9391-dc10c7f9bd6c	4bb60ea6-5f3d-4192-8dba-add8365440bf	2021-08-10 08:42:38.16559+00
ca652ee1-1423-42fe-a0ef-e5761a670845	a7e76ba5-9d54-4d3b-be5d-f74e782c6903	3e2fb17c-0c8a-4c7a-89d0-cbaf12929938	2021-08-13 04:01:35.578794+00
7879f271-4036-48be-befb-f08de052bcdc	28799055-2bf2-420e-b6fb-6cb332de30b4	6c37acfd-5f47-4c39-9cbd-b362bccc244f	2021-08-15 14:53:32.20596+00
7879f271-4036-48be-befb-f08de052bcdc	d2495640-61f5-4c4d-95ee-59999fe26f27	9571501e-cdc8-4e57-9c98-0edf0420a480	2021-08-15 14:53:33.134705+00
7879f271-4036-48be-befb-f08de052bcdc	9752c7ba-94e3-4441-ae79-37118fcbd72e	41c81df6-c7b1-4b28-be4c-373127d128bd	2021-08-15 14:53:36.166468+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	3339f5b6-bf9d-4e8c-a4b0-91a660ff93a5	d4560110-bb22-4cce-8ea7-a6ce07732ed7	2021-08-09 11:19:10.015083+00
ca652ee1-1423-42fe-a0ef-e5761a670845	2d595a43-5d31-45d0-b38f-0323c78dc7cb	838fed91-36ee-486d-b037-90f56262d1ed	2021-08-11 06:54:18.552081+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	dced53b7-5ea8-453b-b0d2-8b1aa88e87fd	fe73ae76-ef33-4f90-a406-e86cf8d45eb2	2021-08-11 07:19:09.01157+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	5402f67d-3e1f-46df-a5de-71d8f162e9c6	87aa0a8f-0a0e-4599-9e09-e78b14a334da	2021-08-11 07:44:38.564022+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	67fc219e-072b-4b22-b295-0fd462aae098	309a68b4-40e6-401f-8039-9c7d1731bc73	2021-08-11 11:20:21.400011+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	ba6f00ff-074e-41ab-b0f2-110e08b72e23	3441fd36-6f5d-40d1-a93e-681c27d99493	2021-08-11 11:33:16.148433+00
f30de478-b560-47f5-8588-8062ffc64a25	055a8d84-dc22-4aad-8d37-adbe9e19545d	a7048445-6393-4b95-8f93-7bd598be71a5	2021-08-13 07:12:02.144796+00
7a90bccb-346e-4933-aaeb-cdef732be976	9ba172a0-a1a7-4caa-a221-b8a2704e5a9c	96deee14-836f-40ba-a0e4-c47598a43444	2021-08-11 08:47:45.822342+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	235faf89-59ed-4520-8957-38fbd49e2490	7eb738ce-9460-4db8-9284-fa210705c4d1	2021-08-11 12:54:09.51577+00
7a90bccb-346e-4933-aaeb-cdef732be976	6eaf91dc-0e6f-4760-a528-272403cdc422	300c98c8-2136-47f5-a738-d8e6eda86f4a	2021-08-13 10:00:48.62859+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	9ba172a0-a1a7-4caa-a221-b8a2704e5a9c	7a3416fe-0729-42f9-b5b8-be52b18793d8	2021-08-11 16:29:51.510686+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	8318452f-09bc-48ae-b89b-6c479ff3ce34	42765fd4-2d60-48f6-bf4a-6da85851d6e1	2021-08-13 08:22:50.714226+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	27187133-565c-4d11-9227-c8a068cdd154	af5e0272-de38-4b9f-9264-21d7327f61ce	2021-08-11 08:52:50.012187+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	c5ec9832-9fac-4c5f-b44f-de7dacedf5da	6b6cd268-40da-4c91-8dc9-c386f82311fb	2021-08-15 09:42:05.375198+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	074089ce-2f23-49b6-bfa5-7b8b2f7a1f31	46b37065-1d1e-4e99-ba51-da879b5f3ccd	2021-08-12 07:48:57.28695+00
7879f271-4036-48be-befb-f08de052bcdc	52fe8757-21c1-4e21-b75f-c20bf1efdee4	b1f58e87-c038-4202-936e-de0ee5e90d66	2021-08-15 14:51:54.70915+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	6eaf91dc-0e6f-4760-a528-272403cdc422	300c98c8-2136-47f5-a738-d8e6eda86f4a	2021-08-13 15:24:17.89649+00
f30de478-b560-47f5-8588-8062ffc64a25	16571812-9e72-46d0-8568-cf402abd1f5e	0a66a977-a400-4070-896c-652b1652f581	2021-08-13 12:02:36.68529+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	795d9351-a097-48a7-9c5a-7a0409341af4	42519d93-decc-4f6e-bfc7-b16922e00c34	2021-08-12 13:37:01.673741+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	9fa70a66-1e09-4dc4-b5da-4fd46e6f3cb4	3e53926f-1c72-45dd-9c60-017daf996ae2	2021-08-10 08:22:43.815105+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	4225e883-1e99-4cab-9000-eee3c4dfd200	518786b5-b6a0-4c54-b3c5-6a16ecb1342f	2021-08-13 15:40:26.450623+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	950ad578-3e05-4e73-aed4-25a21b5393ac	3578dfe7-b063-4b89-8575-890f3e409292	2021-08-13 12:25:09.905112+00
4d783a5d-2c91-4cc0-89f6-42d0b5d189c8	6c291865-999e-4a1d-9588-5ad93cedbbf5	663c1a9c-2f74-4daa-87d0-89ec5de97d39	2021-08-12 11:19:01.901391+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	8dac34bd-e5d0-4e88-97be-76ef1da6965a	3e7f4cb4-d26f-4d98-ace2-09d980921d00	2021-08-13 15:40:30.641577+00
4d783a5d-2c91-4cc0-89f6-42d0b5d189c8	810dbc47-af96-4c1b-bdbd-b1dcd6aa4322	f592244f-6b57-4bdf-8152-b0a3c595d03c	2021-08-12 11:19:59.865183+00
f30de478-b560-47f5-8588-8062ffc64a25	6f4d0bba-4553-4747-bd7b-0f91ab5617a2	f92b5c30-83a1-44a9-a1b7-17121f3e02a5	2021-08-12 16:01:25.13694+00
7a90bccb-346e-4933-aaeb-cdef732be976	a7e76ba5-9d54-4d3b-be5d-f74e782c6903	d5c2d3f4-41ba-494f-bd5c-8094d6ab6dd8	2021-08-13 09:00:19.601928+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	aa52c52f-fddc-45a4-945a-ed73947d74c9	fb3fe25b-7d81-43f8-96e6-0f68a87f722a	2021-08-10 14:38:44.621377+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	9fa70a66-1e09-4dc4-b5da-4fd46e6f3cb4	3e53926f-1c72-45dd-9c60-017daf996ae2	2021-08-10 08:46:59.35765+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	e0a7b845-b083-4f2c-a93b-38bd9d04df10	c2a5ea37-6af1-404d-9706-9594b11d19ff	2021-08-13 16:20:19.24511+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	6eaf91dc-0e6f-4760-a528-272403cdc422	300c98c8-2136-47f5-a738-d8e6eda86f4a	2021-08-13 11:19:18.035297+00
4d783a5d-2c91-4cc0-89f6-42d0b5d189c8	3a2032b1-8190-47b2-84d6-28998118838d	5a8e9fa8-ccf5-4d75-a4ec-fea182f28b15	2021-08-12 11:18:58.579543+00
7879f271-4036-48be-befb-f08de052bcdc	6f4d0bba-4553-4747-bd7b-0f91ab5617a2	f92b5c30-83a1-44a9-a1b7-17121f3e02a5	2021-08-12 14:13:46.067298+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	9752c7ba-94e3-4441-ae79-37118fcbd72e	41c81df6-c7b1-4b28-be4c-373127d128bd	2021-08-13 14:53:01.975126+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	cb2365c8-f314-4744-a80e-a709a02817f8	e3ea8bf1-0d92-4b99-9b20-705cc59ee304	2021-08-13 08:31:30.569776+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	368d5a03-d0f1-4af7-9ce4-dc55cb7571a3	ebb06fd7-d31f-4142-8be4-502c85cf1dde	2021-08-11 15:09:05.282003+00
7879f271-4036-48be-befb-f08de052bcdc	40464e44-d5df-48cb-b862-5a9b5d4ffa11	f2689615-7043-4f29-a4e7-a741aaec3f9e	2021-08-11 12:28:33.738725+00
f30de478-b560-47f5-8588-8062ffc64a25	40464e44-d5df-48cb-b862-5a9b5d4ffa11	f2689615-7043-4f29-a4e7-a741aaec3f9e	2021-08-11 12:28:34.638881+00
ca652ee1-1423-42fe-a0ef-e5761a670845	27187133-565c-4d11-9227-c8a068cdd154	af5e0272-de38-4b9f-9264-21d7327f61ce	2021-08-11 06:54:35.92962+00
f30de478-b560-47f5-8588-8062ffc64a25	d86f2de5-853a-435a-ac57-dfc200e6a846	dc9029ba-80c2-46e2-a174-cda085fda710	2021-08-12 14:40:45.732966+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	c9d1165c-a8f3-496d-8825-74c1cf81684e	66afc351-67fb-459f-b76f-d0e635984579	2021-08-11 16:41:15.281365+00
7a90bccb-346e-4933-aaeb-cdef732be976	8318452f-09bc-48ae-b89b-6c479ff3ce34	201a839f-b202-4547-8289-b57db527a062	2021-08-10 13:07:51.615965+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	52fba8d8-7964-4248-a182-c72798e80be5	dd86731f-1f8b-47e3-8b1a-da973b40d38f	2021-08-11 07:21:31.703894+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	b7330847-fe0d-4446-83b1-a989f47a959e	65f814cc-bbe8-40cc-b382-19485fc80501	2021-08-13 09:12:01.212943+00
7879f271-4036-48be-befb-f08de052bcdc	368d5a03-d0f1-4af7-9ce4-dc55cb7571a3	ebb06fd7-d31f-4142-8be4-502c85cf1dde	2021-08-11 11:54:15.611399+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	368d5a03-d0f1-4af7-9ce4-dc55cb7571a3	ebb06fd7-d31f-4142-8be4-502c85cf1dde	2021-08-11 18:48:58.927881+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	ba6f00ff-074e-41ab-b0f2-110e08b72e23	3441fd36-6f5d-40d1-a93e-681c27d99493	2021-08-11 12:36:12.615523+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	13041466-28d1-49be-9f9c-baea49780335	e3cfd42a-f73a-4d84-a1a5-f6f52bb3ec26	2021-08-13 13:12:09.640743+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	81146d99-7c5f-4b86-8826-de0b955093c1	0a95bf22-143d-4af9-9494-3b11e9ccd095	2021-08-13 09:25:17.010737+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	48f01dec-6f89-41eb-a461-5c8aed9b8c76	f713bf4e-6aa0-4014-846c-1d7e8489487c	2021-08-13 09:25:32.202758+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	b09018a0-a20b-4bd3-9852-e711754efbf5	9f88b614-b23d-4878-84ce-b6fde7ab8c63	2021-08-13 08:06:19.62109+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	a7e76ba5-9d54-4d3b-be5d-f74e782c6903	230ade3d-ad79-428b-871d-6022a6da40f7	2021-08-13 12:30:21.803972+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	759033ee-010f-4517-8506-b65d6ad11ee8	0bb3c6e3-45cc-4cd5-ae4a-bde4291d1cbf	2021-08-11 07:22:32.161602+00
f30de478-b560-47f5-8588-8062ffc64a25	d7046540-e347-43df-bd08-49e5a13cc30e	4fb18e0c-1012-4601-a72b-de01fbaa9848	2021-08-11 10:03:32.372848+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	1f144355-4143-4f39-8331-d688eed9a1b8	d1039854-3d2e-4b25-90c2-2ed8e23a66f7	2021-08-13 09:12:17.508959+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	c9d1165c-a8f3-496d-8825-74c1cf81684e	66afc351-67fb-459f-b76f-d0e635984579	2021-08-12 07:26:26.709539+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	44660c03-0bba-42df-b615-b3638a56d282	3120af3c-3255-4982-95c7-0ab6104e7a49	2021-08-13 09:23:14.874182+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	9ba172a0-a1a7-4caa-a221-b8a2704e5a9c	7a3416fe-0729-42f9-b5b8-be52b18793d8	2021-08-12 07:31:40.333388+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	375b6658-2684-4295-83c8-09c5d062749d	2c960600-f1d9-47f6-81ef-ef3593fc5ea5	2021-08-13 10:42:47.839085+00
f30de478-b560-47f5-8588-8062ffc64a25	67fc219e-072b-4b22-b295-0fd462aae098	309a68b4-40e6-401f-8039-9c7d1731bc73	2021-08-12 14:43:43.560473+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	2f38aa46-5517-4c9b-b060-81e3a2864bee	49cd8bf0-e55e-4a87-bfec-2d4dc3fa9b0a	2021-08-13 09:23:18.309623+00
ca652ee1-1423-42fe-a0ef-e5761a670845	27395777-4065-4830-9c4b-65c7516a400a	b922c2cb-0f5e-4798-a2bd-a563e4cea905	2021-08-13 08:37:31.674318+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	7da19367-6883-4946-b4e6-789744d03b89	2fce887d-ac35-4ed0-b153-1268d3d11783	2021-08-11 09:12:22.096578+00
7879f271-4036-48be-befb-f08de052bcdc	d438642d-c090-43c5-9d22-2c4cedd787a4	549e45b9-5e73-4f5b-941a-24bf5e42ad65	2021-08-11 21:23:37.738732+00
7a90bccb-346e-4933-aaeb-cdef732be976	67fc219e-072b-4b22-b295-0fd462aae098	309a68b4-40e6-401f-8039-9c7d1731bc73	2021-08-11 08:47:47.094738+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	6159e96d-a508-45e2-8868-345533482eed	0308ee84-9f2c-48bc-88aa-084eeadc570d	2021-08-10 07:15:07.661925+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	0558025b-be7f-429b-9736-4764a82933f0	0e310990-2e24-42cf-969a-0568f4657d07	2021-08-12 10:24:00.79685+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	2a2c495e-2921-45b6-9dd6-5c8245c63ea0	119384a7-a4b5-4181-b66f-4533d43dcb5d	2021-08-11 08:53:05.87505+00
4d783a5d-2c91-4cc0-89f6-42d0b5d189c8	52fe8757-21c1-4e21-b75f-c20bf1efdee4	b1f58e87-c038-4202-936e-de0ee5e90d66	2021-08-12 11:20:30.517415+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	8dac34bd-e5d0-4e88-97be-76ef1da6965a	3e7f4cb4-d26f-4d98-ace2-09d980921d00	2021-08-13 15:23:32.641152+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	5e1d4688-01f9-4040-8367-402d346492e5	ffd98f82-f176-4063-8a95-20ce5aa63d79	2021-08-12 15:51:12.715261+00
7a90bccb-346e-4933-aaeb-cdef732be976	a3df9a5b-6188-4a59-b780-019b5897954c	993750d5-c564-4265-87d6-ff428191e27b	2021-08-13 12:31:59.362235+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	e6fa7e76-533c-45fa-85b8-ecef973c3c00	5afdcfc6-441b-4f3a-a92e-7c058c17cdfd	2021-08-08 08:52:46.317425+00
7879f271-4036-48be-befb-f08de052bcdc	074089ce-2f23-49b6-bfa5-7b8b2f7a1f31	46b37065-1d1e-4e99-ba51-da879b5f3ccd	2021-08-11 16:03:00.459074+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	8b62b6ad-fe39-40aa-b8b5-44284657b286	93d96d24-752f-44f3-a664-7fded0195e15	2021-08-13 13:12:11.622084+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	78dc049f-b901-4a54-8068-05f5e3c879b8	ade4de71-12dc-489d-8ed0-c51f7fc26644	2021-08-13 13:48:49.519486+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	6159e96d-a508-45e2-8868-345533482eed	0308ee84-9f2c-48bc-88aa-084eeadc570d	2021-08-10 06:44:23.08637+00
7879f271-4036-48be-befb-f08de052bcdc	27187133-565c-4d11-9227-c8a068cdd154	af5e0272-de38-4b9f-9264-21d7327f61ce	2021-08-10 11:33:25.757775+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	27187133-565c-4d11-9227-c8a068cdd154	af5e0272-de38-4b9f-9264-21d7327f61ce	2021-08-10 11:47:47.388705+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	e0a7b845-b083-4f2c-a93b-38bd9d04df10	c2a5ea37-6af1-404d-9706-9594b11d19ff	2021-08-11 12:55:10.511936+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	add6498d-bbfa-4d87-b3da-ff3115179a0e	9f46ca90-5d75-4635-876e-ecf06bd3077f	2021-08-11 08:53:19.172871+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	d86f2de5-853a-435a-ac57-dfc200e6a846	dc9029ba-80c2-46e2-a174-cda085fda710	2021-08-13 07:09:42.548611+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	7da19367-6883-4946-b4e6-789744d03b89	2fce887d-ac35-4ed0-b153-1268d3d11783	2021-08-11 08:39:42.900162+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	48f01dec-6f89-41eb-a461-5c8aed9b8c76	865e980c-a3fe-4851-a46d-eb52c4a6fed1	2021-08-15 19:41:24.220657+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	5402f67d-3e1f-46df-a5de-71d8f162e9c6	87aa0a8f-0a0e-4599-9e09-e78b14a334da	2021-08-11 07:32:51.290225+00
7a90bccb-346e-4933-aaeb-cdef732be976	6c291865-999e-4a1d-9588-5ad93cedbbf5	8d9baf3b-8190-49f1-8c53-854fc751ade6	2021-08-12 13:19:15.816185+00
7a90bccb-346e-4933-aaeb-cdef732be976	59ebd84d-6382-43e3-b5ed-d5f6ef582f2c	ceede64f-114b-478d-9e04-6956e5d75853	2021-08-11 09:25:25.44911+00
f30de478-b560-47f5-8588-8062ffc64a25	a3df9a5b-6188-4a59-b780-019b5897954c	993750d5-c564-4265-87d6-ff428191e27b	2021-08-13 15:41:18.208155+00
4d783a5d-2c91-4cc0-89f6-42d0b5d189c8	6f4d0bba-4553-4747-bd7b-0f91ab5617a2	72744539-87a8-4e2a-903c-5259a7eabd98	2021-08-12 11:30:45.108581+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	1f144355-4143-4f39-8331-d688eed9a1b8	d1039854-3d2e-4b25-90c2-2ed8e23a66f7	2021-08-11 14:03:12.736387+00
f30de478-b560-47f5-8588-8062ffc64a25	78dc049f-b901-4a54-8068-05f5e3c879b8	ade4de71-12dc-489d-8ed0-c51f7fc26644	2021-08-13 15:41:20.288893+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	375b6658-2684-4295-83c8-09c5d062749d	2c960600-f1d9-47f6-81ef-ef3593fc5ea5	2021-08-13 13:12:46.053705+00
f30de478-b560-47f5-8588-8062ffc64a25	c9d1165c-a8f3-496d-8825-74c1cf81684e	66afc351-67fb-459f-b76f-d0e635984579	2021-08-12 17:41:01.292758+00
69324499-ae41-4ce4-bdaa-6072e0e5c2d3	2d595a43-5d31-45d0-b38f-0323c78dc7cb	a200c8e2-ef10-4b96-937f-c2edf81a0f30	2021-08-11 11:48:50.635191+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	78dc049f-b901-4a54-8068-05f5e3c879b8	ade4de71-12dc-489d-8ed0-c51f7fc26644	2021-08-13 10:52:18.007534+00
ca652ee1-1423-42fe-a0ef-e5761a670845	52fe8757-21c1-4e21-b75f-c20bf1efdee4	b1f58e87-c038-4202-936e-de0ee5e90d66	2021-08-13 08:51:17.034788+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	aa52c52f-fddc-45a4-945a-ed73947d74c9	fb3fe25b-7d81-43f8-96e6-0f68a87f722a	2021-08-10 14:31:06.817787+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	d8d2844e-e84c-4c27-a1d7-c3310afafda0	80bce362-8c08-4ae9-b060-ee4537ec0365	2021-08-11 08:53:44.710584+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	6c291865-999e-4a1d-9588-5ad93cedbbf5	8d9baf3b-8190-49f1-8c53-854fc751ade6	2021-08-12 13:25:28.974536+00
7a90bccb-346e-4933-aaeb-cdef732be976	27187133-565c-4d11-9227-c8a068cdd154	af5e0272-de38-4b9f-9264-21d7327f61ce	2021-08-10 14:49:55.908828+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	78dc049f-b901-4a54-8068-05f5e3c879b8	ade4de71-12dc-489d-8ed0-c51f7fc26644	2021-08-13 11:19:13.664982+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	6f4d0bba-4553-4747-bd7b-0f91ab5617a2	f92b5c30-83a1-44a9-a1b7-17121f3e02a5	2021-08-12 15:54:04.918882+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	7da19367-6883-4946-b4e6-789744d03b89	2fce887d-ac35-4ed0-b153-1268d3d11783	2021-08-11 11:32:40.874578+00
7a90bccb-346e-4933-aaeb-cdef732be976	d86f2de5-853a-435a-ac57-dfc200e6a846	dc9029ba-80c2-46e2-a174-cda085fda710	2021-08-11 09:24:57.643989+00
ca652ee1-1423-42fe-a0ef-e5761a670845	4260972d-58a7-41bc-8ebb-a2c94c6cbe8c	c93e721c-241e-4be8-8e9a-49ff42c48b0b	2021-08-13 10:32:39.513254+00
ca652ee1-1423-42fe-a0ef-e5761a670845	b09018a0-a20b-4bd3-9852-e711754efbf5	9f88b614-b23d-4878-84ce-b6fde7ab8c63	2021-08-13 08:40:35.589568+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	87b6097f-6232-43f6-a3a8-0e1c3104212d	9f37bd8c-44be-4d4d-a48d-5f573f7f7909	2021-08-11 15:31:45.194137+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	87b6097f-6232-43f6-a3a8-0e1c3104212d	9f37bd8c-44be-4d4d-a48d-5f573f7f7909	2021-08-11 18:49:11.719247+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	40464e44-d5df-48cb-b862-5a9b5d4ffa11	f2689615-7043-4f29-a4e7-a741aaec3f9e	2021-08-13 07:10:44.983166+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	40464e44-d5df-48cb-b862-5a9b5d4ffa11	f2689615-7043-4f29-a4e7-a741aaec3f9e	2021-08-13 08:42:16.671972+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	8bdd2810-4147-4198-9008-67bdb770b440	a5126690-8fd7-4714-a038-f6d81c7036b2	2021-08-13 13:13:56.89052+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	9fa70a66-1e09-4dc4-b5da-4fd46e6f3cb4	3e53926f-1c72-45dd-9c60-017daf996ae2	2021-08-10 08:49:14.998002+00
7a90bccb-346e-4933-aaeb-cdef732be976	795d9351-a097-48a7-9c5a-7a0409341af4	42519d93-decc-4f6e-bfc7-b16922e00c34	2021-08-10 14:20:06.886518+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	dd805776-a22f-4897-891a-46ebc6fb4725	48bc50a5-2527-4787-9180-0d59eb28d879	2021-08-11 10:10:25.245279+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	1f144355-4143-4f39-8331-d688eed9a1b8	d1039854-3d2e-4b25-90c2-2ed8e23a66f7	2021-08-12 07:26:36.954722+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	0558025b-be7f-429b-9736-4764a82933f0	0e310990-2e24-42cf-969a-0568f4657d07	2021-08-12 11:39:12.270559+00
f30de478-b560-47f5-8588-8062ffc64a25	7da19367-6883-4946-b4e6-789744d03b89	2fce887d-ac35-4ed0-b153-1268d3d11783	2021-08-12 17:41:31.18075+00
ca652ee1-1423-42fe-a0ef-e5761a670845	074089ce-2f23-49b6-bfa5-7b8b2f7a1f31	46b37065-1d1e-4e99-ba51-da879b5f3ccd	2021-08-12 06:55:33.89439+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	7fe5f795-13fb-4cb0-b888-a06f3ddf6cac	a9d46b6e-a172-43fe-9ade-e79f2b1cff15	2021-08-09 14:26:52.653705+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	3a5978db-27ab-471b-88cf-fd7431226e17	69464dec-6547-4dbf-a8bb-46554ca9f1cb	2021-08-11 14:37:21.955222+00
ca652ee1-1423-42fe-a0ef-e5761a670845	40464e44-d5df-48cb-b862-5a9b5d4ffa11	f2689615-7043-4f29-a4e7-a741aaec3f9e	2021-08-13 08:40:33.308882+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	a61bd1a0-ab6c-4c3d-8ef2-d90dd7b4ceef	ad804eb9-d31d-4311-aeeb-5e46de6e1802	2021-08-11 08:53:49.846048+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	8bdd2810-4147-4198-9008-67bdb770b440	b32b6b92-874d-45cd-a554-f2b6d65fe38a	2021-08-13 16:30:22.335012+00
7a90bccb-346e-4933-aaeb-cdef732be976	c9082d89-1383-4f85-9a06-b3e2a518eaf5	ade99b60-bc15-45cb-9899-4ee4819d5cf7	2021-08-13 08:44:20.11856+00
ca652ee1-1423-42fe-a0ef-e5761a670845	8dac34bd-e5d0-4e88-97be-76ef1da6965a	3e7f4cb4-d26f-4d98-ace2-09d980921d00	2021-08-13 11:05:59.65308+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	b79e885e-41bd-4fd6-8fb1-9e04ef3424fa	bb4672b1-9b38-41ce-9c0d-9f9ef361b72c	2021-08-13 15:03:28.313757+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	d2495640-61f5-4c4d-95ee-59999fe26f27	9571501e-cdc8-4e57-9c98-0edf0420a480	2021-08-13 15:04:13.091953+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	8dac34bd-e5d0-4e88-97be-76ef1da6965a	3e7f4cb4-d26f-4d98-ace2-09d980921d00	2021-08-13 13:03:55.958811+00
ca652ee1-1423-42fe-a0ef-e5761a670845	6eaf91dc-0e6f-4760-a528-272403cdc422	300c98c8-2136-47f5-a738-d8e6eda86f4a	2021-08-13 08:53:27.716426+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	c9d1165c-a8f3-496d-8825-74c1cf81684e	66afc351-67fb-459f-b76f-d0e635984579	2021-08-13 08:24:15.89343+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	59add48e-eb2e-41cc-babf-e37172728fce	fe91b95b-4612-499e-acd4-7437c5a3dcc1	2021-08-11 08:53:52.396302+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	b620880f-3182-471f-88ed-2726bcebf800	dbc48fdf-3014-4a56-b8f3-1cefa783184f	2021-08-11 11:33:10.385845+00
7a90bccb-346e-4933-aaeb-cdef732be976	7ef55206-4dc3-44f9-89f2-8f141237b3a7	4a007c82-5a78-4b18-ad5b-49b76ba93a18	2021-08-11 12:27:44.712413+00
7879f271-4036-48be-befb-f08de052bcdc	6c291865-999e-4a1d-9588-5ad93cedbbf5	8d9baf3b-8190-49f1-8c53-854fc751ade6	2021-08-12 14:13:56.848529+00
ca652ee1-1423-42fe-a0ef-e5761a670845	87b6097f-6232-43f6-a3a8-0e1c3104212d	9f37bd8c-44be-4d4d-a48d-5f573f7f7909	2021-08-12 06:54:33.284472+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	7ef55206-4dc3-44f9-89f2-8f141237b3a7	66941b37-b7a5-49e7-9d20-53905729772a	2021-08-13 08:27:04.319888+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	885eabe5-ee9d-4574-b03a-921865923f62	03c741c6-6a09-4433-bd2e-eb3099097c55	2021-08-13 15:03:23.693496+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	885eabe5-ee9d-4574-b03a-921865923f62	03c741c6-6a09-4433-bd2e-eb3099097c55	2021-08-15 09:42:10.589078+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	6159e96d-a508-45e2-8868-345533482eed	0308ee84-9f2c-48bc-88aa-084eeadc570d	2021-08-10 07:41:49.779837+00
7a90bccb-346e-4933-aaeb-cdef732be976	375b6658-2684-4295-83c8-09c5d062749d	2c960600-f1d9-47f6-81ef-ef3593fc5ea5	2021-08-13 08:43:22.697368+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	c5ec9832-9fac-4c5f-b44f-de7dacedf5da	6b6cd268-40da-4c91-8dc9-c386f82311fb	2021-08-13 15:21:34.992792+00
7a90bccb-346e-4933-aaeb-cdef732be976	6f4d0bba-4553-4747-bd7b-0f91ab5617a2	f07442fc-ecc6-40d5-9382-9e1f0a9117cf	2021-08-12 11:57:19.41531+00
ca652ee1-1423-42fe-a0ef-e5761a670845	cb2365c8-f314-4744-a80e-a709a02817f8	e3ea8bf1-0d92-4b99-9b20-705cc59ee304	2021-08-13 09:49:41.765956+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	13041466-28d1-49be-9f9c-baea49780335	bba48c56-8d9a-47c1-8ffa-3b499b2496a7	2021-08-13 15:57:08.332196+00
ca652ee1-1423-42fe-a0ef-e5761a670845	29f7bc2a-76ff-4f94-8cb1-1f11045297a1	b7ae015d-c012-4d15-ac3e-6b627ce13b0c	2021-08-13 11:04:58.965704+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	8b62b6ad-fe39-40aa-b8b5-44284657b286	93d96d24-752f-44f3-a664-7fded0195e15	2021-08-13 16:07:42.609927+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	6bba30f9-e03a-447f-b883-32b548f2df98	49da6ac8-383f-4c2b-9071-78dd496030c6	2021-08-09 14:26:49.741259+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	302234fb-76ed-42cd-b9d2-959f66e7bdff	0fcfc38e-cf8f-48c5-bec6-70814a885eb3	2021-08-11 11:33:23.57252+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	1f144355-4143-4f39-8331-d688eed9a1b8	d1039854-3d2e-4b25-90c2-2ed8e23a66f7	2021-08-11 14:54:50.352189+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	7da19367-6883-4946-b4e6-789744d03b89	2fce887d-ac35-4ed0-b153-1268d3d11783	2021-08-11 08:32:10.332444+00
ca652ee1-1423-42fe-a0ef-e5761a670845	aee59dba-2ead-47b1-8d38-334fef5ebade	d11fa1db-1d2c-4232-81cc-29f528ef40f8	2021-08-12 06:57:50.642104+00
ca652ee1-1423-42fe-a0ef-e5761a670845	63a7e4fb-03c6-4a8b-9581-063725d3faa5	637e69c9-6756-4b71-9d11-8b1985d1ebf9	2021-08-12 06:57:56.582622+00
82f57a9f-6615-4527-816f-31ee7a0b7c98	18982189-4823-414e-b456-65e09d1237fa	4fa1bbd6-15d4-43b6-8c86-7a9c9a77e3c2	2021-08-12 11:38:14.663543+00
ca652ee1-1423-42fe-a0ef-e5761a670845	6f4d0bba-4553-4747-bd7b-0f91ab5617a2	f07442fc-ecc6-40d5-9382-9e1f0a9117cf	2021-08-12 14:07:35.261705+00
ca652ee1-1423-42fe-a0ef-e5761a670845	8bdd2810-4147-4198-9008-67bdb770b440	a5126690-8fd7-4714-a038-f6d81c7036b2	2021-08-13 12:50:09.591268+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	28799055-2bf2-420e-b6fb-6cb332de30b4	6c37acfd-5f47-4c39-9cbd-b362bccc244f	2021-08-13 15:04:12.044595+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	4225e883-1e99-4cab-9000-eee3c4dfd200	518786b5-b6a0-4c54-b3c5-6a16ecb1342f	2021-08-13 15:04:14.427697+00
7879f271-4036-48be-befb-f08de052bcdc	e0a7b845-b083-4f2c-a93b-38bd9d04df10	c2a5ea37-6af1-404d-9706-9594b11d19ff	2021-08-15 14:59:33.900704+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	29f7bc2a-76ff-4f94-8cb1-1f11045297a1	8d2ed941-79c3-4319-89ad-1b98789f0ff1	2021-08-13 15:24:16.826716+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	ce8a900c-eab9-44c2-bf95-873272fa5e77	faac881f-8a62-469e-afdd-7bb20061ddae	2021-08-13 15:24:33.813009+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	fe1bcd9c-03c9-48e7-85c5-b4de3ade9287	c913c0f2-2363-4201-973c-8f078d82a21d	2021-08-09 14:26:50.451187+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	ddf30ba1-4908-409d-ab39-cf57d34d658e	006b5ef5-9cfd-41b3-94f0-4fc19ae033b1	2021-08-11 11:33:25.031276+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	81146d99-7c5f-4b86-8826-de0b955093c1	0a95bf22-143d-4af9-9494-3b11e9ccd095	2021-08-11 12:54:58.711371+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	6f4d0bba-4553-4747-bd7b-0f91ab5617a2	f92b5c30-83a1-44a9-a1b7-17121f3e02a5	2021-08-12 14:21:11.340665+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	9752c7ba-94e3-4441-ae79-37118fcbd72e	41c81df6-c7b1-4b28-be4c-373127d128bd	2021-08-13 15:04:15.310469+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	b79e885e-41bd-4fd6-8fb1-9e04ef3424fa	bb4672b1-9b38-41ce-9c0d-9f9ef361b72c	2021-08-13 15:04:16.452505+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	6eaf91dc-0e6f-4760-a528-272403cdc422	300c98c8-2136-47f5-a738-d8e6eda86f4a	2021-08-13 10:55:59.438394+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	a7e76ba5-9d54-4d3b-be5d-f74e782c6903	230ade3d-ad79-428b-871d-6022a6da40f7	2021-08-13 15:47:59.967744+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	8b62b6ad-fe39-40aa-b8b5-44284657b286	93d96d24-752f-44f3-a664-7fded0195e15	2021-08-13 15:57:03.831732+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	810dbc47-af96-4c1b-bdbd-b1dcd6aa4322	5819c072-7410-47ae-99ab-454e1ba0b9ad	2021-08-13 08:22:43.278116+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	055a8d84-dc22-4aad-8d37-adbe9e19545d	a7048445-6393-4b95-8f93-7bd598be71a5	2021-08-13 08:22:47.520038+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	8ef2ac54-7d44-4bfd-b897-f88ee920764e	4230fd13-f3b9-4c9b-9137-f0d403e4c60f	2021-08-13 08:22:55.041773+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	795d9351-a097-48a7-9c5a-7a0409341af4	42519d93-decc-4f6e-bfc7-b16922e00c34	2021-08-13 08:23:08.49301+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	dced53b7-5ea8-453b-b0d2-8b1aa88e87fd	fe73ae76-ef33-4f90-a406-e86cf8d45eb2	2021-08-13 08:23:13.243994+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	527f10e5-ce40-4d9f-9db3-1eda40155817	f9ddda15-bd7a-463c-b0c1-c5268c9fcb0a	2021-08-13 08:23:25.083408+00
ca652ee1-1423-42fe-a0ef-e5761a670845	78dc049f-b901-4a54-8068-05f5e3c879b8	ade4de71-12dc-489d-8ed0-c51f7fc26644	2021-08-13 11:04:28.816307+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	9ba172a0-a1a7-4caa-a221-b8a2704e5a9c	7a3416fe-0729-42f9-b5b8-be52b18793d8	2021-08-11 16:22:45.5405+00
ca652ee1-1423-42fe-a0ef-e5761a670845	527f10e5-ce40-4d9f-9db3-1eda40155817	f9ddda15-bd7a-463c-b0c1-c5268c9fcb0a	2021-08-12 06:57:54.972303+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	7fe5f795-13fb-4cb0-b888-a06f3ddf6cac	a9d46b6e-a172-43fe-9ade-e79f2b1cff15	2021-08-13 08:24:16.87837+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	6bba30f9-e03a-447f-b883-32b548f2df98	49da6ac8-383f-4c2b-9071-78dd496030c6	2021-08-13 08:24:19.450932+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	18982189-4823-414e-b456-65e09d1237fa	4fa1bbd6-15d4-43b6-8c86-7a9c9a77e3c2	2021-08-13 08:24:29.755349+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	29f7bc2a-76ff-4f94-8cb1-1f11045297a1	3f140266-6da1-45a5-9b22-e62319f9bd79	2021-08-13 13:12:09.273914+00
f30de478-b560-47f5-8588-8062ffc64a25	29f7bc2a-76ff-4f94-8cb1-1f11045297a1	8d2ed941-79c3-4319-89ad-1b98789f0ff1	2021-08-13 15:41:25.872409+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	c9082d89-1383-4f85-9a06-b3e2a518eaf5	ade99b60-bc15-45cb-9899-4ee4819d5cf7	2021-08-13 09:23:50.257927+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	e0a7b845-b083-4f2c-a93b-38bd9d04df10	c2a5ea37-6af1-404d-9706-9594b11d19ff	2021-08-13 15:42:11.470088+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	a442e7be-2447-493d-9403-78b4969d569c	bb488432-e80f-4c1d-b2e4-097ec108335c	2021-08-09 14:26:54.02356+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	3ffa3d3c-ee5f-4ec6-b12d-33128498ce3f	1c7b20e9-e396-4a6a-88d5-0ab93a7b5192	2021-08-11 09:00:21.856408+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	29f7bc2a-76ff-4f94-8cb1-1f11045297a1	3f140266-6da1-45a5-9b22-e62319f9bd79	2021-08-13 13:12:16.905364+00
6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	40464e44-d5df-48cb-b862-5a9b5d4ffa11	f2689615-7043-4f29-a4e7-a741aaec3f9e	2021-08-11 12:27:35.640124+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	daea1cc1-364d-4be3-a8d3-ba1259d61e54	d006e0dd-7681-4f0f-bae7-9a875897b089	2021-08-13 15:47:58.943536+00
7879f271-4036-48be-befb-f08de052bcdc	a8663afc-06b9-4e95-a9c8-bd57f898bf52	3a9a1050-e9f8-4841-a44b-f722da51eeb2	2021-08-15 14:43:40.364956+00
ca652ee1-1423-42fe-a0ef-e5761a670845	d3b9a5c5-04dd-4875-8440-b5726b3bb231	ebcd6f4b-87f6-4d4c-bd11-37a9ca334590	2021-08-12 06:57:58.280616+00
b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	885eabe5-ee9d-4574-b03a-921865923f62	03c741c6-6a09-4433-bd2e-eb3099097c55	2021-08-13 15:08:29.533142+00
600ccd3a-a513-4a4a-864b-e00bfc9699f9	a3df9a5b-6188-4a59-b780-019b5897954c	993750d5-c564-4265-87d6-ff428191e27b	2021-08-13 10:52:01.91355+00
7879f271-4036-48be-befb-f08de052bcdc	8dac34bd-e5d0-4e88-97be-76ef1da6965a	3e7f4cb4-d26f-4d98-ace2-09d980921d00	2021-08-15 14:45:35.159452+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	9fa78080-867b-4e01-b60a-6f47b55c4b58	055d299c-3cbd-46ed-bb53-daa2ca8bf69c	2021-08-13 08:04:53.342726+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	375b6658-2684-4295-83c8-09c5d062749d	2c960600-f1d9-47f6-81ef-ef3593fc5ea5	2021-08-13 08:17:15.792287+00
ee140dfb-14f6-41d3-b2b0-4e50764290d7	950ad578-3e05-4e73-aed4-25a21b5393ac	3578dfe7-b063-4b89-8575-890f3e409292	2021-08-13 08:23:12.158467+00
\.


--
-- Data for Name: membership_status; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.membership_status (value) FROM stdin;
invited
rejected
accepted
cancelled
\.


--
-- Data for Name: message_type; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.message_type (value) FROM stdin;
TEXT
AUDIO
VIDEO
FILE
\.


--
-- Data for Name: message; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.message (topic_id, user_id, created_at, type, id, is_draft, content, replied_to_message_id, content_text) FROM stdin;
\.


--
-- Data for Name: message_reaction; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.message_reaction (message_id, user_id, emoji) FROM stdin;
bb62ac7d-66a1-4621-89cc-c31c272d2e01	ca652ee1-1423-42fe-a0ef-e5761a670845	🎉
bb62ac7d-66a1-4621-89cc-c31c272d2e01	ca652ee1-1423-42fe-a0ef-e5761a670845	👍
bb62ac7d-66a1-4621-89cc-c31c272d2e01	ca652ee1-1423-42fe-a0ef-e5761a670845	🙌
8242f4d0-7f76-452d-9756-3937f8a94626	ee140dfb-14f6-41d3-b2b0-4e50764290d7	👍
0cb75d2b-60ee-4de2-807b-fd2e999b1567	82f57a9f-6615-4527-816f-31ee7a0b7c98	😊
4b37408a-f38a-451c-8263-60fd9f637027	25db9c19-f84e-40d8-9dfb-ee94478ca40a	🍉
4b37408a-f38a-451c-8263-60fd9f637027	25db9c19-f84e-40d8-9dfb-ee94478ca40a	🌵
4b37408a-f38a-451c-8263-60fd9f637027	25db9c19-f84e-40d8-9dfb-ee94478ca40a	🤩
4b37408a-f38a-451c-8263-60fd9f637027	82f57a9f-6615-4527-816f-31ee7a0b7c98	🍉
4b37408a-f38a-451c-8263-60fd9f637027	82f57a9f-6615-4527-816f-31ee7a0b7c98	🌵
8cb9d917-6101-4957-9296-79009c180ec0	82f57a9f-6615-4527-816f-31ee7a0b7c98	🤸
c243fed0-0573-4aae-8534-904d655c55ad	82f57a9f-6615-4527-816f-31ee7a0b7c98	😃
8cb9d917-6101-4957-9296-79009c180ec0	ee140dfb-14f6-41d3-b2b0-4e50764290d7	🤸
3b042572-af44-4244-a480-aebb70f3f11b	ee140dfb-14f6-41d3-b2b0-4e50764290d7	😱
4d01997f-f139-4062-a203-09811af93a98	ee140dfb-14f6-41d3-b2b0-4e50764290d7	🎉
16b6ba31-7ca2-4d04-8bf2-eeb5cb6f844d	ee140dfb-14f6-41d3-b2b0-4e50764290d7	🍎
08090136-ca0c-435e-bb18-b836b06592d3	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	😜
08090136-ca0c-435e-bb18-b836b06592d3	25db9c19-f84e-40d8-9dfb-ee94478ca40a	😜
4d01997f-f139-4062-a203-09811af93a98	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	👀
c243fed0-0573-4aae-8534-904d655c55ad	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	😃
c243fed0-0573-4aae-8534-904d655c55ad	82f57a9f-6615-4527-816f-31ee7a0b7c98	😉
c243fed0-0573-4aae-8534-904d655c55ad	82f57a9f-6615-4527-816f-31ee7a0b7c98	🤖
c243fed0-0573-4aae-8534-904d655c55ad	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	😅
d05280ed-37ba-491d-b0cf-a4c8ef1a0e10	600ccd3a-a513-4a4a-864b-e00bfc9699f9	🌴
fc04bd52-68ba-4e06-b167-384f46981c6c	600ccd3a-a513-4a4a-864b-e00bfc9699f9	🙌
fd170dbf-75ea-4c7f-af79-db53adf1c2e8	600ccd3a-a513-4a4a-864b-e00bfc9699f9	🖌️
0b1524e3-eb27-47bd-b6ca-d8914b6a28f8	600ccd3a-a513-4a4a-864b-e00bfc9699f9	👍
881bdd66-cd8b-43e0-9201-d71534abffc8	600ccd3a-a513-4a4a-864b-e00bfc9699f9	📊
301e3501-654b-4ab0-a35f-082779a2681b	600ccd3a-a513-4a4a-864b-e00bfc9699f9	👍
765ad674-984d-4b08-94ad-004895b65752	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
978352d1-3e77-4ceb-a6ca-78ddbc59a40d	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	😂
978352d1-3e77-4ceb-a6ca-78ddbc59a40d	82f57a9f-6615-4527-816f-31ee7a0b7c98	😅
978352d1-3e77-4ceb-a6ca-78ddbc59a40d	82f57a9f-6615-4527-816f-31ee7a0b7c98	🦟
978352d1-3e77-4ceb-a6ca-78ddbc59a40d	25db9c19-f84e-40d8-9dfb-ee94478ca40a	😂
978352d1-3e77-4ceb-a6ca-78ddbc59a40d	7a90bccb-346e-4933-aaeb-cdef732be976	🦟
9eec325a-a815-4147-9aca-32576cd28617	600ccd3a-a513-4a4a-864b-e00bfc9699f9	🙌
d556b015-f268-4712-a3b4-2b0fd81d033a	25db9c19-f84e-40d8-9dfb-ee94478ca40a	😅
d556b015-f268-4712-a3b4-2b0fd81d033a	25db9c19-f84e-40d8-9dfb-ee94478ca40a	🦟
bca7b63e-187d-4b03-94f0-3bd0d4658bde	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	😍
4349cd3d-f7ef-450e-b4f9-d0b4db73e9fc	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	🙌
bca7b63e-187d-4b03-94f0-3bd0d4658bde	82f57a9f-6615-4527-816f-31ee7a0b7c98	🐶
c84d43ce-3e24-4188-be68-01ff69875e18	7a90bccb-346e-4933-aaeb-cdef732be976	👍
3878e501-540a-41df-a176-1a8cc8cab067	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
c96913f4-b782-415b-a00c-89b096b624de	25db9c19-f84e-40d8-9dfb-ee94478ca40a	👍
ba7bbb5b-66e8-45dc-ae98-d298c0adaf65	25db9c19-f84e-40d8-9dfb-ee94478ca40a	👍
06c34325-78c5-4033-9e7c-8bb202dfe652	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	👍
21ddaafc-64c5-4228-ac1e-d633ed1604e6	f30de478-b560-47f5-8588-8062ffc64a25	👍
4fb18e0c-1012-4601-a72b-de01fbaa9848	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	👍
54333d54-396b-4c53-9d9e-cfae646a095a	25db9c19-f84e-40d8-9dfb-ee94478ca40a	👍
7ec7bd2c-5e16-4303-9227-f1ff1106f81c	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
2d9cc4df-a67c-4f99-81a7-26ceeed038b4	600ccd3a-a513-4a4a-864b-e00bfc9699f9	🙌
e898b2a3-afda-43eb-8f33-7e2eec001b6f	25db9c19-f84e-40d8-9dfb-ee94478ca40a	😱
aaa8f7a3-758e-438a-a081-c0ace580937e	25db9c19-f84e-40d8-9dfb-ee94478ca40a	🤩
c6e2e55b-de11-4c25-a5d7-4836916b0d8b	7a90bccb-346e-4933-aaeb-cdef732be976	🤑
258b9bc3-3456-4d22-b2cc-dc55145570f2	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	👍
087e5e81-e85b-4887-b2eb-0dfbae190706	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	😶
bb62ac7d-66a1-4621-89cc-c31c272d2e01	69324499-ae41-4ce4-bdaa-6072e0e5c2d3	🎉
2d1eef67-af34-4093-bc54-80c9655461c8	ca652ee1-1423-42fe-a0ef-e5761a670845	👍
c6e3996c-9029-4e1e-83cc-2e9c59543c6d	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
cf97db2f-602b-484f-a043-f2b0d5946af0	ca652ee1-1423-42fe-a0ef-e5761a670845	👍
da33ffc6-f68d-4f2a-8852-5e15c047402d	ca652ee1-1423-42fe-a0ef-e5761a670845	👍
9f383d28-fcc2-43cc-b98c-95a09b0f393f	25db9c19-f84e-40d8-9dfb-ee94478ca40a	😀
cd1d94c9-cbf5-452c-8af9-bd4add46514d	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	👍
1be84e11-d243-4029-b58b-b920a7521b45	7a90bccb-346e-4933-aaeb-cdef732be976	👍
82056aff-a914-417b-9b1c-dcdbe03db4a6	f30de478-b560-47f5-8588-8062ffc64a25	👍
d2a6915e-260e-413b-ac81-e88d1189af7b	7a90bccb-346e-4933-aaeb-cdef732be976	🎉
c5235d31-487a-4b3e-9b47-6544a741bf59	7a90bccb-346e-4933-aaeb-cdef732be976	👆
4e509517-f3f2-4928-9a50-8f9e6ae41b49	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
bdb7f552-cc42-45f6-bc95-acfab2da07f1	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
d9cbdf25-7a61-484b-94a2-b7657a878dda	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
07bcb362-cb64-4029-9f0b-d6516dee551c	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
71dfb5a6-7cba-4ae2-b796-fe222b363b14	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
a140b52c-697e-44c7-b57a-087122bf49d7	ee140dfb-14f6-41d3-b2b0-4e50764290d7	👍
9acfc11a-0599-4689-801d-f18534d7a121	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	👍
c3ff0511-e847-497e-ae7a-7252e72edf26	25db9c19-f84e-40d8-9dfb-ee94478ca40a	😀
7536cf3a-c187-46c5-8015-36048ae7a405	f30de478-b560-47f5-8588-8062ffc64a25	👍
b632a624-17ca-4039-9ac5-72d034e80d38	f30de478-b560-47f5-8588-8062ffc64a25	💡
c3ff0511-e847-497e-ae7a-7252e72edf26	600ccd3a-a513-4a4a-864b-e00bfc9699f9	🙌
c3ff0511-e847-497e-ae7a-7252e72edf26	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	😀
c3ff0511-e847-497e-ae7a-7252e72edf26	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	🙌
0c012e6d-76ff-4a99-9090-9ae659392283	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	✅
338212dd-2932-45a8-90e6-856b28a484c9	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	✅
922d2e77-33c9-4a5a-b3d6-9be263f8a6dc	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
cda93be0-0f87-4593-9269-d050a86e07ae	25db9c19-f84e-40d8-9dfb-ee94478ca40a	👍
689d7c3b-456e-449d-a5b4-261e88519078	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	🙌
c3234c77-2ca5-423e-8918-3a286d15ce53	ca652ee1-1423-42fe-a0ef-e5761a670845	👍
a42fb85a-2be1-4a4e-b041-8fb4ea510d96	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	👍
0f8fc83b-4521-49cc-9d38-ec5bc9793a98	25db9c19-f84e-40d8-9dfb-ee94478ca40a	😍
0f8fc83b-4521-49cc-9d38-ec5bc9793a98	600ccd3a-a513-4a4a-864b-e00bfc9699f9	🙌
29a32ba9-a09a-461d-95a8-171298438eb3	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	👍
79ecc42a-b217-44bc-bed9-46ef5fc1b195	25db9c19-f84e-40d8-9dfb-ee94478ca40a	😀
5a71ea74-d230-4bb8-af4d-d52467a66b4f	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
6ea07720-5a29-419e-8b5d-f45000f67a10	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
f3b8cd18-a5f7-43b3-8a86-aacc044b01c9	25db9c19-f84e-40d8-9dfb-ee94478ca40a	👍
f3b8cd18-a5f7-43b3-8a86-aacc044b01c9	f30de478-b560-47f5-8588-8062ffc64a25	👍
84c6c327-f96a-4f92-bad7-3f84652a86e3	82f57a9f-6615-4527-816f-31ee7a0b7c98	🎉
7a3bc952-8d31-4b7a-89c3-af25ecc5e4e0	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
7a3bc952-8d31-4b7a-89c3-af25ecc5e4e0	31f1de58-af98-4946-997c-622cb20d9504	🐝
7a3bc952-8d31-4b7a-89c3-af25ecc5e4e0	31f1de58-af98-4946-997c-622cb20d9504	👍
b955c864-315b-40f1-9144-74416a083935	25db9c19-f84e-40d8-9dfb-ee94478ca40a	👍
361ef2f7-185b-4d85-87ab-003e7042175f	f30de478-b560-47f5-8588-8062ffc64a25	👍
bc8343d9-93de-4db2-ade7-7ab48eaacded	f30de478-b560-47f5-8588-8062ffc64a25	👏
bc8343d9-93de-4db2-ade7-7ab48eaacded	600ccd3a-a513-4a4a-864b-e00bfc9699f9	👏
b955c864-315b-40f1-9144-74416a083935	600ccd3a-a513-4a4a-864b-e00bfc9699f9	👍
bc8343d9-93de-4db2-ade7-7ab48eaacded	7879f271-4036-48be-befb-f08de052bcdc	👏
f7232c64-0751-4273-b9c3-43e132e3f617	7879f271-4036-48be-befb-f08de052bcdc	💯
f7232c64-0751-4273-b9c3-43e132e3f617	7a90bccb-346e-4933-aaeb-cdef732be976	🙏
be17bed5-ad12-48a6-8066-65ed110bbb30	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	👍
0fc6df6a-1c97-4011-a6fc-8c975538f69a	25db9c19-f84e-40d8-9dfb-ee94478ca40a	💥
a2b83fdf-2179-4ee8-9f65-82dd52d13cdd	25db9c19-f84e-40d8-9dfb-ee94478ca40a	👍
5f345f3a-e14c-4b6c-a06a-a26ea72c032e	82f57a9f-6615-4527-816f-31ee7a0b7c98	💫
4dc82118-e5ea-4426-8350-6542517f58f4	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
4dc82118-e5ea-4426-8350-6542517f58f4	82f57a9f-6615-4527-816f-31ee7a0b7c98	🤩
2926ec9f-6ea5-4673-a2fc-6597be0fe936	7a90bccb-346e-4933-aaeb-cdef732be976	😅
1d02e8a6-a380-421a-a077-360d21b019d3	25db9c19-f84e-40d8-9dfb-ee94478ca40a	😥
b4809241-f46c-4d27-89f1-4dda69c0646d	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
b4809241-f46c-4d27-89f1-4dda69c0646d	31f1de58-af98-4946-997c-622cb20d9504	👍
d13ea718-f27e-48a8-8665-8737e1ca3e3b	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	👍
4bb60ea6-5f3d-4192-8dba-add8365440bf	ca652ee1-1423-42fe-a0ef-e5761a670845	👍
dbeef988-da9a-45a2-b2a6-3b96cfec0a94	31f1de58-af98-4946-997c-622cb20d9504	👍
a7bc86f0-7868-490c-a978-c97c7665831e	25db9c19-f84e-40d8-9dfb-ee94478ca40a	💪
cd30dd29-4c0c-4749-b619-1d2eb417788c	25db9c19-f84e-40d8-9dfb-ee94478ca40a	💥
1ef1a191-4c53-45ad-8152-f69a204fd9c2	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	🎉
c48eb244-5ab8-4ce2-9f41-d9b47c059a5a	f30de478-b560-47f5-8588-8062ffc64a25	👏
c48eb244-5ab8-4ce2-9f41-d9b47c059a5a	82f57a9f-6615-4527-816f-31ee7a0b7c98	💫
16d01708-fb21-4e29-b083-223d3200a66d	7879f271-4036-48be-befb-f08de052bcdc	👍
4d602bf9-b86d-47b1-8e2f-651be027922e	ca652ee1-1423-42fe-a0ef-e5761a670845	🎉
d6cdf9a9-1dcf-49f0-b6b2-9acb939adb70	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
b1f58e87-c038-4202-936e-de0ee5e90d66	f30de478-b560-47f5-8588-8062ffc64a25	👏
201a839f-b202-4547-8289-b57db527a062	f30de478-b560-47f5-8588-8062ffc64a25	☀️
677bd1a1-0af0-49ba-a273-755e10dd680a	ee140dfb-14f6-41d3-b2b0-4e50764290d7	👍
f6da9540-6ef5-4f23-b702-2e5f775e7d2c	ee140dfb-14f6-41d3-b2b0-4e50764290d7	👍
1870343a-2dee-482e-a48c-03e5d606c743	f30de478-b560-47f5-8588-8062ffc64a25	🏠
60e13871-d9d6-4a53-a0fe-1d859d8e9365	f30de478-b560-47f5-8588-8062ffc64a25	🍩
8068e085-1706-493a-ad8a-f5484635cf22	f30de478-b560-47f5-8588-8062ffc64a25	👍
0c4a0fd6-5a6e-41be-9e23-544c667bad6d	f30de478-b560-47f5-8588-8062ffc64a25	👏
ed4c8249-596b-4c34-8d61-58e30169c952	f30de478-b560-47f5-8588-8062ffc64a25	👍
dc1cbd28-f103-4df5-8c13-dc8f178258e7	f30de478-b560-47f5-8588-8062ffc64a25	👍
fc82c22b-0cc0-48eb-8b8c-b07d1217f2f0	f30de478-b560-47f5-8588-8062ffc64a25	👍
dc1cbd28-f103-4df5-8c13-dc8f178258e7	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
13831ed0-fd61-4924-bb84-098b315706bf	600ccd3a-a513-4a4a-864b-e00bfc9699f9	👍
e23ac606-cf2f-435f-9f53-a5f18dd7c6ff	600ccd3a-a513-4a4a-864b-e00bfc9699f9	👍
0279e784-44c9-4da0-b0fa-0ad8c9a61548	7a90bccb-346e-4933-aaeb-cdef732be976	✅
42519d93-decc-4f6e-bfc7-b16922e00c34	f30de478-b560-47f5-8588-8062ffc64a25	👍
42519d93-decc-4f6e-bfc7-b16922e00c34	7879f271-4036-48be-befb-f08de052bcdc	👍
119384a7-a4b5-4181-b66f-4533d43dcb5d	7879f271-4036-48be-befb-f08de052bcdc	🎉
93689236-27fd-42a9-90ff-5f1ddca003cd	f30de478-b560-47f5-8588-8062ffc64a25	🎉
0eb468cb-7bfb-42d7-9ac8-f7f4d00d8ea9	7a90bccb-346e-4933-aaeb-cdef732be976	🎉
93689236-27fd-42a9-90ff-5f1ddca003cd	ca652ee1-1423-42fe-a0ef-e5761a670845	🎉
7b77afb2-d2dd-4a96-afd7-c1fc94d65971	7a90bccb-346e-4933-aaeb-cdef732be976	👍
fb3fe25b-7d81-43f8-96e6-0f68a87f722a	600ccd3a-a513-4a4a-864b-e00bfc9699f9	👍
56150a36-7cc0-4c98-a71d-d40a45a13eb3	f30de478-b560-47f5-8588-8062ffc64a25	🙏
838fed91-36ee-486d-b037-90f56262d1ed	69324499-ae41-4ce4-bdaa-6072e0e5c2d3	👍
93689236-27fd-42a9-90ff-5f1ddca003cd	7a90bccb-346e-4933-aaeb-cdef732be976	🎉
e89e645c-25ef-4720-906b-79835e30f4f9	7a90bccb-346e-4933-aaeb-cdef732be976	👆
549e45b9-5e73-4f5b-941a-24bf5e42ad65	f30de478-b560-47f5-8588-8062ffc64a25	💡
838fed91-36ee-486d-b037-90f56262d1ed	7a90bccb-346e-4933-aaeb-cdef732be976	👍
595f2f67-e903-45fa-9792-95eda474a677	f30de478-b560-47f5-8588-8062ffc64a25	👍
93689236-27fd-42a9-90ff-5f1ddca003cd	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	🎉
2fe5671f-e26b-449f-a5ac-f0f4ffa2efd2	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
bc279243-2b3e-43d5-b7e6-cb66d2a416ea	ee140dfb-14f6-41d3-b2b0-4e50764290d7	👍
2b8bf372-8ba2-4844-ac1c-0c6059e67161	7879f271-4036-48be-befb-f08de052bcdc	🎉
0fcfc38e-cf8f-48c5-bec6-70814a885eb3	7879f271-4036-48be-befb-f08de052bcdc	🎉
dff377be-b435-4025-9ec1-17d9aeee56de	7879f271-4036-48be-befb-f08de052bcdc	👍
838fed91-36ee-486d-b037-90f56262d1ed	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	😍
4714fd57-9657-48cd-bb67-e7a398cc7423	ee140dfb-14f6-41d3-b2b0-4e50764290d7	👍
dc9029ba-80c2-46e2-a174-cda085fda710	600ccd3a-a513-4a4a-864b-e00bfc9699f9	👍
421e4d37-7830-47d9-b417-d9c93876866d	f30de478-b560-47f5-8588-8062ffc64a25	👍
6a8ba696-5e4b-44f9-b547-91a4d0e07aa3	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	😂
6a8ba696-5e4b-44f9-b547-91a4d0e07aa3	82f57a9f-6615-4527-816f-31ee7a0b7c98	😂
dbc48fdf-3014-4a56-b8f3-1cefa783184f	69324499-ae41-4ce4-bdaa-6072e0e5c2d3	👍
6a8ba696-5e4b-44f9-b547-91a4d0e07aa3	7879f271-4036-48be-befb-f08de052bcdc	😂
6a8ba696-5e4b-44f9-b547-91a4d0e07aa3	600ccd3a-a513-4a4a-864b-e00bfc9699f9	😅
944c1c79-90ab-4faa-8b91-be3b78c86341	f30de478-b560-47f5-8588-8062ffc64a25	👏
f2689615-7043-4f29-a4e7-a741aaec3f9e	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	😆
f2689615-7043-4f29-a4e7-a741aaec3f9e	f30de478-b560-47f5-8588-8062ffc64a25	😆
6bdfe509-2118-45e5-a56f-54de7a7864d4	7a90bccb-346e-4933-aaeb-cdef732be976	🤔
69464dec-6547-4dbf-a8bb-46554ca9f1cb	69324499-ae41-4ce4-bdaa-6072e0e5c2d3	🚀
7eb738ce-9460-4db8-9284-fa210705c4d1	69324499-ae41-4ce4-bdaa-6072e0e5c2d3	🏖️
f2689615-7043-4f29-a4e7-a741aaec3f9e	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	😂
69464dec-6547-4dbf-a8bb-46554ca9f1cb	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	🚀
0a95bf22-143d-4af9-9494-3b11e9ccd095	69324499-ae41-4ce4-bdaa-6072e0e5c2d3	🚀
0a95bf22-143d-4af9-9494-3b11e9ccd095	f30de478-b560-47f5-8588-8062ffc64a25	🚀
ed381feb-41df-4cc9-81b6-07e4b0760277	f30de478-b560-47f5-8588-8062ffc64a25	👍
58f88c20-a29a-410f-83d5-436bf687e989	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	🌙
58f88c20-a29a-410f-83d5-436bf687e989	69324499-ae41-4ce4-bdaa-6072e0e5c2d3	🌙
1c029d79-c5b7-4d67-bf10-e2bdd355b1f8	7a90bccb-346e-4933-aaeb-cdef732be976	👍
9bc52789-92b5-4a30-8555-f350e716c8d3	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
687dad4e-fb72-4db8-a2d3-dffbee0c352b	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
f07442fc-ecc6-40d5-9382-9e1f0a9117cf	82f57a9f-6615-4527-816f-31ee7a0b7c98	🎶
687dad4e-fb72-4db8-a2d3-dffbee0c352b	7a90bccb-346e-4933-aaeb-cdef732be976	👍
f07442fc-ecc6-40d5-9382-9e1f0a9117cf	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	🎶
f07442fc-ecc6-40d5-9382-9e1f0a9117cf	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	✅
687dad4e-fb72-4db8-a2d3-dffbee0c352b	ee140dfb-14f6-41d3-b2b0-4e50764290d7	👍
beaece2b-ebb0-49a2-b269-105086071c06	7a90bccb-346e-4933-aaeb-cdef732be976	👍
beaece2b-ebb0-49a2-b269-105086071c06	7a90bccb-346e-4933-aaeb-cdef732be976	👋
8b7ec868-5aeb-4462-8695-6c0f992de9e1	7879f271-4036-48be-befb-f08de052bcdc	🎉
0bedbdfd-336e-4522-af45-edd1b29861aa	82f57a9f-6615-4527-816f-31ee7a0b7c98	💫
0bedbdfd-336e-4522-af45-edd1b29861aa	82f57a9f-6615-4527-816f-31ee7a0b7c98	🎶
0bedbdfd-336e-4522-af45-edd1b29861aa	f30de478-b560-47f5-8588-8062ffc64a25	🎶
0bedbdfd-336e-4522-af45-edd1b29861aa	82f57a9f-6615-4527-816f-31ee7a0b7c98	👏
0a491719-c677-4259-ab62-50398ea2e318	f30de478-b560-47f5-8588-8062ffc64a25	👍
3e2fb17c-0c8a-4c7a-89d0-cbaf12929938	ca652ee1-1423-42fe-a0ef-e5761a670845	👍
0bedbdfd-336e-4522-af45-edd1b29861aa	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	👏
8e25873f-70a5-4571-84a9-c9c307d5a77e	7a90bccb-346e-4933-aaeb-cdef732be976	🤔
9f88b614-b23d-4878-84ce-b6fde7ab8c63	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
7406849c-5173-4435-8a83-aa036d653365	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
bb95a215-aa38-4c89-919f-7c4b4a366af2	ca652ee1-1423-42fe-a0ef-e5761a670845	🙌
0a95bf22-143d-4af9-9494-3b11e9ccd095	ee140dfb-14f6-41d3-b2b0-4e50764290d7	🚀
4d602bf9-b86d-47b1-8e2f-651be027922e	ee140dfb-14f6-41d3-b2b0-4e50764290d7	🎉
64ea1f10-50cc-4247-b945-bd661c87667b	ee140dfb-14f6-41d3-b2b0-4e50764290d7	👍
02d42d3e-7817-4d18-8ab1-7c6b7dd4cdf9	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	👀
090891db-20e4-4b1c-8878-2d75b9d1950f	7a90bccb-346e-4933-aaeb-cdef732be976	🤔
8a1cb5e5-c563-4874-9e6d-d7f5b26bbc5c	f30de478-b560-47f5-8588-8062ffc64a25	👍
993750d5-c564-4265-87d6-ff428191e27b	ca652ee1-1423-42fe-a0ef-e5761a670845	👍
62c6aa6c-400f-4e63-8b26-abe52a1f3c45	f30de478-b560-47f5-8588-8062ffc64a25	💡
300c98c8-2136-47f5-a738-d8e6eda86f4a	ee140dfb-14f6-41d3-b2b0-4e50764290d7	👏
300c98c8-2136-47f5-a738-d8e6eda86f4a	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	👏
ada7ccf7-d480-4c9f-978f-8a86164a30b1	82f57a9f-6615-4527-816f-31ee7a0b7c98	💫
ada7ccf7-d480-4c9f-978f-8a86164a30b1	7a90bccb-346e-4933-aaeb-cdef732be976	💫
993750d5-c564-4265-87d6-ff428191e27b	600ccd3a-a513-4a4a-864b-e00bfc9699f9	👍
300c98c8-2136-47f5-a738-d8e6eda86f4a	600ccd3a-a513-4a4a-864b-e00bfc9699f9	👏
993750d5-c564-4265-87d6-ff428191e27b	82f57a9f-6615-4527-816f-31ee7a0b7c98	👍
3e7f4cb4-d26f-4d98-ace2-09d980921d00	f30de478-b560-47f5-8588-8062ffc64a25	👍
300c98c8-2136-47f5-a738-d8e6eda86f4a	f30de478-b560-47f5-8588-8062ffc64a25	👏
ade4de71-12dc-489d-8ed0-c51f7fc26644	f30de478-b560-47f5-8588-8062ffc64a25	🎉
3e7f4cb4-d26f-4d98-ace2-09d980921d00	ee140dfb-14f6-41d3-b2b0-4e50764290d7	👍
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.notification (id, user_id, data, read_at, created_at, updated_at) FROM stdin;
fda9ad1c-f40c-4ca8-a125-af377e3656d6	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "6a3cae7c-a380-4fc7-beb5-5660e516d8f6", "mentionedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	2021-07-28 10:11:25.958+00	2021-07-28 10:11:12.456+00	2021-07-28 10:11:26.337166+00
8d32ba52-3fcb-43c5-946c-ab0dae5fb7b2	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "6a3cae7c-a380-4fc7-beb5-5660e516d8f6", "mentionedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	2021-07-28 10:11:59.159+00	2021-07-28 10:11:22.015+00	2021-07-28 10:11:59.573469+00
a6e605c0-baa3-4744-9b55-4fde2234f84d	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "6a3cae7c-a380-4fc7-beb5-5660e516d8f6", "mentionedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	2021-07-28 10:12:04.09+00	2021-07-28 10:12:00.623+00	2021-07-28 10:12:04.456698+00
6d52216f-5101-4aaf-ba9b-f02c40c354be	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "6a3cae7c-a380-4fc7-beb5-5660e516d8f6", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-07-28 10:14:20.944+00	2021-07-28 10:12:37.468+00	2021-07-28 10:14:21.109139+00
2b7b3124-69d0-404f-8602-1a36d7a730b9	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "9a0b5d33-e7ca-4a14-b693-44e988d4cc68", "mentionedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	2021-07-28 10:08:58.592+00	2021-07-28 10:08:09.108+00	2021-07-28 10:08:58.962735+00
d32f338b-426b-495b-ab05-7ad7c7ff7f1e	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "roomClosed", "payload": {"roomId": "a0f2285e-336a-4155-83a0-bc79fb27e670", "closedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	2021-08-01 16:07:57.507+00	2021-07-30 15:46:58.155+00	2021-08-01 16:07:57.273079+00
c97a9939-d4b3-4d15-92fb-3d05b6ac324b	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "9a0b5d33-e7ca-4a14-b693-44e988d4cc68", "mentionedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	2021-07-28 10:09:15.505+00	2021-07-28 10:08:22.553+00	2021-07-28 10:09:15.960905+00
616cd2ae-63fa-4079-80b3-ae250c76d683	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "6a3cae7c-a380-4fc7-beb5-5660e516d8f6", "mentionedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	2021-07-28 10:15:01.482+00	2021-07-28 10:14:47.575+00	2021-07-28 10:15:01.913869+00
f4721ad7-7b84-42ae-9873-e0b41651415f	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "d3a11bcb-6569-4772-a537-cf6f64388932", "mentionedByUserId": "82f57a9f-6615-4527-816f-31ee7a0b7c98"}}	2021-07-28 14:15:19.476+00	2021-07-28 14:06:23.251+00	2021-07-28 14:15:20.075058+00
342bf872-7e63-4cf1-b77d-3e0d536398e4	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "6a3cae7c-a380-4fc7-beb5-5660e516d8f6", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-07-28 10:18:34.59+00	2021-07-28 10:15:36.289+00	2021-07-28 10:18:34.734008+00
40295f9d-3d43-4686-8162-adc8c37991d2	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "6a3cae7c-a380-4fc7-beb5-5660e516d8f6", "mentionedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	2021-07-28 10:27:07.631+00	2021-07-28 10:18:22.92+00	2021-07-28 10:27:08.069838+00
0a0124c9-56a2-4a3e-ac55-44bba14923a0	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "6a3cae7c-a380-4fc7-beb5-5660e516d8f6", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-07-28 10:10:17.107+00	2021-07-28 10:08:29.74+00	2021-07-28 10:10:17.248375+00
22d1a007-1834-478d-8718-1bfd430783fb	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "6a3cae7c-a380-4fc7-beb5-5660e516d8f6", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-07-28 10:31:39.496+00	2021-07-28 10:27:58.236+00	2021-07-28 10:31:40.042124+00
0b8a351a-5a0e-4921-9a16-6302c47a1897	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "d3a11bcb-6569-4772-a537-cf6f64388932", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-07-28 14:20:52.915+00	2021-07-28 14:20:26.387+00	2021-07-28 14:20:53.697302+00
af30981a-ffa9-419d-a96a-c6e8dcdb6fdc	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicMention", "payload": {"topicId": "3a3ff258-367a-4236-b2ba-40b2619108db", "mentionedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-07-29 09:54:20+00	2021-07-28 16:00:32.734+00	2021-07-29 09:54:20.202924+00
89a6e53d-fc56-4967-98a0-2b321713d1d4	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "d3a11bcb-6569-4772-a537-cf6f64388932", "mentionedByUserId": "82f57a9f-6615-4527-816f-31ee7a0b7c98"}}	2021-07-29 13:31:19.268+00	2021-07-28 14:06:23.251+00	2021-07-29 13:31:19.742882+00
38e915d3-61a4-4720-9fd2-3bcf1745a5d5	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "5bd55ed1-8850-4e04-8ce3-65d6a03e7453", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-07-30 13:18:04.222+00	2021-07-30 12:55:50.507+00	2021-07-30 13:18:04.624861+00
dc297d82-f9c3-4344-9422-a296b02bd0fc	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "5bd55ed1-8850-4e04-8ce3-65d6a03e7453", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-02 06:22:40.943+00	2021-07-30 13:21:44.661+00	2021-08-02 06:22:40.702779+00
54490906-ebc9-4366-b6e3-a98f61f9444d	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "roomClosed", "payload": {"roomId": "a0f2285e-336a-4155-83a0-bc79fb27e670", "closedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	2021-08-02 06:23:00.201+00	2021-07-30 15:46:58.155+00	2021-08-02 06:22:59.892811+00
5e941525-d598-4dd0-bcfe-45de3ed438bc	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "9a0b5d33-e7ca-4a14-b693-44e988d4cc68", "mentionedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	2021-08-02 11:57:46.636+00	2021-07-28 10:08:17.183+00	2021-08-02 11:57:46.854967+00
cd11db19-16df-4514-9dab-69e91d7c7d12	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "roomClosed", "payload": {"roomId": "a0f2285e-336a-4155-83a0-bc79fb27e670", "closedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	2021-08-02 15:02:04.968+00	2021-07-30 15:46:58.155+00	2021-08-02 15:02:05.148996+00
1e8681e5-cca5-4dfb-bf0e-fc34a8009317	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "roomClosed", "payload": {"roomId": "a0f2285e-336a-4155-83a0-bc79fb27e670", "closedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	2021-07-30 17:48:32.809+00	2021-07-30 15:46:58.155+00	2021-07-30 17:48:33.097846+00
1baf1eaf-5dbf-417a-8ff5-b707b6010b0b	7879f271-4036-48be-befb-f08de052bcdc	{"type": "addedToRoom", "payload": {"roomId": "998147d4-f69c-4ffa-a304-d2db16a5527c", "addedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-02 06:57:17.417+00	2021-08-01 12:19:41.157+00	2021-08-02 06:57:17.838644+00
25e4f636-f09e-4cc5-b7b8-0c3b3be8ab1e	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "roomClosed", "payload": {"roomId": "a0f2285e-336a-4155-83a0-bc79fb27e670", "closedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	2021-08-02 07:27:33.192+00	2021-07-30 15:46:58.155+00	2021-08-02 07:27:33.168545+00
d43a974e-8ec5-4358-8613-3f87430c1a79	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "24a10f8e-2a51-48ec-ba9a-a756a822ce6e", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-02 08:03:31.503+00	2021-08-02 08:01:23.689+00	2021-08-02 08:03:31.502072+00
8346be3e-21c1-4a80-b4e5-0965f459b67f	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "24a10f8e-2a51-48ec-ba9a-a756a822ce6e", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-02 08:03:32.806+00	2021-08-02 07:46:24.054+00	2021-08-02 08:03:32.76093+00
6db1a8ef-a5b6-4ff5-a03e-d5e79eba364c	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "24a10f8e-2a51-48ec-ba9a-a756a822ce6e", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-02 08:23:16.491+00	2021-08-02 08:04:16.72+00	2021-08-02 08:23:16.515512+00
45f5cc2c-4019-4ff5-9d8f-3405e408fc2a	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "24a10f8e-2a51-48ec-ba9a-a756a822ce6e", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-02 08:23:17.728+00	2021-08-02 08:01:40.557+00	2021-08-02 08:23:17.718006+00
89fcf056-1893-40a6-bf67-1b36d363c450	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "addedToRoom", "payload": {"roomId": "91b35e7f-66f0-470f-b208-47f89ebd3771", "addedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-02 08:23:18.999+00	2021-08-02 07:54:33.114+00	2021-08-02 08:23:18.982849+00
c825ac31-7d9d-43d7-a4b7-aa68c3b7b893	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "24a10f8e-2a51-48ec-ba9a-a756a822ce6e", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-02 08:23:19.943+00	2021-08-02 07:54:25.689+00	2021-08-02 08:23:19.970335+00
cd220c99-f87c-464d-a642-9f1f29d610b0	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "addedToRoom", "payload": {"roomId": "480a9414-732c-4c7b-adfa-313c65f7031e", "addedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-02 09:33:53.985+00	2021-08-02 09:33:53.985+00
9251fc4c-cbeb-4bf6-b122-e4874aa98bd5	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "addedToRoom", "payload": {"roomId": "480a9414-732c-4c7b-adfa-313c65f7031e", "addedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-02 09:33:53.994+00	2021-08-02 09:33:53.994+00
d788be4b-5490-49b8-9d7b-a926a5abc5fd	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "addedToRoom", "payload": {"roomId": "480a9414-732c-4c7b-adfa-313c65f7031e", "addedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-02 09:33:54.01+00	2021-08-02 09:33:54.01+00
2a9e80bb-6494-4cd9-b6e3-cd4a67bfc761	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "addedToRoom", "payload": {"roomId": "d0eb5780-48e5-419a-b115-e936ed03ea23", "addedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-02 09:47:21.392+00	2021-08-02 08:31:19.959+00	2021-08-02 09:47:21.661478+00
556e3ba1-ca74-4051-89bd-05f716d9c0c9	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "roomClosed", "payload": {"roomId": "ac29a6fb-cade-4cfe-8ef1-f163334abfdc", "closedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-02 09:47:25.468+00	2021-08-02 08:37:25.91+00	2021-08-02 09:47:25.674973+00
d94954c7-b4d4-49a2-86d7-a479f1093717	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "roomClosed", "payload": {"roomId": "3fe4ae05-2ad1-4409-b487-b09c015c361c", "closedByUserId": "7a90bccb-346e-4933-aaeb-cdef732be976"}}	2021-08-04 07:42:02.001+00	2021-08-02 11:40:52.38+00	2021-08-04 07:42:02.331718+00
3c31dada-2968-47d1-8bf2-e2198b204811	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "addedToRoom", "payload": {"roomId": "5b2a4c7a-2b4f-4cf0-9591-f91a8454722b", "addedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-02 12:35:11.486+00	2021-08-02 09:34:50.682+00	2021-08-02 12:35:11.633348+00
003a3acd-49e3-4b83-84f5-a3683918b807	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "addedToRoom", "payload": {"roomId": "5b2a4c7a-2b4f-4cf0-9591-f91a8454722b", "addedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-02 14:06:51.071+00	2021-08-02 09:34:50.699+00	2021-08-02 14:06:51.464952+00
e08eb259-7a90-4a48-923f-b3f081512f1e	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "9b5f2c7c-4df1-48e6-89c1-1ae2d23e57c6", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-02 14:07:06.348+00	2021-08-02 09:19:12.372+00	2021-08-02 14:07:06.669893+00
394e23d8-7232-4d8d-8397-e862f645b16e	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "roomClosed", "payload": {"roomId": "a0f2285e-336a-4155-83a0-bc79fb27e670", "closedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	2021-08-04 07:42:03.366+00	2021-07-30 15:46:58.156+00	2021-08-04 07:42:03.690316+00
41649a27-4244-4714-848d-4d6771ea67d6	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "addedToRoom", "payload": {"roomId": "d8ad568e-e0b7-424a-84d4-09e1e3105e37", "addedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-02 12:10:23.826+00	2021-08-02 12:06:30.169+00	2021-08-02 12:10:24.04527+00
b4ff2f6f-cc5e-46d6-be64-03a3e673c8ba	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "addedToRoom", "payload": {"roomId": "d8ad568e-e0b7-424a-84d4-09e1e3105e37", "addedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-02 12:06:30.176+00	2021-08-02 12:06:30.176+00
81598cd8-ff6f-4694-8fdc-8272778f3a30	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "addedToRoom", "payload": {"roomId": "5b2a4c7a-2b4f-4cf0-9591-f91a8454722b", "addedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-02 12:10:09.51+00	2021-08-02 09:34:50.667+00	2021-08-02 12:10:09.614286+00
a2a9638f-2725-4e17-9066-2edc045dba5c	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "0cef7d91-df40-49f1-b9ea-be7b1457d560", "mentionedByUserId": "82f57a9f-6615-4527-816f-31ee7a0b7c98"}}	2021-08-02 12:32:18.991+00	2021-08-02 12:30:18.705+00	2021-08-02 12:32:19.370709+00
20528e02-0e32-4dc4-a4cf-c1a3816f3a86	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "topicMention", "payload": {"topicId": "24a10f8e-2a51-48ec-ba9a-a756a822ce6e", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-02 12:35:12.772+00	2021-08-02 07:53:31.811+00	2021-08-02 12:35:12.876776+00
7c8fcb30-8907-43ab-a40a-d650f2e9fb40	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "topicMention", "payload": {"topicId": "24a10f8e-2a51-48ec-ba9a-a756a822ce6e", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-02 12:35:13.784+00	2021-08-02 07:50:19.393+00	2021-08-02 12:35:13.863657+00
799d3768-537b-4b05-b7a4-deaf741c8a1b	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "0cef7d91-df40-49f1-b9ea-be7b1457d560", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-02 13:20:01.162+00	2021-08-02 13:20:01.162+00
e39935ac-2987-4760-92cd-e6332c8cb3fc	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "0cef7d91-df40-49f1-b9ea-be7b1457d560", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-02 13:52:38.971+00	2021-08-02 13:20:01.161+00	2021-08-02 13:52:39.320889+00
df3403ab-218c-42d3-898c-f437d0cf8649	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "0cef7d91-df40-49f1-b9ea-be7b1457d560", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-02 14:14:17.602+00	2021-08-02 14:14:17.602+00
c051852c-ff85-4022-a81a-05e187bc6723	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "0cef7d91-df40-49f1-b9ea-be7b1457d560", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-02 14:39:46.023+00	2021-08-02 14:11:50.144+00	2021-08-02 14:39:46.597148+00
ae3e1951-d3d8-4358-9a84-14f6eb317a7b	7879f271-4036-48be-befb-f08de052bcdc	{"type": "roomClosed", "payload": {"roomId": "998147d4-f69c-4ffa-a304-d2db16a5527c", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-02 15:02:38.058+00	2021-08-02 14:29:50.515+00	2021-08-02 15:02:38.317403+00
2a3cea70-2f38-4b7a-8496-597699707555	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "topicMention", "payload": {"topicId": "21870c63-93c0-4ec3-841e-bd813ae079d4", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-02 15:21:18.9+00	2021-08-02 14:51:46.56+00	2021-08-02 15:21:19.131807+00
05b67935-890d-4e9a-96ec-88b93f72e8cd	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "addedToRoom", "payload": {"roomId": "4a4c995d-bbb4-4573-b170-db617d336b7b", "addedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-03 07:24:22.71+00	2021-08-03 07:24:22.71+00
9994c9f9-f823-40e0-8915-4e39a59e9367	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "addedToRoom", "payload": {"roomId": "4a4c995d-bbb4-4573-b170-db617d336b7b", "addedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-03 07:24:22.823+00	2021-08-03 07:24:22.823+00
dee6edad-696e-4e56-a333-9daeaa751297	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "addedToRoom", "payload": {"roomId": "4a4c995d-bbb4-4573-b170-db617d336b7b", "addedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-03 07:35:46.74+00	2021-08-03 07:24:22.923+00	2021-08-03 07:35:46.95724+00
6497088f-3d0e-4537-8c50-995985621be4	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "addedToRoom", "payload": {"roomId": "4a4c995d-bbb4-4573-b170-db617d336b7b", "addedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-03 07:48:10.714+00	2021-08-03 07:24:22.8+00	2021-08-03 07:48:10.979156+00
76d75509-32ec-4cde-9a43-50a65555dc69	7879f271-4036-48be-befb-f08de052bcdc	{"type": "addedToRoom", "payload": {"roomId": "4a4c995d-bbb4-4573-b170-db617d336b7b", "addedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-03 08:04:27.222+00	2021-08-03 07:24:22.809+00	2021-08-03 08:04:27.536704+00
91efa2bc-8d63-417d-a97e-323887a3426a	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "topicMention", "payload": {"topicId": "14251444-47e0-46e6-a51f-d6cb6edc963c", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-03 12:17:55.594+00	2021-08-02 15:58:57.771+00	2021-08-03 12:17:56.112247+00
6da78af9-a906-4c18-967b-83b5fd4fea54	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "addedToRoom", "payload": {"roomId": "4a4c995d-bbb4-4573-b170-db617d336b7b", "addedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-04 07:42:00.4+00	2021-08-03 07:24:22.802+00	2021-08-04 07:42:00.725018+00
8e58938c-0fe7-4122-94e6-a4b22d700a8e	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "roomClosed", "payload": {"roomId": "96d19a68-eb9e-4458-bfcf-1a051e02c853", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-04 07:42:01.254+00	2021-08-02 14:30:24.892+00	2021-08-04 07:42:01.617971+00
3b65b335-9694-4faa-bb9b-6005dd2c42fa	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "addedToRoom", "payload": {"roomId": "79b7cb5f-f9f8-454e-967d-37cea8a81739", "addedByUserId": "7879f271-4036-48be-befb-f08de052bcdc"}}	2021-08-04 08:03:42.052+00	2021-08-03 08:30:13.666+00	2021-08-04 08:03:42.188319+00
95a5c161-5acf-471a-9eba-ce1c72911ab6	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "addedToRoom", "payload": {"roomId": "4a4c995d-bbb4-4573-b170-db617d336b7b", "addedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-04 16:49:31.312+00	2021-08-03 07:24:22.752+00	2021-08-04 16:49:31.366706+00
2ab57c2b-ca8c-4f58-ac9f-8102986a299d	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "addedToRoom", "payload": {"roomId": "79b7cb5f-f9f8-454e-967d-37cea8a81739", "addedByUserId": "7879f271-4036-48be-befb-f08de052bcdc"}}	2021-08-04 08:17:32.297+00	2021-08-03 08:30:20.761+00	2021-08-04 08:17:32.744698+00
e5f1f1e5-a025-4af4-8da9-3608d3575191	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "addedToRoom", "payload": {"roomId": "080b882d-03e2-4aaa-b058-eec287d29486", "addedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-04 16:49:32.634+00	2021-08-03 09:06:14.35+00	2021-08-04 16:49:32.692047+00
ad60cb26-9854-49b3-a3c0-ab7d846f4fc6	69324499-ae41-4ce4-bdaa-6072e0e5c2d3	{"type": "addedToRoom", "payload": {"roomId": "79b7cb5f-f9f8-454e-967d-37cea8a81739", "addedByUserId": "7879f271-4036-48be-befb-f08de052bcdc"}}	2021-08-10 08:12:14.026+00	2021-08-03 08:30:25.82+00	2021-08-10 08:12:14.103897+00
3df10311-46c0-4048-9d23-711f5dd65127	7879f271-4036-48be-befb-f08de052bcdc	{"type": "addedToRoom", "payload": {"roomId": "080b882d-03e2-4aaa-b058-eec287d29486", "addedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-03 09:21:24.656+00	2021-08-03 09:06:24.471+00	2021-08-03 09:21:24.861829+00
fc4f7327-4e6d-40e2-8f83-11c02f103156	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "roomClosed", "payload": {"roomId": "5b2a4c7a-2b4f-4cf0-9591-f91a8454722b", "closedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-03 09:34:38.833+00	2021-08-03 09:34:38.833+00
98880332-cc58-4d3e-9d68-11e89598a601	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "roomClosed", "payload": {"roomId": "5b2a4c7a-2b4f-4cf0-9591-f91a8454722b", "closedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-03 09:34:38.833+00	2021-08-03 09:34:38.833+00
1e9e0326-0655-48b8-9684-206059150f5a	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "addedToRoom", "payload": {"roomId": "5fcf1905-d2cd-495f-9080-56fe218949b6", "addedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-03 09:38:54.683+00	2021-08-03 09:38:54.683+00
615dfb24-55b8-44fb-87c4-6185f1df8c9e	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "addedToRoom", "payload": {"roomId": "5fcf1905-d2cd-495f-9080-56fe218949b6", "addedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-03 09:38:54.685+00	2021-08-03 09:38:54.685+00
93fa5517-67cd-4884-8db9-038855b7934f	31f1de58-af98-4946-997c-622cb20d9504	{"type": "addedToRoom", "payload": {"roomId": "5fcf1905-d2cd-495f-9080-56fe218949b6", "addedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-03 10:06:55.678+00	2021-08-03 09:38:54.751+00	2021-08-03 10:06:55.993005+00
9bad4730-c500-4b8e-a1a4-47f86e0fbf8f	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "90430aff-6410-494f-ad50-94aaf8eb0292", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-03 10:20:24.555+00	2021-08-03 10:20:24.555+00
3f7e3070-4b11-48b0-9c4c-1561dba9a8a3	7879f271-4036-48be-befb-f08de052bcdc	{"type": "roomClosed", "payload": {"roomId": "79b7cb5f-f9f8-454e-967d-37cea8a81739", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-03 11:02:29.991+00	2021-08-03 10:54:04.624+00	2021-08-03 11:02:30.249153+00
0ff8ecb9-c8d4-4adc-9dfa-4436b1a4580b	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "roomClosed", "payload": {"roomId": "5fff4746-afc9-41db-b296-239b2f5e647f", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-03 11:16:06.168+00	2021-08-03 10:55:59.615+00	2021-08-03 11:16:06.311212+00
536404e2-5d29-4a8f-b9d0-a479dfe25b0f	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "roomClosed", "payload": {"roomId": "1a5e64f1-64be-4e14-9cb0-a32d2bd7a6a1", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-03 11:16:08.093+00	2021-08-03 10:55:25.091+00	2021-08-03 11:16:08.202803+00
d810e46c-81cd-4701-abd0-e9decb2a7e94	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "roomClosed", "payload": {"roomId": "6e4da0c9-f54b-4523-a43c-3c41e97fa886", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-03 11:16:09.738+00	2021-08-03 10:54:51.415+00	2021-08-03 11:16:09.861967+00
13ba9540-168a-4e80-b755-e87791698476	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "roomClosed", "payload": {"roomId": "79b7cb5f-f9f8-454e-967d-37cea8a81739", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-03 11:16:11.816+00	2021-08-03 10:54:04.625+00	2021-08-03 11:16:11.95882+00
587a8d16-e592-49e7-a09b-6cf7076692a7	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "0ac27c5b-fa0a-4079-aa7a-5f76d332081d", "mentionedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-03 11:16:16.132+00	2021-08-03 09:34:58.016+00	2021-08-03 11:16:16.285217+00
dddb7a5a-fd86-4d7d-bd58-593b7d980b91	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "e0c2d69a-acfd-4080-9bcd-71fbc7f3a182", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-03 11:16:20.42+00	2021-08-03 10:57:18.795+00	2021-08-03 11:16:20.571917+00
14d53f0a-cb12-43f1-8a6d-e60a3774732d	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "addedToRoom", "payload": {"roomId": "5fcf1905-d2cd-495f-9080-56fe218949b6", "addedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-03 12:17:52.359+00	2021-08-03 09:38:54.705+00	2021-08-03 12:17:52.911155+00
5b947944-229e-424c-ad0d-5c26ac67c707	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "roomClosed", "payload": {"roomId": "5b2a4c7a-2b4f-4cf0-9591-f91a8454722b", "closedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-03 12:17:53.574+00	2021-08-03 09:34:38.834+00	2021-08-03 12:17:54.062818+00
4a6cb6e8-5766-414f-9c4b-40a29c8b1513	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "topicClosed", "payload": {"topicId": "14251444-47e0-46e6-a51f-d6cb6edc963c", "closedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-03 12:17:56.629+00	2021-08-02 15:57:49.073+00	2021-08-03 12:17:57.155193+00
d14d9b90-c8e0-4741-a1fd-6facb36e844f	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "addedToRoom", "payload": {"roomId": "4cbd5610-191c-4d6e-bbd0-981c8a1f91f7", "addedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-03 12:42:56.104+00	2021-08-03 12:42:56.104+00
6b8cb521-ec8f-4718-8668-08a5c27a46f8	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "roomClosed", "payload": {"roomId": "5fff4746-afc9-41db-b296-239b2f5e647f", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-04 07:41:56.716+00	2021-08-03 10:55:59.615+00	2021-08-04 07:41:57.034921+00
511dcae3-69a0-421e-8876-3da92c9eb8ab	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "roomClosed", "payload": {"roomId": "79b7cb5f-f9f8-454e-967d-37cea8a81739", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-04 07:41:57.71+00	2021-08-03 10:54:04.625+00	2021-08-04 07:41:58.035006+00
e359f76a-7297-4435-b604-0b652abb90de	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "addedToRoom", "payload": {"roomId": "080b882d-03e2-4aaa-b058-eec287d29486", "addedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-04 07:41:59.05+00	2021-08-03 09:06:32.518+00	2021-08-04 07:41:59.389461+00
287b8431-b983-40bf-8734-d5aa8a2c4079	31f1de58-af98-4946-997c-622cb20d9504	{"type": "topicMention", "payload": {"topicId": "90430aff-6410-494f-ad50-94aaf8eb0292", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-04 09:57:35.211+00	2021-08-03 10:20:24.555+00	2021-08-04 09:57:35.337156+00
abf4c36b-4d9a-465a-bd57-bfde5abca763	31f1de58-af98-4946-997c-622cb20d9504	{"type": "addedToRoom", "payload": {"roomId": "5fcf1905-d2cd-495f-9080-56fe218949b6", "addedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-04 09:57:37.149+00	2021-08-03 10:13:35.241+00	2021-08-04 09:57:37.277423+00
8ab1e0c3-e362-447e-af97-ecefcb73f8bc	69324499-ae41-4ce4-bdaa-6072e0e5c2d3	{"type": "roomClosed", "payload": {"roomId": "79b7cb5f-f9f8-454e-967d-37cea8a81739", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-10 08:12:12.784+00	2021-08-03 10:54:04.625+00	2021-08-10 08:12:12.886525+00
f66c154d-c9ee-4cb5-931c-b7d5423cc882	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "0e98bd99-373d-42e4-9d94-aea273569288", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-03 13:04:32.598+00	2021-08-03 12:52:09.801+00	2021-08-03 13:04:32.833221+00
8bfcdf49-be2c-402f-b17a-5f485e786a64	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "e0c2d69a-acfd-4080-9bcd-71fbc7f3a182", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-03 13:11:53.966+00	2021-08-03 13:11:53.966+00
08a0379b-d681-423e-a597-6d27500f6156	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "e0c2d69a-acfd-4080-9bcd-71fbc7f3a182", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-03 13:12:13.174+00	2021-08-03 13:12:13.174+00
dd54bc52-ce0f-4747-a8a9-bd16b2cabcbe	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "e0c2d69a-acfd-4080-9bcd-71fbc7f3a182", "mentionedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	\N	2021-08-03 13:28:46.626+00	2021-08-03 13:28:46.626+00
cf28f724-b0b2-4f7d-b335-1ab00f58009c	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "e0c2d69a-acfd-4080-9bcd-71fbc7f3a182", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-03 13:30:27.555+00	2021-08-03 13:11:53.967+00	2021-08-03 13:30:27.768201+00
30840170-eac0-4b61-9189-e6b359e0688e	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicClosed", "payload": {"topicId": "f4525973-166d-46e6-9d1b-e6f9e786c1ca", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-03 14:17:36.45+00	2021-08-03 14:17:36.45+00
dfeac5b1-bf0b-4c1e-b8cb-d95981a358ff	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicClosed", "payload": {"topicId": "f4525973-166d-46e6-9d1b-e6f9e786c1ca", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-03 14:17:36.45+00	2021-08-03 14:17:36.45+00
030d79c1-b9c9-43b0-9622-c3c1f894af4f	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicClosed", "payload": {"topicId": "f4525973-166d-46e6-9d1b-e6f9e786c1ca", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-03 14:17:36.451+00	2021-08-03 14:17:36.451+00
30f4fcc0-6542-48ee-835b-2bad018f2a6c	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicMention", "payload": {"topicId": "0ac27c5b-fa0a-4079-aa7a-5f76d332081d", "mentionedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-03 15:12:04.795+00	2021-08-03 14:29:47.266+00	2021-08-03 15:12:05.008264+00
4ed202a2-0aa3-4a44-87cb-9759e77fd132	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicClosed", "payload": {"topicId": "f4525973-166d-46e6-9d1b-e6f9e786c1ca", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-03 14:49:31.403+00	2021-08-03 14:17:36.451+00	2021-08-03 14:49:31.538733+00
38f993ed-8792-47b1-a13a-5fdf794fd8ad	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "roomClosed", "payload": {"roomId": "d8ad568e-e0b7-424a-84d4-09e1e3105e37", "closedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-03 15:13:32.017+00	2021-08-03 15:13:32.017+00
2f54de5a-ced3-4099-be5e-85645a718c9d	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "roomClosed", "payload": {"roomId": "d8ad568e-e0b7-424a-84d4-09e1e3105e37", "closedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-03 15:13:32.017+00	2021-08-03 15:13:32.017+00
349ed9bc-d76a-45c1-9271-89fcbf62c99e	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "roomClosed", "payload": {"roomId": "4a4c995d-bbb4-4573-b170-db617d336b7b", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-03 15:19:22.024+00	2021-08-03 15:19:22.024+00
8e7e9131-3376-45b3-8af6-d48bc1aecad0	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "roomClosed", "payload": {"roomId": "4a4c995d-bbb4-4573-b170-db617d336b7b", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-03 15:19:22.024+00	2021-08-03 15:19:22.024+00
04005e09-db50-4b4e-aeb4-a27f120490ab	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "roomClosed", "payload": {"roomId": "4a4c995d-bbb4-4573-b170-db617d336b7b", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-03 15:19:22.024+00	2021-08-03 15:19:22.024+00
e91b1f02-82ba-43c7-a54c-d03e3b383335	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicClosed", "payload": {"topicId": "f4525973-166d-46e6-9d1b-e6f9e786c1ca", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-03 16:06:30.483+00	2021-08-03 14:17:36.451+00	2021-08-03 16:06:30.697309+00
dd9c9b14-0866-480f-8060-79b2151cccb1	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicClosed", "payload": {"topicId": "f4525973-166d-46e6-9d1b-e6f9e786c1ca", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-04 07:59:14.141+00	2021-08-03 14:17:36.45+00	2021-08-04 07:59:14.253124+00
6138c12e-5326-454b-afc1-1cd73457181c	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "roomClosed", "payload": {"roomId": "4a4c995d-bbb4-4573-b170-db617d336b7b", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-04 08:02:43.437+00	2021-08-03 15:19:22.024+00	2021-08-04 08:02:43.522467+00
b6d61332-c79a-4550-9ea2-eace85ad3ed4	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "addedToRoom", "payload": {"roomId": "0fe6380c-f7eb-4652-a4cc-fd778a4a36b5", "addedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-04 16:49:26.046+00	2021-08-03 14:14:43.195+00	2021-08-04 16:49:26.111381+00
eef19259-d7a6-47ed-a399-4e6b4275ddb9	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "topicMention", "payload": {"topicId": "9dacd262-bec8-49db-9fb9-1088bb738ad6", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-03 16:41:19.224+00	2021-08-03 15:06:14.478+00	2021-08-03 16:41:19.899574+00
80d28f2c-5b94-4f09-8a04-526a9ea6bdd0	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicMention", "payload": {"topicId": "0ac27c5b-fa0a-4079-aa7a-5f76d332081d", "mentionedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-04 07:41:54.643+00	2021-08-03 14:29:47.266+00	2021-08-04 07:41:54.964511+00
85e5a16d-1e57-412a-8dc1-a5bd6bd140af	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicClosed", "payload": {"topicId": "f4525973-166d-46e6-9d1b-e6f9e786c1ca", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-04 07:41:55.765+00	2021-08-03 14:17:36.451+00	2021-08-04 07:41:56.082833+00
bbaf3a30-3155-47ed-a340-90bc92217af6	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "e0c2d69a-acfd-4080-9bcd-71fbc7f3a182", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-04 16:49:27.042+00	2021-08-03 13:12:13.174+00	2021-08-04 16:49:27.089228+00
a20e19ef-a8dc-4d47-bdd8-837261e33372	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "e0c2d69a-acfd-4080-9bcd-71fbc7f3a182", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-04 16:49:27.933+00	2021-08-03 13:11:53.967+00	2021-08-04 16:49:27.986305+00
af23ca8f-6329-4855-b12d-edbc9eed715a	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "527f10e5-ce40-4d9f-9db3-1eda40155817", "mentionedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	\N	2021-08-03 15:50:51.905+00	2021-08-03 15:50:51.905+00
66f563cf-42a0-4d8b-9a84-738a1f4025e9	7879f271-4036-48be-befb-f08de052bcdc	{"type": "roomClosed", "payload": {"roomId": "4a4c995d-bbb4-4573-b170-db617d336b7b", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-03 15:58:28.484+00	2021-08-03 15:19:22.024+00	2021-08-03 15:58:28.638202+00
736e30fa-45c7-47b9-bc40-46685792f360	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "560f0651-59d7-4641-ab99-24776dceddc6", "mentionedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	\N	2021-08-03 16:06:04.158+00	2021-08-03 16:06:04.158+00
448e153f-4df9-48ab-861a-022615faa73b	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "527f10e5-ce40-4d9f-9db3-1eda40155817", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-03 16:06:09.152+00	2021-08-03 15:56:55.467+00	2021-08-03 16:06:09.382126+00
9b2ccad1-1b3c-4e1d-9311-488dea5f2bbd	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "addedToRoom", "payload": {"roomId": "bc605602-de72-4582-80bf-426980cfc9e3", "addedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	\N	2021-08-04 07:16:48.409+00	2021-08-04 07:16:48.409+00
b759767f-813b-4475-8bf3-705653a37d3f	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "527f10e5-ce40-4d9f-9db3-1eda40155817", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-03 16:06:25.892+00	2021-08-03 15:12:31.011+00	2021-08-03 16:06:26.128004+00
cf7c6f0f-fc8f-42cc-bd45-85bf6199c282	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "roomClosed", "payload": {"roomId": "4a4c995d-bbb4-4573-b170-db617d336b7b", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-03 16:13:37.875+00	2021-08-03 15:19:22.024+00	2021-08-03 16:13:38.150152+00
fb16e136-83d6-412b-95d0-dc503572f1fe	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "527f10e5-ce40-4d9f-9db3-1eda40155817", "mentionedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	\N	2021-08-03 16:14:04.481+00	2021-08-03 16:14:04.481+00
473c1acf-55ff-411d-874d-2d58a9f95292	7879f271-4036-48be-befb-f08de052bcdc	{"type": "roomClosed", "payload": {"roomId": "080b882d-03e2-4aaa-b058-eec287d29486", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-03 16:38:12.24+00	2021-08-03 16:32:11.576+00	2021-08-03 16:38:12.451929+00
e486927f-17bc-477e-9219-3d04374dc004	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "90430aff-6410-494f-ad50-94aaf8eb0292", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-03 17:02:18.245+00	2021-08-03 17:02:18.245+00
10130128-cd92-4585-9609-37157d5acdc8	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "90430aff-6410-494f-ad50-94aaf8eb0292", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-03 17:33:47.328+00	2021-08-03 17:33:47.328+00
42e972ca-4f7e-475a-955d-f3e7c1d88f3d	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "aff449b5-f49f-4417-8258-8a671518962e", "mentionedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	\N	2021-08-04 07:16:18.659+00	2021-08-04 07:16:18.659+00
a5893ea3-24e0-4995-8e1e-bf1037000fd8	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "aff449b5-f49f-4417-8258-8a671518962e", "mentionedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	\N	2021-08-04 07:16:18.659+00	2021-08-04 07:16:18.659+00
078ac6d4-e7c9-43b6-8cc4-9d865dd45c90	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "addedToRoom", "payload": {"roomId": "bc605602-de72-4582-80bf-426980cfc9e3", "addedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	\N	2021-08-04 07:16:44.401+00	2021-08-04 07:16:44.401+00
805c822a-1879-45de-a5ee-fdd39bcc142c	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "roomClosed", "payload": {"roomId": "8f9e0e7e-4b81-452e-be93-e93c14d26941", "closedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	\N	2021-08-04 07:29:10.423+00	2021-08-04 07:29:10.423+00
9981476b-e260-4e07-bba9-5c0dd91ee044	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "roomClosed", "payload": {"roomId": "8f9e0e7e-4b81-452e-be93-e93c14d26941", "closedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	\N	2021-08-04 07:29:10.423+00	2021-08-04 07:29:10.423+00
b8ba3c5f-4033-4261-bb34-15e88c2bff8e	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "roomClosed", "payload": {"roomId": "8f9e0e7e-4b81-452e-be93-e93c14d26941", "closedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	\N	2021-08-04 07:29:10.424+00	2021-08-04 07:29:10.424+00
5e0f005d-9196-45ae-9570-416789251bb9	7879f271-4036-48be-befb-f08de052bcdc	{"type": "addedToRoom", "payload": {"roomId": "cf9197da-a54f-4735-b942-771424d3983d", "addedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	2021-08-04 07:34:50.876+00	2021-08-04 07:10:44.262+00	2021-08-04 07:34:51.056217+00
f8228d87-c686-4daf-9053-54deff028eb3	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "addedToRoom", "payload": {"roomId": "f017aa72-71af-4c4b-90ca-64e031cb76e0", "addedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-04 07:39:50.784+00	2021-08-04 07:38:47.474+00	2021-08-04 07:39:51.039109+00
2913eb36-5ea5-456b-94dc-e72f62cd4012	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "roomClosed", "payload": {"roomId": "080b882d-03e2-4aaa-b058-eec287d29486", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-04 07:41:52.649+00	2021-08-03 16:32:11.576+00	2021-08-04 07:41:52.998549+00
a4c43c06-1ad9-498a-95de-c37af0e1d214	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "roomClosed", "payload": {"roomId": "4a4c995d-bbb4-4573-b170-db617d336b7b", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-04 07:41:53.755+00	2021-08-03 15:19:22.024+00	2021-08-04 07:41:54.09443+00
8cae86ce-396f-48ff-a1a5-394a016be9cc	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "afb7181d-d0ed-49bb-9d1d-451fa0f70eff", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-04 07:57:27.535+00	2021-08-04 07:57:27.535+00
99af0d8e-250f-4a1f-900c-7939c57716b8	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "roomClosed", "payload": {"roomId": "080b882d-03e2-4aaa-b058-eec287d29486", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-04 08:03:33.293+00	2021-08-03 16:32:11.576+00	2021-08-04 08:03:33.431931+00
a0b9e712-414c-4ab3-98a4-b7e9c219e624	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "3ffa3d3c-ee5f-4ec6-b12d-33128498ce3f", "mentionedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	2021-08-04 09:05:27.41+00	2021-08-04 07:41:42.032+00	2021-08-04 09:05:27.624787+00
5b233855-a655-445a-a1ad-99bed2c58dd9	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "560f0651-59d7-4641-ab99-24776dceddc6", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-04 09:24:03.819+00	2021-08-03 16:36:41.474+00	2021-08-04 09:24:04.180602+00
818f42f7-3858-497e-980e-9965001752d2	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "afb7181d-d0ed-49bb-9d1d-451fa0f70eff", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-04 07:57:42.586+00	2021-08-04 07:57:42.586+00
9507710a-b27c-4867-a13d-66dfb3d63802	31f1de58-af98-4946-997c-622cb20d9504	{"type": "topicMention", "payload": {"topicId": "fe1bcd9c-03c9-48e7-85c5-b4de3ade9287", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-04 10:13:18.521+00	2021-08-04 10:13:18.521+00
04e5c1f3-8f20-44c3-8af6-807972eee5af	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "fe1bcd9c-03c9-48e7-85c5-b4de3ade9287", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-04 10:14:07.644+00	2021-08-04 10:14:07.644+00
4d05f082-766f-46da-a5e8-be17ee21a2ba	31f1de58-af98-4946-997c-622cb20d9504	{"type": "topicMention", "payload": {"topicId": "fe1bcd9c-03c9-48e7-85c5-b4de3ade9287", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-04 10:14:07.644+00	2021-08-04 10:14:07.644+00
7e22ae2f-3e26-42e0-9ce6-14a079b29435	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "addedToRoom", "payload": {"roomId": "cf9197da-a54f-4735-b942-771424d3983d", "addedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	2021-08-04 08:03:03.178+00	2021-08-04 07:10:52.281+00	2021-08-04 08:03:03.267012+00
3bc44dbc-f506-4fe8-a00b-ed480a61205f	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "517f6e60-ddc7-48ad-b7c4-6a08167efc09", "mentionedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-04 08:38:28.707+00	2021-08-04 08:21:52.356+00	2021-08-04 08:38:29.003461+00
1a591eb4-0aed-4d6c-aea1-b0d28849a870	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "fe1bcd9c-03c9-48e7-85c5-b4de3ade9287", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-04 10:23:55.482+00	2021-08-04 10:23:55.482+00
8514c4a8-e719-4b0c-b40e-989b607696de	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicMention", "payload": {"topicId": "61659450-ba26-43cf-bc54-dbdeee7a39c8", "mentionedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	2021-08-04 08:47:39.519+00	2021-08-04 08:46:55.883+00	2021-08-04 08:47:39.635319+00
03d7f40a-2e64-4a61-b411-a4acd64e5674	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "fe1bcd9c-03c9-48e7-85c5-b4de3ade9287", "mentionedByUserId": "31f1de58-af98-4946-997c-622cb20d9504"}}	\N	2021-08-04 08:57:42.634+00	2021-08-04 08:57:42.634+00
f37a8239-6d18-4622-b7ac-d2307c66688a	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "fe1bcd9c-03c9-48e7-85c5-b4de3ade9287", "mentionedByUserId": "31f1de58-af98-4946-997c-622cb20d9504"}}	\N	2021-08-04 08:57:42.634+00	2021-08-04 08:57:42.634+00
df0a2afa-8a7c-440c-974c-7d1401b6131e	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "90430aff-6410-494f-ad50-94aaf8eb0292", "mentionedByUserId": "31f1de58-af98-4946-997c-622cb20d9504"}}	\N	2021-08-04 09:04:59.298+00	2021-08-04 09:04:59.298+00
cf41c119-9e0b-43e8-aa5d-368ca1b83323	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "90430aff-6410-494f-ad50-94aaf8eb0292", "mentionedByUserId": "31f1de58-af98-4946-997c-622cb20d9504"}}	\N	2021-08-04 09:04:59.298+00	2021-08-04 09:04:59.298+00
bf9dd2d9-a2d2-46cd-8c19-5832380501bd	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "addedToRoom", "payload": {"roomId": "cf9197da-a54f-4735-b942-771424d3983d", "addedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-04 09:05:25.063+00	2021-08-04 08:20:03.356+00	2021-08-04 09:05:25.294912+00
23ee8b35-67cc-470c-bf4e-a808ee8d63d8	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "fe1bcd9c-03c9-48e7-85c5-b4de3ade9287", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-04 09:05:37.398+00	2021-08-04 09:05:37.398+00
009076ac-8aa4-48bc-9029-e5826150106d	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "addedToRoom", "payload": {"roomId": "3c15419b-a818-4680-9e64-10f8596c8d58", "addedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-04 11:28:36.943+00	2021-08-04 10:10:17.634+00	2021-08-04 11:28:37.164254+00
4ab98315-3941-4ba1-b91d-8f6378780333	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicMention", "payload": {"topicId": "517f6e60-ddc7-48ad-b7c4-6a08167efc09", "mentionedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-04 11:29:04.704+00	2021-08-04 08:22:05.322+00	2021-08-04 11:29:04.945619+00
14a1b8ee-043c-45cf-942b-0c4ad66d639e	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "25522813-086e-4ef1-ad4b-eac1740a83eb", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-04 13:22:42.739+00	2021-08-04 13:22:42.739+00
ca0d3a48-5c21-4307-bfd6-3f4e5e3e4064	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "addedToRoom", "payload": {"roomId": "8e4ce16b-d503-4077-869e-fa0eb955e555", "addedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-04 13:26:25.366+00	2021-08-04 13:26:25.366+00
a1600f4b-77a0-43f8-b44b-4865f9981f69	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "addedToRoom", "payload": {"roomId": "8e4ce16b-d503-4077-869e-fa0eb955e555", "addedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-04 13:26:25.381+00	2021-08-04 13:26:25.381+00
05ecd75d-3228-4984-bb84-ed04aeae772d	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "fe1bcd9c-03c9-48e7-85c5-b4de3ade9287", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-04 14:54:26.526+00	2021-08-04 10:14:07.645+00	2021-08-04 14:54:27.053861+00
cb7547dc-2a22-4611-b929-e62ba58c553c	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "90430aff-6410-494f-ad50-94aaf8eb0292", "mentionedByUserId": "31f1de58-af98-4946-997c-622cb20d9504"}}	2021-08-04 14:54:28.174+00	2021-08-04 09:04:59.298+00	2021-08-04 14:54:28.663446+00
dd27be28-9ccb-4a82-9311-9e1ac4b0a033	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "fe1bcd9c-03c9-48e7-85c5-b4de3ade9287", "mentionedByUserId": "31f1de58-af98-4946-997c-622cb20d9504"}}	2021-08-04 14:54:29.106+00	2021-08-04 08:57:42.633+00	2021-08-04 14:54:29.593774+00
2f816bfc-3498-4d2d-9243-ed9359d23b16	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "addedToRoom", "payload": {"roomId": "3c15419b-a818-4680-9e64-10f8596c8d58", "addedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-04 16:49:22.642+00	2021-08-04 10:10:17.63+00	2021-08-04 16:49:22.704133+00
0fadee2e-181c-401b-861a-b563a982c786	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "addedToRoom", "payload": {"roomId": "8e4ce16b-d503-4077-869e-fa0eb955e555", "addedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-05 06:15:15.883+00	2021-08-04 13:26:25.396+00	2021-08-05 06:15:16.076578+00
fb426876-8c74-401d-a922-771f66ce0832	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "d1243295-e6ac-4da5-866f-582a9b419a4f", "mentionedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-05 07:17:59.631+00	2021-08-03 14:14:51.27+00	2021-08-05 07:17:59.675051+00
8ae12332-adeb-44a8-8b89-e3f65147a4ad	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "addedToRoom", "payload": {"roomId": "8e4ce16b-d503-4077-869e-fa0eb955e555", "addedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-04 13:26:25.481+00	2021-08-04 13:26:25.481+00
f982e988-3bea-4d4d-8363-62f168e4d8cb	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicClosed", "payload": {"topicId": "fdc4af0e-d8ac-46de-a2fa-0e0045529c67", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-04 13:31:13.25+00	2021-08-04 13:29:03.805+00	2021-08-04 13:31:13.453517+00
1c8e3ce5-7e9e-44be-a484-0897c1334384	7879f271-4036-48be-befb-f08de052bcdc	{"type": "addedToRoom", "payload": {"roomId": "8e4ce16b-d503-4077-869e-fa0eb955e555", "addedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-04 13:31:14.291+00	2021-08-04 13:26:25.365+00	2021-08-04 13:31:14.432742+00
e7ca6374-9173-4614-8afc-0457a70a9190	7879f271-4036-48be-befb-f08de052bcdc	{"type": "addedToRoom", "payload": {"roomId": "3c15419b-a818-4680-9e64-10f8596c8d58", "addedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-04 13:31:16.022+00	2021-08-04 10:10:17.632+00	2021-08-04 13:31:16.15644+00
c192d94d-3e7d-472d-b5bf-a76b46b2c18d	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicClosed", "payload": {"topicId": "fdc4af0e-d8ac-46de-a2fa-0e0045529c67", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-05 07:17:47.337+00	2021-08-04 13:29:03.805+00	2021-08-05 07:17:47.394174+00
14b058ab-c3b9-4e3b-ad06-8d89c9ecbd81	31f1de58-af98-4946-997c-622cb20d9504	{"type": "topicMention", "payload": {"topicId": "25522813-086e-4ef1-ad4b-eac1740a83eb", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-04 13:22:42.739+00	2021-08-04 16:32:20.017303+00
efa6c60d-717c-4c98-89e1-97e0c6539aca	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "25522813-086e-4ef1-ad4b-eac1740a83eb", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-05 08:24:42.007+00	2021-08-05 08:24:42.007+00
36206230-9b1d-43a9-a17b-68fa298029ef	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "roomClosed", "payload": {"roomId": "3c15419b-a818-4680-9e64-10f8596c8d58", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-05 07:17:52.21+00	2021-08-04 15:13:11.995+00	2021-08-05 07:17:52.26232+00
6b4f98bc-370a-43c4-a104-9a10684db479	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "25522813-086e-4ef1-ad4b-eac1740a83eb", "mentionedByUserId": "82f57a9f-6615-4527-816f-31ee7a0b7c98"}}	\N	2021-08-04 18:03:16.618+00	2021-08-04 18:03:16.618+00
03f51133-8fc9-4fee-bc14-82eee34ba1a6	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "25522813-086e-4ef1-ad4b-eac1740a83eb", "mentionedByUserId": "82f57a9f-6615-4527-816f-31ee7a0b7c98"}}	\N	2021-08-04 18:03:16.619+00	2021-08-04 18:03:16.619+00
fdabce18-00a8-43a2-9721-30983211fae3	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "25522813-086e-4ef1-ad4b-eac1740a83eb", "mentionedByUserId": "31f1de58-af98-4946-997c-622cb20d9504"}}	\N	2021-08-04 18:39:49.007+00	2021-08-04 18:39:49.007+00
380c75c1-17a8-43e9-ae75-d986ea34b80b	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "25522813-086e-4ef1-ad4b-eac1740a83eb", "mentionedByUserId": "31f1de58-af98-4946-997c-622cb20d9504"}}	\N	2021-08-04 18:39:49.008+00	2021-08-04 18:39:49.008+00
842d1d6a-aaad-49c3-adf1-053e1201d7b9	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "25522813-086e-4ef1-ad4b-eac1740a83eb", "mentionedByUserId": "31f1de58-af98-4946-997c-622cb20d9504"}}	\N	2021-08-04 18:39:49.008+00	2021-08-04 18:39:49.008+00
0ddc2d88-e62f-4097-af78-175eb02fe320	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicClosed", "payload": {"topicId": "fdc4af0e-d8ac-46de-a2fa-0e0045529c67", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-05 06:14:58.524+00	2021-08-04 13:29:03.805+00	2021-08-05 06:14:58.784162+00
e4dbc46d-34bf-48d1-be7b-ecb05462ff5b	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "roomClosed", "payload": {"roomId": "3c15419b-a818-4680-9e64-10f8596c8d58", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-05 06:15:14.44+00	2021-08-04 15:13:11.995+00	2021-08-05 06:15:14.665198+00
e7eec7b7-7fd8-4e39-85a7-62d41fbfe970	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "addedToRoom", "payload": {"roomId": "59d6787a-84d5-4aa8-acb3-6122055f159d", "addedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	\N	2021-08-05 07:06:46.724+00	2021-08-05 07:06:46.724+00
5126f2e4-e2b6-4376-9ca4-c16c3a185ba5	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "7fe5f795-13fb-4cb0-b888-a06f3ddf6cac", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-05 07:58:56.351+00	2021-08-05 07:58:56.351+00
e780b144-db50-4850-be32-56d4949a0585	31f1de58-af98-4946-997c-622cb20d9504	{"type": "topicMention", "payload": {"topicId": "25522813-086e-4ef1-ad4b-eac1740a83eb", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-05 08:24:42.007+00	2021-08-05 08:24:42.007+00
dd0717e3-f360-434c-8d0c-e25f8bbba044	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "addedToRoom", "payload": {"roomId": "8e4ce16b-d503-4077-869e-fa0eb955e555", "addedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-11 12:04:24.919+00	2021-08-04 13:26:25.368+00	2021-08-11 12:04:24.711707+00
9338dec9-4c3c-40bc-9a73-9598dd4837de	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "aff449b5-f49f-4417-8258-8a671518962e", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-05 10:15:16.406+00	2021-08-05 10:15:16.406+00
c7186077-0f08-4bb5-b64c-58d981f7784d	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "addedToRoom", "payload": {"roomId": "8e4ce16b-d503-4077-869e-fa0eb955e555", "addedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	2021-08-09 07:52:41.068+00	2021-08-04 13:26:25.363+00	2021-08-09 07:52:41.114126+00
b3836610-340f-4b0b-9645-07de2ca69152	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "896e7658-05a4-449b-8c25-89c4c7d11be1", "mentionedByUserId": "25db9c19-f84e-40d8-9dfb-ee94478ca40a"}}	\N	2021-08-05 11:44:01.72+00	2021-08-05 11:44:01.72+00
30fd4743-fd0b-49ed-a658-1b35c2ff2e35	7879f271-4036-48be-befb-f08de052bcdc	{"type": "roomClosed", "payload": {"roomId": "3c15419b-a818-4680-9e64-10f8596c8d58", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-05 12:37:54.302+00	2021-08-04 15:13:11.996+00	2021-08-05 12:37:54.410815+00
b3edbeb6-1f47-49e4-8613-f335cd9ae227	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "7d401447-9caf-4713-812c-f1072d277d5c", "mentionedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	\N	2021-08-06 09:48:29.193+00	2021-08-06 09:48:29.193+00
579d6b7c-a3a4-4f24-a3b2-d250c3a743e5	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "addedToRoom", "payload": {"roomId": "f61f40f0-4ece-419c-a554-d659ac990ba7", "addedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-08 18:21:05.296+00	2021-08-08 18:21:05.296+00
91d16e26-4a16-4292-a12e-d47d14e253a2	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "addedToRoom", "payload": {"roomId": "b1e4d74b-916e-44cd-a8ce-cc685927058c", "addedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-08 18:34:20.451+00	2021-08-08 18:34:20.451+00
1e13c4fe-2ebe-4d0a-9a53-3a7dde3018eb	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "f927973b-9861-482c-92b6-390df01bf193", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-08 18:38:56.301+00	2021-08-08 18:38:56.301+00
116e99e8-07d2-4329-a7c1-691699c7cc84	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "addedToRoom", "payload": {"roomId": "f61f40f0-4ece-419c-a554-d659ac990ba7", "addedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-09 06:17:50.668+00	2021-08-08 18:21:01.284+00	2021-08-09 06:17:50.899891+00
a3548f4b-5fc8-4212-b2a0-c30e1d63d9f9	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "addedToRoom", "payload": {"roomId": "f61f40f0-4ece-419c-a554-d659ac990ba7", "addedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-09 07:08:18.419+00	2021-08-08 18:21:08.304+00	2021-08-09 07:08:18.596082+00
e69a4e95-30bd-48bc-a8a5-0f327f9f2ea7	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "addedToRoom", "payload": {"roomId": "fe514238-04d9-4388-9084-4b823511bb9f", "addedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	2021-08-09 07:31:16.792+00	2021-08-09 07:28:55.68+00	2021-08-09 07:31:16.902514+00
94f42add-28f6-4e9c-b560-93161c43cd48	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicMention", "payload": {"topicId": "7d401447-9caf-4713-812c-f1072d277d5c", "mentionedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	2021-08-09 07:24:52.717+00	2021-08-09 07:11:06.499+00	2021-08-09 07:24:53.063946+00
c99a9144-e1b7-436d-817a-c000fb87d271	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "addedToRoom", "payload": {"roomId": "fe514238-04d9-4388-9084-4b823511bb9f", "addedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	\N	2021-08-09 07:28:55.678+00	2021-08-09 07:28:55.678+00
3d77d720-afd0-414c-b478-e4b9c10157a9	4d783a5d-2c91-4cc0-89f6-42d0b5d189c8	{"type": "addedToRoom", "payload": {"roomId": "fe514238-04d9-4388-9084-4b823511bb9f", "addedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	\N	2021-08-09 07:28:55.677+00	2021-08-09 07:28:55.676+00
2f87cb94-7da1-4739-9302-854099979ac4	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "addedToRoom", "payload": {"roomId": "fe514238-04d9-4388-9084-4b823511bb9f", "addedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	\N	2021-08-09 07:28:55.784+00	2021-08-09 07:28:55.784+00
504013ee-4397-4699-8a37-d91288cc17c6	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "addedToRoom", "payload": {"roomId": "fe514238-04d9-4388-9084-4b823511bb9f", "addedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	\N	2021-08-09 07:28:55.785+00	2021-08-09 07:28:55.785+00
655d83db-e4e2-41ba-90aa-494d4bd1e56d	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "dced53b7-5ea8-453b-b0d2-8b1aa88e87fd", "mentionedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	\N	2021-08-09 07:39:53.286+00	2021-08-09 07:39:53.286+00
2f0de83c-e8e9-4932-92fe-19b4372dfba7	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "f927973b-9861-482c-92b6-390df01bf193", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-09 07:45:09.079+00	2021-08-09 07:45:09.079+00
e9ef236a-2dae-40cb-9bd7-e566cae16773	7879f271-4036-48be-befb-f08de052bcdc	{"type": "addedToRoom", "payload": {"roomId": "fe514238-04d9-4388-9084-4b823511bb9f", "addedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	2021-08-09 07:51:49.555+00	2021-08-09 07:28:55.694+00	2021-08-09 07:51:49.760376+00
9de19068-c85f-4031-9466-775b41c448ed	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "addedToRoom", "payload": {"roomId": "f61f40f0-4ece-419c-a554-d659ac990ba7", "addedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-09 07:49:14.975+00	2021-08-08 18:20:57.274+00	2021-08-09 07:49:15.036343+00
4c9d599e-f33f-4470-91ac-f7385a23fe5b	7879f271-4036-48be-befb-f08de052bcdc	{"type": "addedToRoom", "payload": {"roomId": "f61f40f0-4ece-419c-a554-d659ac990ba7", "addedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-09 07:51:50.417+00	2021-08-08 18:21:35.66+00	2021-08-09 07:51:50.556424+00
cf4b2f55-cee7-4ec4-87b9-e6e9231af742	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "roomClosed", "payload": {"roomId": "b1e4d74b-916e-44cd-a8ce-cc685927058c", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-09 08:01:31.766+00	2021-08-09 08:01:31.766+00
e1cc81f5-4783-4a4b-b774-823e7458b557	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "roomClosed", "payload": {"roomId": "b1e4d74b-916e-44cd-a8ce-cc685927058c", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-09 08:01:31.766+00	2021-08-09 08:01:31.766+00
29304564-f78d-4c70-af74-ffeff3b401f1	69324499-ae41-4ce4-bdaa-6072e0e5c2d3	{"type": "addedToRoom", "payload": {"roomId": "fe514238-04d9-4388-9084-4b823511bb9f", "addedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	2021-08-10 08:12:11.362+00	2021-08-09 07:28:55.814+00	2021-08-10 08:12:11.456077+00
a58e1809-1f54-474d-a481-78231cf8d316	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "addedToRoom", "payload": {"roomId": "fe514238-04d9-4388-9084-4b823511bb9f", "addedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	2021-08-11 11:54:05.097+00	2021-08-09 07:28:55.81+00	2021-08-11 11:54:05.488205+00
d60e8787-806f-46ed-9269-8aba30ce7a5a	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "dab455dc-a825-4287-816a-29310bd8c38f", "mentionedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	2021-08-11 11:54:12.276+00	2021-08-09 07:39:15.24+00	2021-08-11 11:54:12.631045+00
4eacb5ab-f72a-40c6-a5bd-052351cdab92	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "addedToRoom", "payload": {"roomId": "fe514238-04d9-4388-9084-4b823511bb9f", "addedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	2021-08-11 12:04:17.927+00	2021-08-09 07:28:55.681+00	2021-08-11 12:04:17.733299+00
63d27c8c-d608-4cc0-ab78-5f5df77b8e69	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "topicMention", "payload": {"topicId": "f927973b-9861-482c-92b6-390df01bf193", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-11 12:04:19.077+00	2021-08-08 18:38:56.301+00	2021-08-11 12:04:19.21422+00
13cbc164-0979-4610-900c-ac1a8c258f28	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "addedToRoom", "payload": {"roomId": "f61f40f0-4ece-419c-a554-d659ac990ba7", "addedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-11 12:04:26.802+00	2021-08-08 18:20:52.261+00	2021-08-11 12:04:26.596343+00
0497ccd2-0b09-4a08-88a6-d2514f33db43	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "roomClosed", "payload": {"roomId": "54afb680-f7ad-4ac3-973e-a1a53c4b7c68", "closedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-09 14:23:31.382+00	2021-08-09 14:23:31.382+00
bbd8ac81-0df0-4a48-966a-67f38188092d	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicMention", "payload": {"topicId": "dab455dc-a825-4287-816a-29310bd8c38f", "mentionedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	2021-08-10 07:13:29.663+00	2021-08-10 06:30:00.116+00	2021-08-10 07:13:30.12649+00
c59bdaae-f472-446a-bce6-959da2d6f92f	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "88a55d5f-6013-444c-8cf5-97cb0a64e189", "mentionedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	\N	2021-08-09 09:58:53.362+00	2021-08-09 09:58:53.362+00
c120392b-4610-48f1-974f-246d3d46934c	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "18982189-4823-414e-b456-65e09d1237fa", "mentionedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	\N	2021-08-09 11:55:12.163+00	2021-08-09 11:55:12.163+00
6a9b300f-e9f9-44f8-b4ec-58a07e49afcc	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "18982189-4823-414e-b456-65e09d1237fa", "mentionedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	\N	2021-08-09 11:55:12.164+00	2021-08-09 11:55:12.164+00
21eaaef8-826d-47b7-9001-12ab1bc2e7b1	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "24a10f8e-2a51-48ec-ba9a-a756a822ce6e", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-09 12:02:47.892+00	2021-08-09 11:41:09.661+00	2021-08-09 12:02:48.026628+00
42eab553-6582-4784-bff2-b9066e423c1e	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "bf3664b6-87c1-4932-9b2f-5cc5178c5fa0", "mentionedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	\N	2021-08-09 13:35:10.505+00	2021-08-09 13:35:10.505+00
26c81690-c77d-42a0-ada8-efd168fcf719	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "9fa70a66-1e09-4dc4-b5da-4fd46e6f3cb4", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-09 13:35:17.469+00	2021-08-09 13:35:17.469+00
b36b0e6c-3258-47f6-87f5-9dfd8fbf7b03	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicMention", "payload": {"topicId": "2a2c495e-2921-45b6-9dd6-5c8245c63ea0", "mentionedByUserId": "7879f271-4036-48be-befb-f08de052bcdc"}}	2021-08-10 05:57:25.198+00	2021-08-10 05:56:45.408+00	2021-08-10 05:57:25.469256+00
ca219c80-da2b-4687-abb3-726de0fd8f7c	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "aa52c52f-fddc-45a4-945a-ed73947d74c9", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-09 14:17:47.474+00	2021-08-09 14:17:47.474+00
d8d56185-4d53-4032-ba65-324d0d2dbc7d	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "aa52c52f-fddc-45a4-945a-ed73947d74c9", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-09 14:17:47.474+00	2021-08-09 14:17:47.474+00
23633f89-8149-4d81-ba78-69ea2111df77	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "addedToRoom", "payload": {"roomId": "5fcf1905-d2cd-495f-9080-56fe218949b6", "addedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-09 14:18:41.619+00	2021-08-09 14:18:41.619+00
5e47829d-b5b0-46eb-97ae-9e16543b2f1d	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "roomClosed", "payload": {"roomId": "54afb680-f7ad-4ac3-973e-a1a53c4b7c68", "closedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-09 14:23:31.382+00	2021-08-09 14:23:31.382+00
f7a4598a-e002-41a6-ae68-35e6ef2490dd	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicMention", "payload": {"topicId": "18982189-4823-414e-b456-65e09d1237fa", "mentionedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	2021-08-10 06:10:10.812+00	2021-08-09 14:15:29.935+00	2021-08-10 06:10:11.073258+00
63df2df7-c4bd-4603-92f4-116de30c1ebf	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "5402f67d-3e1f-46df-a5de-71d8f162e9c6", "mentionedByUserId": "82f57a9f-6615-4527-816f-31ee7a0b7c98"}}	\N	2021-08-10 07:29:39.79+00	2021-08-10 07:29:39.79+00
0199b607-dbaa-4bb1-aedd-67f9aed5854b	69324499-ae41-4ce4-bdaa-6072e0e5c2d3	{"type": "topicMention", "payload": {"topicId": "2a2c495e-2921-45b6-9dd6-5c8245c63ea0", "mentionedByUserId": "7a90bccb-346e-4933-aaeb-cdef732be976"}}	2021-08-10 08:12:06.296+00	2021-08-10 06:00:09.114+00	2021-08-10 08:12:06.406192+00
578904ed-d08a-46b7-a727-a55798347195	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "5402f67d-3e1f-46df-a5de-71d8f162e9c6", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-10 08:15:12.907+00	2021-08-10 08:15:12.907+00
edab89d3-f9a4-48d7-90de-d0bd13f09612	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "5402f67d-3e1f-46df-a5de-71d8f162e9c6", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-10 08:15:12.908+00	2021-08-10 08:15:12.908+00
4c5ffd7d-eb2c-41b5-99fb-bffce6deac69	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "5402f67d-3e1f-46df-a5de-71d8f162e9c6", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-10 08:16:17.047+00	2021-08-10 08:16:17.047+00
5b2530c5-9ec9-46f0-81ee-0d8b8dc37559	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "5402f67d-3e1f-46df-a5de-71d8f162e9c6", "mentionedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	\N	2021-08-10 08:35:42.804+00	2021-08-10 08:35:42.804+00
307941d3-359b-4e9f-87a2-7d3dd915d53c	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "2a2c495e-2921-45b6-9dd6-5c8245c63ea0", "mentionedByUserId": "7879f271-4036-48be-befb-f08de052bcdc"}}	2021-08-10 14:49:48.497+00	2021-08-10 05:56:45.408+00	2021-08-10 14:49:48.561405+00
93059b6c-8489-476e-9d56-9baf476c8280	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "topicMention", "payload": {"topicId": "aa52c52f-fddc-45a4-945a-ed73947d74c9", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-11 12:04:15.031+00	2021-08-09 14:17:47.474+00	2021-08-11 12:04:14.826433+00
8d3c83e3-1e8e-4faa-a58d-0d4a54721bad	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "7da19367-6883-4946-b4e6-789744d03b89", "mentionedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	\N	2021-08-10 08:47:33.851+00	2021-08-10 08:47:33.851+00
077f7e15-7268-4dd2-812b-e335508e22e4	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "7da19367-6883-4946-b4e6-789744d03b89", "mentionedByUserId": "82f57a9f-6615-4527-816f-31ee7a0b7c98"}}	\N	2021-08-10 08:50:42.494+00	2021-08-10 08:50:42.494+00
16c330ab-4297-4fca-8548-6744b9ec02fb	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "795d9351-a097-48a7-9c5a-7a0409341af4", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-10 09:47:11.446+00	2021-08-10 09:46:52.237+00	2021-08-10 09:47:11.398302+00
0ec1ddd1-588c-44ed-88bd-8a0cd8838959	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicMention", "payload": {"topicId": "795d9351-a097-48a7-9c5a-7a0409341af4", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-10 09:51:43.172+00	2021-08-10 09:46:52.238+00	2021-08-10 09:51:43.39133+00
db086aa7-349c-470b-9cde-a718f093f3f0	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicMention", "payload": {"topicId": "795d9351-a097-48a7-9c5a-7a0409341af4", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-10 10:02:54.598+00	2021-08-10 09:46:52.238+00	2021-08-10 10:02:54.928461+00
1159df33-9d69-494a-904c-0b00802d3ff6	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicMention", "payload": {"topicId": "2a2c495e-2921-45b6-9dd6-5c8245c63ea0", "mentionedByUserId": "69324499-ae41-4ce4-bdaa-6072e0e5c2d3"}}	2021-08-10 10:53:19.454+00	2021-08-10 10:28:55.954+00	2021-08-10 10:53:19.672156+00
ff5104c8-2a22-4b48-9310-f281062d19df	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "addedToRoom", "payload": {"roomId": "cd3f1512-50cd-44af-bd4b-b7d0c822ded1", "addedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-10 12:49:02.209+00	2021-08-10 12:49:02.209+00
1dfb6277-f005-4d52-94ba-cb82b817079e	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "7672d7dc-4c22-4227-93b3-949c05a5cb6c", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-10 12:49:40.883+00	2021-08-10 12:49:40.883+00
bdaffa73-cb37-4b1b-b78b-78e7cf5b8ad3	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "1178d608-e933-4853-bd1c-ccd3dc255d52", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-10 14:40:48.059+00	2021-08-10 11:21:38.901+00	2021-08-10 14:40:48.282999+00
5b0796d7-6c0a-4129-9c89-eee434b61f7e	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "aa52c52f-fddc-45a4-945a-ed73947d74c9", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-10 13:20:11.69+00	2021-08-10 13:20:11.69+00
43a5f84b-471c-4ae1-ac2d-4db571637ef3	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "67fc219e-072b-4b22-b295-0fd462aae098", "mentionedByUserId": "7879f271-4036-48be-befb-f08de052bcdc"}}	2021-08-11 12:28:41.909+00	2021-08-10 15:19:05.333+00	2021-08-11 12:28:42.03102+00
4a03edb0-7bb0-42af-a9eb-e65501745b94	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "67fc219e-072b-4b22-b295-0fd462aae098", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-10 13:56:56.084+00	2021-08-10 13:56:56.084+00
fd1387d3-3f22-46e5-8f31-bb2b7533762a	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "795d9351-a097-48a7-9c5a-7a0409341af4", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-10 14:40:50.634+00	2021-08-10 09:46:52.238+00	2021-08-10 14:40:50.860228+00
0f11fa08-c4c1-48f6-b677-c7aa0e74d808	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicClosed", "payload": {"topicId": "afb7181d-d0ed-49bb-9d1d-451fa0f70eff", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-10 13:59:48.578+00	2021-08-10 13:59:48.578+00
0159e381-411c-4cc0-81a3-ece793bfc5f7	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "795d9351-a097-48a7-9c5a-7a0409341af4", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-10 14:19:49.384+00	2021-08-10 09:46:52.238+00	2021-08-10 14:19:49.483955+00
c19f524d-1309-4b77-9247-bf6c729018f6	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "a3bb912d-893d-40b9-bda9-5f74c5da9d2a", "mentionedByUserId": "7879f271-4036-48be-befb-f08de052bcdc"}}	2021-08-10 14:20:19.519+00	2021-08-10 11:32:32.933+00	2021-08-10 14:20:19.587528+00
2646c498-9edd-4a1e-8d26-3655df2c9f0c	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "d86f2de5-853a-435a-ac57-dfc200e6a846", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-10 14:35:38.471+00	2021-08-10 14:23:29.212+00	2021-08-10 14:35:38.555637+00
8164bf0b-492e-4dd0-8686-1e0ff1809273	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "7da19367-6883-4946-b4e6-789744d03b89", "mentionedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	2021-08-10 14:41:30.238+00	2021-08-10 08:47:33.851+00	2021-08-10 14:41:30.506291+00
ff98c11b-3013-4881-b814-f87b2d7ea9c3	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "7da19367-6883-4946-b4e6-789744d03b89", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-10 14:44:05.59+00	2021-08-10 14:44:05.59+00
99dcfbca-fe3f-4790-9efd-85fd15a6ed14	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "7da19367-6883-4946-b4e6-789744d03b89", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-10 15:08:21.663+00	2021-08-10 15:08:21.663+00
a01684ee-e4a5-4b20-b784-b7b4a163ebd1	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicMention", "payload": {"topicId": "9ba172a0-a1a7-4caa-a221-b8a2704e5a9c", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-10 15:23:13.084+00	2021-08-10 13:55:47.964+00	2021-08-10 15:23:13.365928+00
b76948af-2782-4f67-91bf-1976a2626f73	69324499-ae41-4ce4-bdaa-6072e0e5c2d3	{"type": "topicMention", "payload": {"topicId": "7ef55206-4dc3-44f9-89f2-8f141237b3a7", "mentionedByUserId": "7a90bccb-346e-4933-aaeb-cdef732be976"}}	\N	2021-08-10 15:36:35.454+00	2021-08-10 15:36:35.454+00
a9c3a48d-9519-4cbc-95c9-9680b4ce1b15	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "7da19367-6883-4946-b4e6-789744d03b89", "mentionedByUserId": "82f57a9f-6615-4527-816f-31ee7a0b7c98"}}	\N	2021-08-10 15:37:51.652+00	2021-08-10 15:37:51.652+00
9b1e6e71-2aca-4ce3-ba20-1fb259ff28cd	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "7da19367-6883-4946-b4e6-789744d03b89", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-10 16:01:07.641+00	2021-08-10 16:01:07.641+00
2576e9a9-33c0-41f0-b076-3a1413951ee7	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "1178d608-e933-4853-bd1c-ccd3dc255d52", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-10 16:31:15.477+00	2021-08-10 16:31:15.477+00
5fcaeb77-f245-42e8-84d3-0ed3bf2b961e	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "7da19367-6883-4946-b4e6-789744d03b89", "mentionedByUserId": "82f57a9f-6615-4527-816f-31ee7a0b7c98"}}	\N	2021-08-10 16:33:13.73+00	2021-08-10 16:33:13.73+00
dc276187-85cf-4360-a74b-e1c6e3ef5c3e	31f1de58-af98-4946-997c-622cb20d9504	{"type": "topicMention", "payload": {"topicId": "c9d1165c-a8f3-496d-8825-74c1cf81684e", "mentionedByUserId": "82f57a9f-6615-4527-816f-31ee7a0b7c98"}}	\N	2021-08-11 07:25:54.722+00	2021-08-11 07:25:54.722+00
688d599c-7eea-4a1b-ba9d-66e0bb6de2cd	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "addedToRoom", "payload": {"roomId": "994e9e80-7f3e-4e64-8896-6b4ed419eab5", "addedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-11 07:26:46.983+00	2021-08-11 07:17:51.186+00	2021-08-11 07:26:47.074329+00
1b3b3662-792a-4836-8540-3ce84aa488c8	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "c9d1165c-a8f3-496d-8825-74c1cf81684e", "mentionedByUserId": "82f57a9f-6615-4527-816f-31ee7a0b7c98"}}	\N	2021-08-11 07:31:43.376+00	2021-08-11 07:31:43.376+00
d9f7480a-3682-4e9a-9e72-b9982679742c	31f1de58-af98-4946-997c-622cb20d9504	{"type": "topicMention", "payload": {"topicId": "c9d1165c-a8f3-496d-8825-74c1cf81684e", "mentionedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	\N	2021-08-11 07:35:43.338+00	2021-08-11 07:35:43.338+00
08a43176-87ad-4fd1-ac6e-9a7a99a0eede	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "addedToRoom", "payload": {"roomId": "878f2cfa-faac-4e47-9b98-aa6b96ed2ae8", "addedByUserId": "7879f271-4036-48be-befb-f08de052bcdc"}}	\N	2021-08-11 07:48:00.996+00	2021-08-11 07:48:00.996+00
a3de96fe-7b20-4888-ab65-c6b2aa9c3e9c	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "addedToRoom", "payload": {"roomId": "878f2cfa-faac-4e47-9b98-aa6b96ed2ae8", "addedByUserId": "7879f271-4036-48be-befb-f08de052bcdc"}}	\N	2021-08-11 07:48:01+00	2021-08-11 07:48:01+00
7310a5b3-0dfb-4d32-b64b-5b6cff9a4dfc	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "addedToRoom", "payload": {"roomId": "994e9e80-7f3e-4e64-8896-6b4ed419eab5", "addedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-11 07:50:12.545+00	2021-08-11 07:17:51.179+00	2021-08-11 07:50:13.056148+00
1a79964d-d4ae-474e-a37d-dafc4154ded7	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "addedToRoom", "payload": {"roomId": "6d2dce9f-bbb3-42f8-ab65-e6582e2ec894", "addedByUserId": "7879f271-4036-48be-befb-f08de052bcdc"}}	2021-08-11 07:51:20.237+00	2021-08-11 07:48:29.367+00	2021-08-11 07:51:20.615217+00
222dffd9-3db6-4d34-af35-e8a5090f7069	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "c9d1165c-a8f3-496d-8825-74c1cf81684e", "mentionedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	\N	2021-08-11 08:16:59.975+00	2021-08-11 08:16:59.975+00
896bdda9-a562-4a69-a130-aa3d29e16045	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicMention", "payload": {"topicId": "368d5a03-d0f1-4af7-9ce4-dc55cb7571a3", "mentionedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-11 09:33:23.969+00	2021-08-11 08:32:41.958+00	2021-08-11 09:33:24.165521+00
e96cccd9-fabd-4cc0-afcd-032331811232	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "roomClosed", "payload": {"roomId": "d1762c9b-d55e-4034-baf0-04cd28a79452", "closedByUserId": "7879f271-4036-48be-befb-f08de052bcdc"}}	2021-08-11 12:27:50.47+00	2021-08-11 07:53:05.795+00	2021-08-11 12:27:50.631043+00
d2f89669-8180-4274-a403-0ff1b20aa0ed	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "addedToRoom", "payload": {"roomId": "6d2dce9f-bbb3-42f8-ab65-e6582e2ec894", "addedByUserId": "7879f271-4036-48be-befb-f08de052bcdc"}}	2021-08-11 12:28:02.503+00	2021-08-11 07:48:29.361+00	2021-08-11 12:28:02.631064+00
d98d2547-7a45-4759-bb0a-4972410f2ebb	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "7ef55206-4dc3-44f9-89f2-8f141237b3a7", "mentionedByUserId": "69324499-ae41-4ce4-bdaa-6072e0e5c2d3"}}	2021-08-11 12:28:40.283+00	2021-08-10 18:29:35.189+00	2021-08-11 12:28:40.419374+00
abd667e2-64e1-4f68-a933-dc13a0027271	69324499-ae41-4ce4-bdaa-6072e0e5c2d3	{"type": "roomClosed", "payload": {"roomId": "d1762c9b-d55e-4034-baf0-04cd28a79452", "closedByUserId": "7879f271-4036-48be-befb-f08de052bcdc"}}	2021-08-13 09:13:41.191+00	2021-08-11 07:53:05.794+00	2021-08-13 09:13:41.283492+00
dde64881-3669-49a6-aaf5-ce737c73487a	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "80439d52-b5f8-40d3-af3f-7947802431a3", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-11 09:20:17.707+00	2021-08-11 09:20:17.707+00
fb755281-7f26-416a-8055-bc8739b7ee53	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "40464e44-d5df-48cb-b862-5a9b5d4ffa11", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-11 10:02:45.236+00	2021-08-11 10:02:45.236+00
6d09198c-a34b-499b-8f41-c3ab50a10afa	7879f271-4036-48be-befb-f08de052bcdc	{"type": "addedToRoom", "payload": {"roomId": "9ad7b1c3-f056-4a27-99a9-fb1eace15d2c", "addedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-11 11:05:01.967+00	2021-08-11 10:14:50.186+00	2021-08-11 11:05:02.177661+00
0def73dc-2585-4829-9686-58cc4d2c15da	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "1f144355-4143-4f39-8331-d688eed9a1b8", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-11 13:01:55.565+00	2021-08-11 13:01:55.565+00
c0116ae0-25ce-41f3-8a08-d2fc4ce9972a	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicMention", "payload": {"topicId": "9ba172a0-a1a7-4caa-a221-b8a2704e5a9c", "mentionedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	2021-08-11 11:31:14.034+00	2021-08-11 11:14:40.477+00	2021-08-11 11:31:14.205339+00
d62fd679-8639-402b-bcce-b4591a7cb210	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "9ba172a0-a1a7-4caa-a221-b8a2704e5a9c", "mentionedByUserId": "7879f271-4036-48be-befb-f08de052bcdc"}}	2021-08-11 11:54:20.275+00	2021-08-11 11:43:22.711+00	2021-08-11 11:54:20.630089+00
54ba39fe-ad90-4a21-be4e-08b1ae41d566	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicMention", "payload": {"topicId": "e0a7b845-b083-4f2c-a93b-38bd9d04df10", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-11 11:55:05.588+00	2021-08-11 11:52:43.09+00	2021-08-11 11:55:05.79588+00
2ddf50a4-369c-4a01-b9fc-bbc4f59091bd	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "topicMention", "payload": {"topicId": "795d9351-a097-48a7-9c5a-7a0409341af4", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-11 12:04:12.043+00	2021-08-10 09:46:52.238+00	2021-08-11 12:04:11.846692+00
e13d4e7a-5305-4f6f-819d-a8a373adfe31	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "topicMention", "payload": {"topicId": "5402f67d-3e1f-46df-a5de-71d8f162e9c6", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-11 12:04:12.998+00	2021-08-10 08:15:12.908+00	2021-08-11 12:04:12.796976+00
e95ec369-4730-4a26-afd3-133fa2d10237	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "topicMention", "payload": {"topicId": "9fa70a66-1e09-4dc4-b5da-4fd46e6f3cb4", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-11 12:04:15.591+00	2021-08-09 13:21:50.224+00	2021-08-11 12:04:15.377343+00
af85bc9f-caaa-44d6-ac9d-475723e9cd40	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "topicMention", "payload": {"topicId": "24a10f8e-2a51-48ec-ba9a-a756a822ce6e", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-11 12:04:16.619+00	2021-08-09 11:40:22.592+00	2021-08-11 12:04:16.416702+00
bdac851e-79a7-4225-8df0-977a808c2592	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "addedToRoom", "payload": {"roomId": "b1e4d74b-916e-44cd-a8ce-cc685927058c", "addedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-11 12:04:19.719+00	2021-08-08 18:34:20.452+00	2021-08-11 12:04:19.506569+00
58ba7bc1-ab36-4257-913c-f97803eaabe7	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "9ba172a0-a1a7-4caa-a221-b8a2704e5a9c", "mentionedByUserId": "7879f271-4036-48be-befb-f08de052bcdc"}}	\N	2021-08-11 12:06:29.329+00	2021-08-11 12:06:29.329+00
a708b5d9-6fb6-4fd9-9981-8b76632fa305	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "8b62b6ad-fe39-40aa-b8b5-44284657b286", "mentionedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	\N	2021-08-11 14:36:48.624+00	2021-08-11 14:36:48.624+00
a39334bc-6e8b-4051-bd86-e31fe06f6fab	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "7ef55206-4dc3-44f9-89f2-8f141237b3a7", "mentionedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-11 12:27:43.342+00	2021-08-11 09:24:41.597+00	2021-08-11 12:27:43.502251+00
aaf84aed-9ddf-4c5d-9202-d7e4d1d61b34	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicMention", "payload": {"topicId": "3a5978db-27ab-471b-88cf-fd7431226e17", "mentionedByUserId": "69324499-ae41-4ce4-bdaa-6072e0e5c2d3"}}	2021-08-11 12:45:28.695+00	2021-08-11 12:02:22.453+00	2021-08-11 12:45:28.95332+00
e38403d4-95fc-4657-bbae-43a5a7663614	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicMention", "payload": {"topicId": "9ba172a0-a1a7-4caa-a221-b8a2704e5a9c", "mentionedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	2021-08-11 12:45:38.208+00	2021-08-11 12:00:03.987+00	2021-08-11 12:45:38.415932+00
afd1aef5-9aef-4411-923b-92f05f16ab44	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "addedToRoom", "payload": {"roomId": "3ed5a820-5ff3-4102-92e2-6386467ae980", "addedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-11 13:26:17.773+00	2021-08-11 10:11:28.614+00	2021-08-11 13:26:18.123889+00
33b1faaf-a490-47df-8033-6c49c1368f9e	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "roomClosed", "payload": {"roomId": "6d2dce9f-bbb3-42f8-ab65-e6582e2ec894", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	\N	2021-08-11 14:50:29.111+00	2021-08-11 14:50:29.111+00
ac07999a-81e1-42dc-a834-dffce9447def	7879f271-4036-48be-befb-f08de052bcdc	{"type": "roomClosed", "payload": {"roomId": "6d2dce9f-bbb3-42f8-ab65-e6582e2ec894", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-11 21:42:07.068+00	2021-08-11 14:50:29.111+00	2021-08-11 21:42:07.261989+00
4d378947-7815-4f03-b7db-00e9cf88a471	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "roomClosed", "payload": {"roomId": "6d2dce9f-bbb3-42f8-ab65-e6582e2ec894", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-12 06:54:11.205+00	2021-08-11 14:50:29.112+00	2021-08-12 06:54:11.455746+00
487fd5a4-f634-41ab-856c-a7abcd490370	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "roomClosed", "payload": {"roomId": "3ed5a820-5ff3-4102-92e2-6386467ae980", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-12 06:54:19.567+00	2021-08-11 13:57:09.806+00	2021-08-12 06:54:19.731724+00
013dc38e-332c-4d44-bed1-8537a56c560b	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicClosed", "payload": {"topicId": "87b6097f-6232-43f6-a3a8-0e1c3104212d", "closedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	\N	2021-08-11 15:09:33.159+00	2021-08-11 15:09:33.159+00
8c90ea28-7801-4c8f-ae10-a9d7d1e8f7eb	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "topicMention", "payload": {"topicId": "1f144355-4143-4f39-8331-d688eed9a1b8", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-11 15:37:27.009+00	2021-08-11 13:01:55.565+00	2021-08-11 15:37:27.081696+00
85cbdeb4-786c-4ef3-9d57-a27bca6ad459	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "roomClosed", "payload": {"roomId": "6d2dce9f-bbb3-42f8-ab65-e6582e2ec894", "closedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	2021-08-11 15:41:27.424+00	2021-08-11 15:11:22.413+00	2021-08-11 15:41:27.473155+00
7d749ba6-0759-4461-8b67-f3e407f017ac	7879f271-4036-48be-befb-f08de052bcdc	{"type": "roomClosed", "payload": {"roomId": "9ad7b1c3-f056-4a27-99a9-fb1eace15d2c", "closedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-11 21:41:59.062+00	2021-08-11 15:34:40.692+00	2021-08-11 21:41:59.238128+00
db4b0630-64f8-421f-804c-f063de2541e4	7879f271-4036-48be-befb-f08de052bcdc	{"type": "roomClosed", "payload": {"roomId": "6d2dce9f-bbb3-42f8-ab65-e6582e2ec894", "closedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	2021-08-11 21:42:03.437+00	2021-08-11 15:11:22.412+00	2021-08-11 21:42:03.557441+00
8d66e08e-4f8f-4864-bb5b-a2477caa8f6f	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicClosed", "payload": {"topicId": "87b6097f-6232-43f6-a3a8-0e1c3104212d", "closedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	2021-08-11 21:42:08.896+00	2021-08-11 15:09:33.159+00	2021-08-11 21:42:09.096185+00
cc506e35-bf4f-49ba-8927-e20fb545458a	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicClosed", "payload": {"topicId": "87b6097f-6232-43f6-a3a8-0e1c3104212d", "closedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	2021-08-12 06:54:27.684+00	2021-08-11 15:09:33.159+00	2021-08-12 06:54:27.861638+00
8798ba04-97f1-4975-a793-40f64fecfa9b	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "roomClosed", "payload": {"roomId": "6d2dce9f-bbb3-42f8-ab65-e6582e2ec894", "closedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	2021-08-12 06:55:02.364+00	2021-08-11 15:11:22.413+00	2021-08-12 06:55:02.57057+00
d3489e61-3a13-401f-9e9c-85b60286fd07	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "2163c29f-a8cb-4c64-b7bc-8f76d42e3485", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-12 07:22:26.441+00	2021-08-12 07:22:26.441+00
bb1a2762-cca3-4a0f-a1e9-559f385e8152	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "0558025b-be7f-429b-9736-4764a82933f0", "mentionedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	\N	2021-08-12 07:23:41.588+00	2021-08-12 07:23:41.588+00
fa47ea27-a1f3-4423-8420-e00d3900bc1f	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "6f4d0bba-4553-4747-bd7b-0f91ab5617a2", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-12 09:29:02.283+00	2021-08-12 09:29:02.283+00
b49200c4-0daf-4f4c-894f-9a3ed240739f	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "6f4d0bba-4553-4747-bd7b-0f91ab5617a2", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-12 11:37:50.997+00	2021-08-12 11:37:50.997+00
05e1c274-1a52-4313-9115-c70858e558cb	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "roomClosed", "payload": {"roomId": "994e9e80-7f3e-4e64-8896-6b4ed419eab5", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-12 08:00:37.605+00	2021-08-12 08:00:37.605+00
0b7c0f26-46ed-4239-a045-14009f041e04	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "roomClosed", "payload": {"roomId": "994e9e80-7f3e-4e64-8896-6b4ed419eab5", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-12 08:13:51.526+00	2021-08-12 08:00:37.605+00	2021-08-12 08:13:51.867551+00
7595f3e9-79a1-4e65-879f-bef66e78618e	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "topicMention", "payload": {"topicId": "f11801eb-4a3c-4e45-918a-d1b38b6632c7", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-12 09:57:54.607+00	2021-08-12 09:57:26.081+00	2021-08-12 09:57:54.848619+00
e39f2a7a-bbe2-4599-b439-3dd32240508b	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "1b11054e-5c4d-4add-9e63-e72448846652", "mentionedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	\N	2021-08-12 10:01:43.89+00	2021-08-12 10:01:43.89+00
2961d388-e2aa-4bc9-95f0-87ad0e982165	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "1b11054e-5c4d-4add-9e63-e72448846652", "mentionedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	\N	2021-08-12 10:01:43.89+00	2021-08-12 10:01:43.89+00
0dbea44b-13be-4065-9a63-e23d0a9a858b	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "6f4d0bba-4553-4747-bd7b-0f91ab5617a2", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-12 11:37:50.997+00	2021-08-12 11:37:50.997+00
f1039f53-9e76-492b-bffc-2fff81f55f1c	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "6f4d0bba-4553-4747-bd7b-0f91ab5617a2", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-12 11:52:17.218+00	2021-08-12 11:37:50.997+00	2021-08-12 11:52:17.376034+00
2b9ef114-c09f-45ea-bd36-42aa0f5b8918	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicMention", "payload": {"topicId": "6f4d0bba-4553-4747-bd7b-0f91ab5617a2", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-12 11:52:56.809+00	2021-08-12 11:37:50.997+00	2021-08-12 11:52:57.135577+00
fb292ca3-1444-416b-82ae-8120cd5f7da7	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicMention", "payload": {"topicId": "1b11054e-5c4d-4add-9e63-e72448846652", "mentionedByUserId": "82f57a9f-6615-4527-816f-31ee7a0b7c98"}}	2021-08-13 04:00:53.266+00	2021-08-12 11:37:53.964+00	2021-08-13 04:00:53.490723+00
d95c4a65-ec97-4db2-8604-eab9c4b3f66a	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "addedToRoom", "payload": {"roomId": "385c3cc5-ac05-4913-91c1-a7560cefdc93", "addedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	\N	2021-08-12 13:16:50.382+00	2021-08-12 13:16:50.382+00
ea95bc66-807d-480b-bf08-ccfb3d7fb18b	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "addedToRoom", "payload": {"roomId": "385c3cc5-ac05-4913-91c1-a7560cefdc93", "addedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	\N	2021-08-12 13:16:56.399+00	2021-08-12 13:16:56.399+00
fd048ad4-9857-4564-8db0-4729655086f3	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "addedToRoom", "payload": {"roomId": "385c3cc5-ac05-4913-91c1-a7560cefdc93", "addedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	\N	2021-08-12 13:17:15.444+00	2021-08-12 13:17:15.444+00
4d0dda62-3a01-4f68-b0b8-05fd78f02576	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "addedToRoom", "payload": {"roomId": "32bccb56-7e95-451c-9b80-e1ab844df99f", "addedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	\N	2021-08-12 13:24:55.589+00	2021-08-12 13:24:55.589+00
5fd9882d-6a86-4579-a72f-18c5ae911dfe	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicClosed", "payload": {"topicId": "d5e1da06-f141-4bff-8b38-d480bf6c0b80", "closedByUserId": "7a90bccb-346e-4933-aaeb-cdef732be976"}}	\N	2021-08-12 13:25:30.644+00	2021-08-12 13:25:30.644+00
0741b544-4cb9-4da3-bde6-ec62d93b2b82	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "roomClosed", "payload": {"roomId": "3f502912-011c-4bd3-8af5-714a47bd7bfb", "closedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	\N	2021-08-12 13:32:27.564+00	2021-08-12 13:32:27.564+00
149da179-4636-467a-a015-c88e3bbf30cd	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "roomClosed", "payload": {"roomId": "3f502912-011c-4bd3-8af5-714a47bd7bfb", "closedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	\N	2021-08-12 13:32:27.565+00	2021-08-12 13:32:27.565+00
70827357-9aca-4c7c-8b6c-ea113e114501	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicMention", "payload": {"topicId": "d5e1da06-f141-4bff-8b38-d480bf6c0b80", "mentionedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-12 14:13:37.919+00	2021-08-12 13:27:09.854+00	2021-08-12 14:13:38.102437+00
e49d217f-c9f2-47ea-ad0e-a25903859d64	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicMention", "payload": {"topicId": "d5e1da06-f141-4bff-8b38-d480bf6c0b80", "mentionedByUserId": "7a90bccb-346e-4933-aaeb-cdef732be976"}}	2021-08-12 14:13:39.079+00	2021-08-12 13:26:16.735+00	2021-08-12 14:13:39.200411+00
b472bd2a-c95c-46e6-8c9b-353001ac5922	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicClosed", "payload": {"topicId": "d5e1da06-f141-4bff-8b38-d480bf6c0b80", "closedByUserId": "7a90bccb-346e-4933-aaeb-cdef732be976"}}	2021-08-12 14:13:39.828+00	2021-08-12 13:25:30.644+00	2021-08-12 14:13:39.975617+00
54689fcc-0293-4ab5-a5f4-2bc782185ec0	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicMention", "payload": {"topicId": "d5e1da06-f141-4bff-8b38-d480bf6c0b80", "mentionedByUserId": "7a90bccb-346e-4933-aaeb-cdef732be976"}}	\N	2021-08-12 14:35:40.725+00	2021-08-12 14:35:40.725+00
912fdeef-6aca-4ea2-bc70-15e644fb3ac2	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicClosed", "payload": {"topicId": "59ebd84d-6382-43e3-b5ed-d5f6ef582f2c", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-12 14:42:01.756+00	2021-08-12 14:42:01.756+00
8b2a4ee0-88d6-4fc3-955b-cb9174cb84cd	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicClosed", "payload": {"topicId": "59ebd84d-6382-43e3-b5ed-d5f6ef582f2c", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-12 14:42:01.756+00	2021-08-12 14:42:01.756+00
2881d454-5a45-4558-9880-d2edff902cec	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicClosed", "payload": {"topicId": "59ebd84d-6382-43e3-b5ed-d5f6ef582f2c", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-12 14:42:01.756+00	2021-08-12 14:42:01.756+00
64e76b47-da4a-49bf-90e1-8b933442d167	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicClosed", "payload": {"topicId": "59ebd84d-6382-43e3-b5ed-d5f6ef582f2c", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-12 14:42:01.756+00	2021-08-12 14:42:01.756+00
8c182dc6-0511-4f2d-bc95-939fb9883a2b	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicClosed", "payload": {"topicId": "59ebd84d-6382-43e3-b5ed-d5f6ef582f2c", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-12 14:42:01.756+00	2021-08-12 14:42:01.756+00
88287644-4908-4dc3-a4db-00f3a78c074a	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicClosed", "payload": {"topicId": "59ebd84d-6382-43e3-b5ed-d5f6ef582f2c", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-12 14:42:01.757+00	2021-08-12 14:42:01.757+00
b88d5b83-4f2a-4621-a1a3-6bc333a2caf4	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicMention", "payload": {"topicId": "d5e1da06-f141-4bff-8b38-d480bf6c0b80", "mentionedByUserId": "7a90bccb-346e-4933-aaeb-cdef732be976"}}	2021-08-13 04:01:06.47+00	2021-08-12 13:26:16.734+00	2021-08-13 04:01:06.655459+00
bba44e34-368a-46e3-96cf-8b1ec56e3194	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicClosed", "payload": {"topicId": "59ebd84d-6382-43e3-b5ed-d5f6ef582f2c", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-13 04:01:08.056+00	2021-08-12 14:42:01.756+00	2021-08-13 04:01:08.230574+00
f3469e53-89f6-4cd9-8b79-76a64b78e1b7	69324499-ae41-4ce4-bdaa-6072e0e5c2d3	{"type": "topicClosed", "payload": {"topicId": "d5e1da06-f141-4bff-8b38-d480bf6c0b80", "closedByUserId": "7a90bccb-346e-4933-aaeb-cdef732be976"}}	2021-08-13 09:13:38.206+00	2021-08-12 13:25:30.644+00	2021-08-13 09:13:38.328645+00
77b12312-b43a-43eb-8046-92b5bd2abebf	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "roomClosed", "payload": {"roomId": "8e4ce16b-d503-4077-869e-fa0eb955e555", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-12 14:43:53.027+00	2021-08-12 14:43:53.027+00
fb366bd2-f45b-4728-ad4b-63be6dc02b42	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "roomClosed", "payload": {"roomId": "8e4ce16b-d503-4077-869e-fa0eb955e555", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-12 14:43:53.027+00	2021-08-12 14:43:53.027+00
e6109ede-c896-41de-bf86-96b22fb2f279	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "roomClosed", "payload": {"roomId": "8e4ce16b-d503-4077-869e-fa0eb955e555", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-12 14:43:53.027+00	2021-08-12 14:43:53.027+00
cd69469c-a60c-4df2-a537-218dfafc2aae	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "roomClosed", "payload": {"roomId": "8e4ce16b-d503-4077-869e-fa0eb955e555", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-12 14:43:53.027+00	2021-08-12 14:43:53.027+00
7f21187f-ed84-492d-8795-eba892ed92b9	7879f271-4036-48be-befb-f08de052bcdc	{"type": "roomClosed", "payload": {"roomId": "8e4ce16b-d503-4077-869e-fa0eb955e555", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-12 14:43:53.027+00	2021-08-12 14:43:53.027+00
f9bbeeee-4914-4d3f-bc92-77c392bb66e2	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicMention", "payload": {"topicId": "d5e1da06-f141-4bff-8b38-d480bf6c0b80", "mentionedByUserId": "7a90bccb-346e-4933-aaeb-cdef732be976"}}	\N	2021-08-12 14:51:52.185+00	2021-08-12 14:51:52.185+00
0020c345-8518-4239-a986-59941410e0e0	31f1de58-af98-4946-997c-622cb20d9504	{"type": "addedToRoom", "payload": {"roomId": "5fcf1905-d2cd-495f-9080-56fe218949b6", "addedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-12 16:12:11.251+00	2021-08-12 16:12:11.251+00
1ffb1003-7d1c-4be6-9a5c-5a7f1ece9775	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "206b161d-acbf-4844-8946-2fa4981de272", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-12 16:20:03.288+00	2021-08-12 16:20:03.288+00
60efd7cf-60e4-4225-b460-86073baef223	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "206b161d-acbf-4844-8946-2fa4981de272", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-12 16:20:03.288+00	2021-08-12 16:20:03.288+00
cd3abdc5-2f98-429e-bca3-081a0f2cd571	31f1de58-af98-4946-997c-622cb20d9504	{"type": "topicMention", "payload": {"topicId": "206b161d-acbf-4844-8946-2fa4981de272", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-12 16:20:03.288+00	2021-08-12 16:20:03.288+00
30648dec-4c86-4834-8cb3-ec2e64d6c815	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "topicMention", "payload": {"topicId": "206b161d-acbf-4844-8946-2fa4981de272", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-12 16:20:03.289+00	2021-08-12 16:20:03.289+00
75881eef-f628-4a58-b648-b6b501c81eaf	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "topicMention", "payload": {"topicId": "206b161d-acbf-4844-8946-2fa4981de272", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-12 16:21:48.517+00	2021-08-12 16:21:48.517+00
32211fac-23cb-4390-af7a-cd1a4c374f62	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicMention", "payload": {"topicId": "a7e76ba5-9d54-4d3b-be5d-f74e782c6903", "mentionedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	\N	2021-08-12 16:25:32.006+00	2021-08-12 16:25:32.006+00
b1fe62b2-03e0-49a7-84e5-170feba1493b	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicMention", "payload": {"topicId": "1b11054e-5c4d-4add-9e63-e72448846652", "mentionedByUserId": "82f57a9f-6615-4527-816f-31ee7a0b7c98"}}	2021-08-13 03:58:57.359+00	2021-08-12 10:08:14.741+00	2021-08-13 03:58:57.636321+00
4ee15d21-f857-41fe-9188-8c05f1f5525d	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicClosed", "payload": {"topicId": "d5e1da06-f141-4bff-8b38-d480bf6c0b80", "closedByUserId": "7a90bccb-346e-4933-aaeb-cdef732be976"}}	2021-08-13 04:00:54.821+00	2021-08-12 13:25:30.644+00	2021-08-13 04:00:54.994161+00
c9a387af-3ef7-42be-9ed8-69d47732a90c	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "roomClosed", "payload": {"roomId": "8e4ce16b-d503-4077-869e-fa0eb955e555", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-13 04:01:13.054+00	2021-08-12 14:43:53.027+00	2021-08-13 04:01:13.233331+00
e5d12206-c3eb-4dbc-9a1e-ffb0dc2acaa6	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicMention", "payload": {"topicId": "d5e1da06-f141-4bff-8b38-d480bf6c0b80", "mentionedByUserId": "7a90bccb-346e-4933-aaeb-cdef732be976"}}	2021-08-13 04:01:17.04+00	2021-08-12 14:51:52.185+00	2021-08-13 04:01:17.207379+00
998df2d1-28af-45f8-8002-9736f2113045	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicMention", "payload": {"topicId": "a7e76ba5-9d54-4d3b-be5d-f74e782c6903", "mentionedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	2021-08-13 04:01:19.465+00	2021-08-12 16:25:32.006+00	2021-08-13 04:01:19.638276+00
349a240b-fc34-4fe2-b969-cc5b4f10ea1f	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "roomClosed", "payload": {"roomId": "cd3f1512-50cd-44af-bd4b-b7d0c822ded1", "closedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-13 05:44:07.491+00	2021-08-13 05:44:07.491+00
579a6738-c8b5-455d-b0b1-45dc3ec3c826	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "d5e1da06-f141-4bff-8b38-d480bf6c0b80", "mentionedByUserId": "7879f271-4036-48be-befb-f08de052bcdc"}}	2021-08-13 07:08:58.263+00	2021-08-12 14:55:24.635+00	2021-08-13 07:08:58.361563+00
17bc208f-9e67-42a9-a4c5-c8800cb3be42	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicMention", "payload": {"topicId": "1b11054e-5c4d-4add-9e63-e72448846652", "mentionedByUserId": "82f57a9f-6615-4527-816f-31ee7a0b7c98"}}	2021-08-13 07:08:41.105+00	2021-08-13 06:58:49.15+00	2021-08-13 07:08:41.401756+00
f37b62d5-49ef-4359-b35d-f1f5d47e8230	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "b09018a0-a20b-4bd3-9852-e711754efbf5", "mentionedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	\N	2021-08-13 07:09:35.703+00	2021-08-13 07:09:35.703+00
1e568347-42f2-4d03-b608-98443437a924	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "206b161d-acbf-4844-8946-2fa4981de272", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-13 07:09:40.198+00	2021-08-12 16:20:03.288+00	2021-08-13 07:09:40.44071+00
9eed5124-09a4-4734-83a7-44eec7ecb9f9	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "roomClosed", "payload": {"roomId": "8e4ce16b-d503-4077-869e-fa0eb955e555", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-13 07:09:41.909+00	2021-08-12 14:43:53.027+00	2021-08-13 07:09:42.128429+00
34a75c8a-4d91-495c-a48d-a53c62660fe4	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "addedToRoom", "payload": {"roomId": "e880dda2-9fa8-418f-9d3c-452225126c65", "addedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 07:10:36.868+00	2021-08-13 07:10:36.868+00
e81b3547-8ba4-4bc0-bc59-d5ed96a8bcba	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "addedToRoom", "payload": {"roomId": "e880dda2-9fa8-418f-9d3c-452225126c65", "addedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 07:10:36.862+00	2021-08-13 07:10:36.862+00
4223225d-c603-4fc3-9281-8500049ea994	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicClosed", "payload": {"topicId": "4c7cea0f-8dca-409f-ab03-4c460d40aef4", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 07:19:22.251+00	2021-08-13 07:19:22.251+00
05ee9889-2f0c-43f9-88ec-ebcac046769c	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "addedToRoom", "payload": {"roomId": "e880dda2-9fa8-418f-9d3c-452225126c65", "addedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 07:10:36.867+00	2021-08-13 07:10:36.867+00
1fed7ef2-7633-4e6e-883d-e65c3ccd8b01	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "addedToRoom", "payload": {"roomId": "e880dda2-9fa8-418f-9d3c-452225126c65", "addedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 07:10:36.867+00	2021-08-13 07:10:36.867+00
13cbfcac-de2e-42fa-b0f3-0808d3a470f6	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "addedToRoom", "payload": {"roomId": "e880dda2-9fa8-418f-9d3c-452225126c65", "addedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 07:10:36.868+00	2021-08-13 07:10:36.868+00
f902dff1-d21d-44a4-8234-c2ad29db3fa1	7879f271-4036-48be-befb-f08de052bcdc	{"type": "addedToRoom", "payload": {"roomId": "e880dda2-9fa8-418f-9d3c-452225126c65", "addedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 07:10:36.868+00	2021-08-13 07:10:36.868+00
8c467d8b-6a89-4376-9e46-736ac0b36f34	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "b09018a0-a20b-4bd3-9852-e711754efbf5", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 07:12:31.145+00	2021-08-13 07:12:31.145+00
e6813077-e69c-4887-ae5d-78e6c4d1624c	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "daea1cc1-364d-4be3-a8d3-ba1259d61e54", "mentionedByUserId": "b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e"}}	\N	2021-08-13 07:13:50.348+00	2021-08-13 07:13:50.348+00
6468f6bd-38fa-4a2a-803a-643dcf15e2e0	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "8b62b6ad-fe39-40aa-b8b5-44284657b286", "mentionedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	\N	2021-08-13 07:53:53.253+00	2021-08-13 07:53:53.253+00
87f84b33-3aa6-4e2b-8b13-1c05eeb36983	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "8b62b6ad-fe39-40aa-b8b5-44284657b286", "mentionedByUserId": "82f57a9f-6615-4527-816f-31ee7a0b7c98"}}	\N	2021-08-13 08:03:59.945+00	2021-08-13 08:03:59.945+00
ef6c2fb9-c824-4cd8-bc64-810feaee2da4	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "addedToRoom", "payload": {"roomId": "e880dda2-9fa8-418f-9d3c-452225126c65", "addedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-13 08:09:20.937+00	2021-08-13 07:10:36.868+00	2021-08-13 08:09:21.391059+00
d9b034f4-a403-4811-acc3-96b5ba28dfb1	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "6eaf91dc-0e6f-4760-a528-272403cdc422", "mentionedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	\N	2021-08-13 08:19:45.174+00	2021-08-13 08:19:45.174+00
6f693880-549b-4f2e-bd6b-1c33a154047a	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicMention", "payload": {"topicId": "48f01dec-6f89-41eb-a461-5c8aed9b8c76", "mentionedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	\N	2021-08-13 08:20:31.248+00	2021-08-13 08:20:31.248+00
248e2713-e929-4021-b322-72e40a511704	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "48f01dec-6f89-41eb-a461-5c8aed9b8c76", "mentionedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	\N	2021-08-13 08:20:31.248+00	2021-08-13 08:20:31.248+00
5e5f6d11-8414-4618-aaf1-b770376b349c	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicMention", "payload": {"topicId": "6eaf91dc-0e6f-4760-a528-272403cdc422", "mentionedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	2021-08-13 08:22:55.205+00	2021-08-13 08:22:01.475+00	2021-08-13 08:22:55.608748+00
53aa65b6-aba4-447c-8d89-a27ddbf1bc53	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "topicMention", "payload": {"topicId": "a3df9a5b-6188-4a59-b780-019b5897954c", "mentionedByUserId": "ca652ee1-1423-42fe-a0ef-e5761a670845"}}	\N	2021-08-13 08:25:56.067+00	2021-08-13 08:25:56.067+00
581e66f0-ec3b-4dbf-9ceb-f85c6ffa06f5	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicMention", "payload": {"topicId": "48f01dec-6f89-41eb-a461-5c8aed9b8c76", "mentionedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	2021-08-13 08:26:21.122+00	2021-08-13 08:20:31.248+00	2021-08-13 08:26:21.503384+00
bf56795e-ed27-4c7a-8fd8-c1ec7a1a9b0f	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "dc512cc6-7ef4-489b-9187-45a8202156ad", "mentionedByUserId": "7a90bccb-346e-4933-aaeb-cdef732be976"}}	\N	2021-08-13 08:46:36.114+00	2021-08-13 08:46:36.114+00
2987494a-a507-4685-afe6-43a03327dd08	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "roomClosed", "payload": {"roomId": "d0eb5780-48e5-419a-b115-e936ed03ea23", "closedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 09:42:21.304+00	2021-08-13 09:42:21.304+00
57110026-1a15-4024-a0ce-9ca065b30f03	25db9c19-f84e-40d8-9dfb-ee94478ca40a	{"type": "topicMention", "payload": {"topicId": "16571812-9e72-46d0-8568-cf402abd1f5e", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 09:47:44.152+00	2021-08-13 09:47:44.152+00
412cf013-ddd3-4a54-9c93-cee2d823e08c	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "16571812-9e72-46d0-8568-cf402abd1f5e", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 09:47:49.374+00	2021-08-13 09:47:49.374+00
f9f76ca4-5d3c-4a59-ad0a-77d30b5129f0	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "dc512cc6-7ef4-489b-9187-45a8202156ad", "mentionedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	\N	2021-08-13 09:50:35.586+00	2021-08-13 09:50:35.586+00
2b40e6a7-f7c0-4de9-b9fb-f33b2e2b39b0	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "78dc049f-b901-4a54-8068-05f5e3c879b8", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-13 10:39:56.351+00	2021-08-13 10:39:56.351+00
c95b323c-6d80-462d-8596-22a7b9ca0412	f30de478-b560-47f5-8588-8062ffc64a25	{"type": "topicMention", "payload": {"topicId": "78dc049f-b901-4a54-8068-05f5e3c879b8", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	\N	2021-08-13 10:39:56.351+00	2021-08-13 10:39:56.351+00
38ad8e49-c73c-41bb-83ca-e25dac97b04f	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "addedToRoom", "payload": {"roomId": "a29e4dca-18a8-4d63-85b7-5bc92000d9a1", "addedByUserId": "6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0"}}	\N	2021-08-13 10:55:31.71+00	2021-08-13 10:55:31.71+00
e6346518-b7a9-4a16-abf9-e04e6e9f7399	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "8bdd2810-4147-4198-9008-67bdb770b440", "mentionedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	\N	2021-08-13 10:56:37.051+00	2021-08-13 10:56:37.051+00
3d27c75f-f062-4542-a52e-d894f6b64f44	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicMention", "payload": {"topicId": "8bdd2810-4147-4198-9008-67bdb770b440", "mentionedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	\N	2021-08-13 10:56:37.051+00	2021-08-13 10:56:37.051+00
2fc30f11-a831-4233-961a-8bfa89539a5d	69324499-ae41-4ce4-bdaa-6072e0e5c2d3	{"type": "topicMention", "payload": {"topicId": "8bdd2810-4147-4198-9008-67bdb770b440", "mentionedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	\N	2021-08-13 10:56:37.051+00	2021-08-13 10:56:37.051+00
6c8ed6e8-3cd0-479d-a0a0-e06e954211f0	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicMention", "payload": {"topicId": "885eabe5-ee9d-4574-b03a-921865923f62", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 14:52:45.185+00	2021-08-13 14:52:45.185+00
c0c2f4ec-14f1-4746-a532-623be4883767	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicMention", "payload": {"topicId": "78dc049f-b901-4a54-8068-05f5e3c879b8", "mentionedByUserId": "600ccd3a-a513-4a4a-864b-e00bfc9699f9"}}	2021-08-13 11:04:20.541+00	2021-08-13 10:39:56.351+00	2021-08-13 11:04:20.938853+00
fabf32e7-6a01-42c0-a50f-8d1a5ffc39de	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicAssigned", "payload": {"topicId": "6eaf91dc-0e6f-4760-a528-272403cdc422", "assignedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 15:41:16.592+00	2021-08-13 15:41:16.592+00
402c6ff7-a7c2-4764-86a4-a6528d6de641	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicMention", "payload": {"topicId": "8bdd2810-4147-4198-9008-67bdb770b440", "mentionedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	2021-08-13 12:16:27.135+00	2021-08-13 10:56:37.051+00	2021-08-13 12:16:27.55166+00
b53cfa4b-63c1-4bb1-a29e-63006a4d4eb7	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "afb7181d-d0ed-49bb-9d1d-451fa0f70eff", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	2021-08-13 14:23:02.113+00	2021-08-13 12:05:13.05+00	2021-08-13 14:23:02.316715+00
a9ff7ef7-8abc-4581-879d-84712be05ed3	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "c5ec9832-9fac-4c5f-b44f-de7dacedf5da", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 14:51:23.986+00	2021-08-13 14:51:23.986+00
94e5368d-a627-49f9-b3d0-6a2116e35554	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "28799055-2bf2-420e-b6fb-6cb332de30b4", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 14:51:30.392+00	2021-08-13 14:51:30.392+00
d3c53f64-3c78-434c-afc3-587791451799	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "28799055-2bf2-420e-b6fb-6cb332de30b4", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 14:51:30.392+00	2021-08-13 14:51:30.392+00
d692cb75-bbfa-4b7a-8496-26d15115e72d	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "d2495640-61f5-4c4d-95ee-59999fe26f27", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 14:51:35.41+00	2021-08-13 14:51:35.41+00
0bec5a71-2746-4e2e-ab99-c64364b0b2d4	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicMention", "payload": {"topicId": "4225e883-1e99-4cab-9000-eee3c4dfd200", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 14:51:42.436+00	2021-08-13 14:51:42.436+00
cd0327fc-7466-41ec-a882-8daef383d262	7a90bccb-346e-4933-aaeb-cdef732be976	{"type": "topicMention", "payload": {"topicId": "4225e883-1e99-4cab-9000-eee3c4dfd200", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 14:51:42.436+00	2021-08-13 14:51:42.436+00
3f0b079f-197e-4a97-805f-820a61e136d9	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicMention", "payload": {"topicId": "28799055-2bf2-420e-b6fb-6cb332de30b4", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 14:52:14.092+00	2021-08-13 14:52:14.092+00
e72f5600-7ac4-4e13-bfb2-e755347dcba6	7879f271-4036-48be-befb-f08de052bcdc	{"type": "topicMention", "payload": {"topicId": "4225e883-1e99-4cab-9000-eee3c4dfd200", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 14:52:24.545+00	2021-08-13 14:52:24.545+00
fba68ce9-f191-43ac-8f88-a784ab38f686	82f57a9f-6615-4527-816f-31ee7a0b7c98	{"type": "topicMention", "payload": {"topicId": "9752c7ba-94e3-4441-ae79-37118fcbd72e", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 14:52:29.559+00	2021-08-13 14:52:29.559+00
7b005acc-a0e6-4c59-bd2b-792d6a52074f	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0	{"type": "topicMention", "payload": {"topicId": "b79e885e-41bd-4fd6-8fb1-9e04ef3424fa", "mentionedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 14:52:40.164+00	2021-08-13 14:52:40.164+00
00923e88-dfca-4c78-9c43-70ea27934168	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicAssigned", "payload": {"topicId": "8dac34bd-e5d0-4e88-97be-76ef1da6965a", "assignedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 15:41:09.569+00	2021-08-13 15:41:09.569+00
e8b5a07b-fe20-4bf1-a1ef-2b27e79c66e2	600ccd3a-a513-4a4a-864b-e00bfc9699f9	{"type": "topicAssigned", "payload": {"topicId": "78dc049f-b901-4a54-8068-05f5e3c879b8", "assignedByUserId": "f30de478-b560-47f5-8588-8062ffc64a25"}}	\N	2021-08-13 15:41:21.604+00	2021-08-13 15:41:21.604+00
fbbbdf6a-842c-4934-9c18-727f20349d17	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicMention", "payload": {"topicId": "a8663afc-06b9-4e95-a9c8-bd57f898bf52", "mentionedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	\N	2021-08-13 15:58:02.354+00	2021-08-13 15:58:02.354+00
e7480340-f4ed-42ef-b991-8d8656b36cbd	ca652ee1-1423-42fe-a0ef-e5761a670845	{"type": "topicAssigned", "payload": {"topicId": "a8663afc-06b9-4e95-a9c8-bd57f898bf52", "assignedByUserId": "ee140dfb-14f6-41d3-b2b0-4e50764290d7"}}	\N	2021-08-13 15:58:10.32+00	2021-08-13 15:58:10.32+00
\.


--
-- Data for Name: room_invitation; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.room_invitation (id, email, used_at, token, created_at, inviting_user_id, used_by_user_id, room_id, team_id) FROM stdin;
\.


--
-- Data for Name: room_member; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.room_member (room_id, user_id) FROM stdin;
4e21d822-4052-491d-a106-6e85ffa7e1b7	ee140dfb-14f6-41d3-b2b0-4e50764290d7
1a140e97-fccd-4918-bd3f-8291e8649872	82f57a9f-6615-4527-816f-31ee7a0b7c98
1a140e97-fccd-4918-bd3f-8291e8649872	600ccd3a-a513-4a4a-864b-e00bfc9699f9
1a140e97-fccd-4918-bd3f-8291e8649872	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
1d8ff61c-35fe-4dfd-abd8-d25fc52d2264	f30de478-b560-47f5-8588-8062ffc64a25
1d8ff61c-35fe-4dfd-abd8-d25fc52d2264	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
1d8ff61c-35fe-4dfd-abd8-d25fc52d2264	ee140dfb-14f6-41d3-b2b0-4e50764290d7
1d8ff61c-35fe-4dfd-abd8-d25fc52d2264	25db9c19-f84e-40d8-9dfb-ee94478ca40a
1d8ff61c-35fe-4dfd-abd8-d25fc52d2264	600ccd3a-a513-4a4a-864b-e00bfc9699f9
1d8ff61c-35fe-4dfd-abd8-d25fc52d2264	7a90bccb-346e-4933-aaeb-cdef732be976
1d8ff61c-35fe-4dfd-abd8-d25fc52d2264	82f57a9f-6615-4527-816f-31ee7a0b7c98
4e21d822-4052-491d-a106-6e85ffa7e1b7	82f57a9f-6615-4527-816f-31ee7a0b7c98
4e21d822-4052-491d-a106-6e85ffa7e1b7	ca652ee1-1423-42fe-a0ef-e5761a670845
1d8ff61c-35fe-4dfd-abd8-d25fc52d2264	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
1d8ff61c-35fe-4dfd-abd8-d25fc52d2264	ca652ee1-1423-42fe-a0ef-e5761a670845
7bb63491-df1e-414c-9b5a-909d5ceb0e6a	ca652ee1-1423-42fe-a0ef-e5761a670845
7bb63491-df1e-414c-9b5a-909d5ceb0e6a	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
7bb63491-df1e-414c-9b5a-909d5ceb0e6a	ee140dfb-14f6-41d3-b2b0-4e50764290d7
7bb63491-df1e-414c-9b5a-909d5ceb0e6a	7a90bccb-346e-4933-aaeb-cdef732be976
51c4135e-d3cc-43f9-b247-85ff13feb946	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
51c4135e-d3cc-43f9-b247-85ff13feb946	7a90bccb-346e-4933-aaeb-cdef732be976
51c4135e-d3cc-43f9-b247-85ff13feb946	ee140dfb-14f6-41d3-b2b0-4e50764290d7
b5b83152-fa39-4d21-a9b5-d6c5d9f41d51	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
b5b83152-fa39-4d21-a9b5-d6c5d9f41d51	600ccd3a-a513-4a4a-864b-e00bfc9699f9
51c4135e-d3cc-43f9-b247-85ff13feb946	ca652ee1-1423-42fe-a0ef-e5761a670845
bc62103c-e9fa-4993-9f83-95ccaecdda0f	25db9c19-f84e-40d8-9dfb-ee94478ca40a
bc62103c-e9fa-4993-9f83-95ccaecdda0f	600ccd3a-a513-4a4a-864b-e00bfc9699f9
4b2b3985-299c-42b3-8546-3c52f4ba8484	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
f95e7a04-5ef4-47a6-9dcf-b7504e330c09	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
f95e7a04-5ef4-47a6-9dcf-b7504e330c09	ee140dfb-14f6-41d3-b2b0-4e50764290d7
f95e7a04-5ef4-47a6-9dcf-b7504e330c09	7a90bccb-346e-4933-aaeb-cdef732be976
b3172b1c-fa67-472e-aa15-81952f282864	82f57a9f-6615-4527-816f-31ee7a0b7c98
b3172b1c-fa67-472e-aa15-81952f282864	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
b3172b1c-fa67-472e-aa15-81952f282864	600ccd3a-a513-4a4a-864b-e00bfc9699f9
4e21d822-4052-491d-a106-6e85ffa7e1b7	f30de478-b560-47f5-8588-8062ffc64a25
4e21d822-4052-491d-a106-6e85ffa7e1b7	25db9c19-f84e-40d8-9dfb-ee94478ca40a
4e21d822-4052-491d-a106-6e85ffa7e1b7	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
f95e7a04-5ef4-47a6-9dcf-b7504e330c09	ca652ee1-1423-42fe-a0ef-e5761a670845
2a28f67a-0f19-4989-a354-1511e4fc48c5	600ccd3a-a513-4a4a-864b-e00bfc9699f9
2a28f67a-0f19-4989-a354-1511e4fc48c5	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
2a28f67a-0f19-4989-a354-1511e4fc48c5	ee140dfb-14f6-41d3-b2b0-4e50764290d7
2a28f67a-0f19-4989-a354-1511e4fc48c5	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
4e21d822-4052-491d-a106-6e85ffa7e1b7	600ccd3a-a513-4a4a-864b-e00bfc9699f9
8ecb77a0-b1cd-4070-b184-fe7d96acab43	f30de478-b560-47f5-8588-8062ffc64a25
8ecb77a0-b1cd-4070-b184-fe7d96acab43	25db9c19-f84e-40d8-9dfb-ee94478ca40a
c4090fab-3806-4e4a-b190-63b787c32bb3	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
c4090fab-3806-4e4a-b190-63b787c32bb3	ee140dfb-14f6-41d3-b2b0-4e50764290d7
c4090fab-3806-4e4a-b190-63b787c32bb3	25db9c19-f84e-40d8-9dfb-ee94478ca40a
8ecb77a0-b1cd-4070-b184-fe7d96acab43	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
c4090fab-3806-4e4a-b190-63b787c32bb3	600ccd3a-a513-4a4a-864b-e00bfc9699f9
c4090fab-3806-4e4a-b190-63b787c32bb3	7a90bccb-346e-4933-aaeb-cdef732be976
c4090fab-3806-4e4a-b190-63b787c32bb3	82f57a9f-6615-4527-816f-31ee7a0b7c98
c4090fab-3806-4e4a-b190-63b787c32bb3	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
c4090fab-3806-4e4a-b190-63b787c32bb3	f30de478-b560-47f5-8588-8062ffc64a25
c4090fab-3806-4e4a-b190-63b787c32bb3	ca652ee1-1423-42fe-a0ef-e5761a670845
e3c59b5b-e8a1-4cdc-95a2-569c9ff699b7	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
4e21d822-4052-491d-a106-6e85ffa7e1b7	7a90bccb-346e-4933-aaeb-cdef732be976
8ecb77a0-b1cd-4070-b184-fe7d96acab43	82f57a9f-6615-4527-816f-31ee7a0b7c98
8ecb77a0-b1cd-4070-b184-fe7d96acab43	ee140dfb-14f6-41d3-b2b0-4e50764290d7
e3c59b5b-e8a1-4cdc-95a2-569c9ff699b7	ee140dfb-14f6-41d3-b2b0-4e50764290d7
8ecb77a0-b1cd-4070-b184-fe7d96acab43	7a90bccb-346e-4933-aaeb-cdef732be976
8ecb77a0-b1cd-4070-b184-fe7d96acab43	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
8ecb77a0-b1cd-4070-b184-fe7d96acab43	ca652ee1-1423-42fe-a0ef-e5761a670845
8ecb77a0-b1cd-4070-b184-fe7d96acab43	600ccd3a-a513-4a4a-864b-e00bfc9699f9
7ccbdcfd-04f2-45bb-9c42-67a29ff581cb	7a90bccb-346e-4933-aaeb-cdef732be976
7ccbdcfd-04f2-45bb-9c42-67a29ff581cb	82f57a9f-6615-4527-816f-31ee7a0b7c98
e3c59b5b-e8a1-4cdc-95a2-569c9ff699b7	600ccd3a-a513-4a4a-864b-e00bfc9699f9
2fadf5ac-dfb9-4e11-9f4b-47596eff2e57	25db9c19-f84e-40d8-9dfb-ee94478ca40a
2fadf5ac-dfb9-4e11-9f4b-47596eff2e57	600ccd3a-a513-4a4a-864b-e00bfc9699f9
2fadf5ac-dfb9-4e11-9f4b-47596eff2e57	82f57a9f-6615-4527-816f-31ee7a0b7c98
2fadf5ac-dfb9-4e11-9f4b-47596eff2e57	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
e3c59b5b-e8a1-4cdc-95a2-569c9ff699b7	82f57a9f-6615-4527-816f-31ee7a0b7c98
f95e7a04-5ef4-47a6-9dcf-b7504e330c09	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
e3c59b5b-e8a1-4cdc-95a2-569c9ff699b7	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
e3c59b5b-e8a1-4cdc-95a2-569c9ff699b7	ca652ee1-1423-42fe-a0ef-e5761a670845
3f502912-011c-4bd3-8af5-714a47bd7bfb	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
3f502912-011c-4bd3-8af5-714a47bd7bfb	ee140dfb-14f6-41d3-b2b0-4e50764290d7
3f502912-011c-4bd3-8af5-714a47bd7bfb	82f57a9f-6615-4527-816f-31ee7a0b7c98
76d33092-f62b-49cc-aa9c-00ca0dd3b943	ee140dfb-14f6-41d3-b2b0-4e50764290d7
1a65696f-6a49-46c4-a2f9-f55e23dc4216	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
1a65696f-6a49-46c4-a2f9-f55e23dc4216	600ccd3a-a513-4a4a-864b-e00bfc9699f9
1a65696f-6a49-46c4-a2f9-f55e23dc4216	82f57a9f-6615-4527-816f-31ee7a0b7c98
f0308c63-7a5b-4579-81fd-802275088b00	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
f0308c63-7a5b-4579-81fd-802275088b00	ee140dfb-14f6-41d3-b2b0-4e50764290d7
f0308c63-7a5b-4579-81fd-802275088b00	f30de478-b560-47f5-8588-8062ffc64a25
0c048987-788e-44a8-9e29-f7575949c9a5	25db9c19-f84e-40d8-9dfb-ee94478ca40a
0c048987-788e-44a8-9e29-f7575949c9a5	600ccd3a-a513-4a4a-864b-e00bfc9699f9
e88139a9-b2cc-4592-bc7c-1789169de498	82f57a9f-6615-4527-816f-31ee7a0b7c98
e88139a9-b2cc-4592-bc7c-1789169de498	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
bbb0faf5-990f-4222-aab2-21763a857957	f30de478-b560-47f5-8588-8062ffc64a25
bbb0faf5-990f-4222-aab2-21763a857957	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
bbb0faf5-990f-4222-aab2-21763a857957	ee140dfb-14f6-41d3-b2b0-4e50764290d7
bbb0faf5-990f-4222-aab2-21763a857957	25db9c19-f84e-40d8-9dfb-ee94478ca40a
bbb0faf5-990f-4222-aab2-21763a857957	600ccd3a-a513-4a4a-864b-e00bfc9699f9
bbb0faf5-990f-4222-aab2-21763a857957	82f57a9f-6615-4527-816f-31ee7a0b7c98
bbb0faf5-990f-4222-aab2-21763a857957	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
bbb0faf5-990f-4222-aab2-21763a857957	ca652ee1-1423-42fe-a0ef-e5761a670845
e88139a9-b2cc-4592-bc7c-1789169de498	ee140dfb-14f6-41d3-b2b0-4e50764290d7
e88139a9-b2cc-4592-bc7c-1789169de498	7a90bccb-346e-4933-aaeb-cdef732be976
e88139a9-b2cc-4592-bc7c-1789169de498	ca652ee1-1423-42fe-a0ef-e5761a670845
e88139a9-b2cc-4592-bc7c-1789169de498	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
e88139a9-b2cc-4592-bc7c-1789169de498	600ccd3a-a513-4a4a-864b-e00bfc9699f9
3f502912-011c-4bd3-8af5-714a47bd7bfb	7a90bccb-346e-4933-aaeb-cdef732be976
71636fe8-50fb-4e33-a017-9dfed71803ab	25db9c19-f84e-40d8-9dfb-ee94478ca40a
1f9c3223-79fc-4901-97ce-c846be025404	25db9c19-f84e-40d8-9dfb-ee94478ca40a
1f9c3223-79fc-4901-97ce-c846be025404	600ccd3a-a513-4a4a-864b-e00bfc9699f9
1f9c3223-79fc-4901-97ce-c846be025404	f30de478-b560-47f5-8588-8062ffc64a25
8f9e0e7e-4b81-452e-be93-e93c14d26941	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
8f9e0e7e-4b81-452e-be93-e93c14d26941	600ccd3a-a513-4a4a-864b-e00bfc9699f9
8f9e0e7e-4b81-452e-be93-e93c14d26941	25db9c19-f84e-40d8-9dfb-ee94478ca40a
8f9e0e7e-4b81-452e-be93-e93c14d26941	82f57a9f-6615-4527-816f-31ee7a0b7c98
e6bca11a-3e53-4881-b2fa-b48d579814c2	f30de478-b560-47f5-8588-8062ffc64a25
e6bca11a-3e53-4881-b2fa-b48d579814c2	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
e6bca11a-3e53-4881-b2fa-b48d579814c2	600ccd3a-a513-4a4a-864b-e00bfc9699f9
e6bca11a-3e53-4881-b2fa-b48d579814c2	25db9c19-f84e-40d8-9dfb-ee94478ca40a
5c4fe2d8-3533-4f60-bfca-c9b8a95c210d	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
5c4fe2d8-3533-4f60-bfca-c9b8a95c210d	ee140dfb-14f6-41d3-b2b0-4e50764290d7
5c4fe2d8-3533-4f60-bfca-c9b8a95c210d	25db9c19-f84e-40d8-9dfb-ee94478ca40a
5c4fe2d8-3533-4f60-bfca-c9b8a95c210d	600ccd3a-a513-4a4a-864b-e00bfc9699f9
5c4fe2d8-3533-4f60-bfca-c9b8a95c210d	7a90bccb-346e-4933-aaeb-cdef732be976
5c4fe2d8-3533-4f60-bfca-c9b8a95c210d	82f57a9f-6615-4527-816f-31ee7a0b7c98
5c4fe2d8-3533-4f60-bfca-c9b8a95c210d	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
5c4fe2d8-3533-4f60-bfca-c9b8a95c210d	f30de478-b560-47f5-8588-8062ffc64a25
5c4fe2d8-3533-4f60-bfca-c9b8a95c210d	ca652ee1-1423-42fe-a0ef-e5761a670845
54afb680-f7ad-4ac3-973e-a1a53c4b7c68	ee140dfb-14f6-41d3-b2b0-4e50764290d7
5fcf1905-d2cd-495f-9080-56fe218949b6	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
76d33092-f62b-49cc-aa9c-00ca0dd3b943	ca652ee1-1423-42fe-a0ef-e5761a670845
b3172b1c-fa67-472e-aa15-81952f282864	25db9c19-f84e-40d8-9dfb-ee94478ca40a
cf9197da-a54f-4735-b942-771424d3983d	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
5ed709d5-d6b3-4d86-a26a-f847f88a0a57	ca652ee1-1423-42fe-a0ef-e5761a670845
f0308c63-7a5b-4579-81fd-802275088b00	4d783a5d-2c91-4cc0-89f6-42d0b5d189c8
5ed709d5-d6b3-4d86-a26a-f847f88a0a57	ee140dfb-14f6-41d3-b2b0-4e50764290d7
5ed709d5-d6b3-4d86-a26a-f847f88a0a57	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
5ed709d5-d6b3-4d86-a26a-f847f88a0a57	7a90bccb-346e-4933-aaeb-cdef732be976
e078b152-a8ef-4cda-9bfa-388b2ddfe27d	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
e078b152-a8ef-4cda-9bfa-388b2ddfe27d	25db9c19-f84e-40d8-9dfb-ee94478ca40a
e078b152-a8ef-4cda-9bfa-388b2ddfe27d	600ccd3a-a513-4a4a-864b-e00bfc9699f9
5ed709d5-d6b3-4d86-a26a-f847f88a0a57	82f57a9f-6615-4527-816f-31ee7a0b7c98
76d33092-f62b-49cc-aa9c-00ca0dd3b943	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
4e21d822-4052-491d-a106-6e85ffa7e1b7	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
5ed709d5-d6b3-4d86-a26a-f847f88a0a57	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
5fff4746-afc9-41db-b296-239b2f5e647f	ca652ee1-1423-42fe-a0ef-e5761a670845
5fff4746-afc9-41db-b296-239b2f5e647f	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
5fff4746-afc9-41db-b296-239b2f5e647f	ee140dfb-14f6-41d3-b2b0-4e50764290d7
ac29a6fb-cade-4cfe-8ef1-f163334abfdc	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
ac29a6fb-cade-4cfe-8ef1-f163334abfdc	ee140dfb-14f6-41d3-b2b0-4e50764290d7
ac29a6fb-cade-4cfe-8ef1-f163334abfdc	25db9c19-f84e-40d8-9dfb-ee94478ca40a
ac29a6fb-cade-4cfe-8ef1-f163334abfdc	600ccd3a-a513-4a4a-864b-e00bfc9699f9
76d33092-f62b-49cc-aa9c-00ca0dd3b943	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
22fe34a9-e1c4-42f7-b611-4bb52ee35313	7a90bccb-346e-4933-aaeb-cdef732be976
5fff4746-afc9-41db-b296-239b2f5e647f	7a90bccb-346e-4933-aaeb-cdef732be976
71636fe8-50fb-4e33-a017-9dfed71803ab	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
71636fe8-50fb-4e33-a017-9dfed71803ab	600ccd3a-a513-4a4a-864b-e00bfc9699f9
2b1c54a6-60cc-4624-a655-938858d3af2c	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
2b1c54a6-60cc-4624-a655-938858d3af2c	ee140dfb-14f6-41d3-b2b0-4e50764290d7
2b1c54a6-60cc-4624-a655-938858d3af2c	25db9c19-f84e-40d8-9dfb-ee94478ca40a
2b1c54a6-60cc-4624-a655-938858d3af2c	600ccd3a-a513-4a4a-864b-e00bfc9699f9
2b1c54a6-60cc-4624-a655-938858d3af2c	7a90bccb-346e-4933-aaeb-cdef732be976
2b1c54a6-60cc-4624-a655-938858d3af2c	82f57a9f-6615-4527-816f-31ee7a0b7c98
2b1c54a6-60cc-4624-a655-938858d3af2c	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
2b1c54a6-60cc-4624-a655-938858d3af2c	f30de478-b560-47f5-8588-8062ffc64a25
2b1c54a6-60cc-4624-a655-938858d3af2c	ca652ee1-1423-42fe-a0ef-e5761a670845
03ea9cdd-e3a3-4f10-af7d-936b39b1d97c	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
03ea9cdd-e3a3-4f10-af7d-936b39b1d97c	600ccd3a-a513-4a4a-864b-e00bfc9699f9
03ea9cdd-e3a3-4f10-af7d-936b39b1d97c	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
b888515c-9ed8-4198-92dd-2b930417e61e	25db9c19-f84e-40d8-9dfb-ee94478ca40a
b888515c-9ed8-4198-92dd-2b930417e61e	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
b888515c-9ed8-4198-92dd-2b930417e61e	600ccd3a-a513-4a4a-864b-e00bfc9699f9
f435c12a-ad27-44e3-a464-4fd9c7e007e0	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
54afb680-f7ad-4ac3-973e-a1a53c4b7c68	82f57a9f-6615-4527-816f-31ee7a0b7c98
54afb680-f7ad-4ac3-973e-a1a53c4b7c68	25db9c19-f84e-40d8-9dfb-ee94478ca40a
54afb680-f7ad-4ac3-973e-a1a53c4b7c68	600ccd3a-a513-4a4a-864b-e00bfc9699f9
54afb680-f7ad-4ac3-973e-a1a53c4b7c68	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
e9fbf9f5-8aaa-4ff7-8905-b10b23b93902	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
048e2d5a-7db4-4997-9b3e-195b44c55710	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
048e2d5a-7db4-4997-9b3e-195b44c55710	600ccd3a-a513-4a4a-864b-e00bfc9699f9
048e2d5a-7db4-4997-9b3e-195b44c55710	82f57a9f-6615-4527-816f-31ee7a0b7c98
3fe4ae05-2ad1-4409-b487-b09c015c361c	7a90bccb-346e-4933-aaeb-cdef732be976
3fe4ae05-2ad1-4409-b487-b09c015c361c	ca652ee1-1423-42fe-a0ef-e5761a670845
3fe4ae05-2ad1-4409-b487-b09c015c361c	ee140dfb-14f6-41d3-b2b0-4e50764290d7
3fe4ae05-2ad1-4409-b487-b09c015c361c	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
0fe6380c-f7eb-4652-a4cc-fd778a4a36b5	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
0fe6380c-f7eb-4652-a4cc-fd778a4a36b5	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
0fe6380c-f7eb-4652-a4cc-fd778a4a36b5	600ccd3a-a513-4a4a-864b-e00bfc9699f9
91b35e7f-66f0-470f-b208-47f89ebd3771	25db9c19-f84e-40d8-9dfb-ee94478ca40a
91b35e7f-66f0-470f-b208-47f89ebd3771	f30de478-b560-47f5-8588-8062ffc64a25
0fe6380c-f7eb-4652-a4cc-fd778a4a36b5	25db9c19-f84e-40d8-9dfb-ee94478ca40a
a0f2285e-336a-4155-83a0-bc79fb27e670	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
a0f2285e-336a-4155-83a0-bc79fb27e670	ee140dfb-14f6-41d3-b2b0-4e50764290d7
a0f2285e-336a-4155-83a0-bc79fb27e670	25db9c19-f84e-40d8-9dfb-ee94478ca40a
a0f2285e-336a-4155-83a0-bc79fb27e670	600ccd3a-a513-4a4a-864b-e00bfc9699f9
a0f2285e-336a-4155-83a0-bc79fb27e670	7a90bccb-346e-4933-aaeb-cdef732be976
a0f2285e-336a-4155-83a0-bc79fb27e670	82f57a9f-6615-4527-816f-31ee7a0b7c98
a0f2285e-336a-4155-83a0-bc79fb27e670	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
a0f2285e-336a-4155-83a0-bc79fb27e670	f30de478-b560-47f5-8588-8062ffc64a25
a0f2285e-336a-4155-83a0-bc79fb27e670	ca652ee1-1423-42fe-a0ef-e5761a670845
d1762c9b-d55e-4034-baf0-04cd28a79452	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
28df10bc-90db-4e7b-bd67-d2a864f9e964	600ccd3a-a513-4a4a-864b-e00bfc9699f9
28df10bc-90db-4e7b-bd67-d2a864f9e964	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
28df10bc-90db-4e7b-bd67-d2a864f9e964	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
d1762c9b-d55e-4034-baf0-04cd28a79452	ee140dfb-14f6-41d3-b2b0-4e50764290d7
d1762c9b-d55e-4034-baf0-04cd28a79452	7879f271-4036-48be-befb-f08de052bcdc
4e21d822-4052-491d-a106-6e85ffa7e1b7	7879f271-4036-48be-befb-f08de052bcdc
27a44750-24d1-4aa5-b3c2-e2bb4c9be61e	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
27a44750-24d1-4aa5-b3c2-e2bb4c9be61e	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
afecb492-3666-4c8d-bf09-950723c0c04c	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
afecb492-3666-4c8d-bf09-950723c0c04c	25db9c19-f84e-40d8-9dfb-ee94478ca40a
afecb492-3666-4c8d-bf09-950723c0c04c	600ccd3a-a513-4a4a-864b-e00bfc9699f9
76d33092-f62b-49cc-aa9c-00ca0dd3b943	7a90bccb-346e-4933-aaeb-cdef732be976
c6d65e11-d335-4ab4-9d46-7ed3d9760c06	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
d1762c9b-d55e-4034-baf0-04cd28a79452	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
c6d65e11-d335-4ab4-9d46-7ed3d9760c06	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
c6d65e11-d335-4ab4-9d46-7ed3d9760c06	600ccd3a-a513-4a4a-864b-e00bfc9699f9
c6d65e11-d335-4ab4-9d46-7ed3d9760c06	25db9c19-f84e-40d8-9dfb-ee94478ca40a
c6d65e11-d335-4ab4-9d46-7ed3d9760c06	82f57a9f-6615-4527-816f-31ee7a0b7c98
c6d65e11-d335-4ab4-9d46-7ed3d9760c06	ee140dfb-14f6-41d3-b2b0-4e50764290d7
7461fe76-712a-4bb7-9442-983101dfc281	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
5b2a4c7a-2b4f-4cf0-9591-f91a8454722b	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
5b2a4c7a-2b4f-4cf0-9591-f91a8454722b	ee140dfb-14f6-41d3-b2b0-4e50764290d7
5b2a4c7a-2b4f-4cf0-9591-f91a8454722b	25db9c19-f84e-40d8-9dfb-ee94478ca40a
5b2a4c7a-2b4f-4cf0-9591-f91a8454722b	600ccd3a-a513-4a4a-864b-e00bfc9699f9
5b2a4c7a-2b4f-4cf0-9591-f91a8454722b	82f57a9f-6615-4527-816f-31ee7a0b7c98
5b2a4c7a-2b4f-4cf0-9591-f91a8454722b	f30de478-b560-47f5-8588-8062ffc64a25
d1762c9b-d55e-4034-baf0-04cd28a79452	7a90bccb-346e-4933-aaeb-cdef732be976
d8ad568e-e0b7-424a-84d4-09e1e3105e37	25db9c19-f84e-40d8-9dfb-ee94478ca40a
d8ad568e-e0b7-424a-84d4-09e1e3105e37	600ccd3a-a513-4a4a-864b-e00bfc9699f9
d8ad568e-e0b7-424a-84d4-09e1e3105e37	82f57a9f-6615-4527-816f-31ee7a0b7c98
4a4c995d-bbb4-4573-b170-db617d336b7b	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
4a4c995d-bbb4-4573-b170-db617d336b7b	ee140dfb-14f6-41d3-b2b0-4e50764290d7
4a4c995d-bbb4-4573-b170-db617d336b7b	25db9c19-f84e-40d8-9dfb-ee94478ca40a
4a4c995d-bbb4-4573-b170-db617d336b7b	600ccd3a-a513-4a4a-864b-e00bfc9699f9
4a4c995d-bbb4-4573-b170-db617d336b7b	7a90bccb-346e-4933-aaeb-cdef732be976
4a4c995d-bbb4-4573-b170-db617d336b7b	82f57a9f-6615-4527-816f-31ee7a0b7c98
4a4c995d-bbb4-4573-b170-db617d336b7b	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
4a4c995d-bbb4-4573-b170-db617d336b7b	f30de478-b560-47f5-8588-8062ffc64a25
4a4c995d-bbb4-4573-b170-db617d336b7b	ca652ee1-1423-42fe-a0ef-e5761a670845
4a4c995d-bbb4-4573-b170-db617d336b7b	7879f271-4036-48be-befb-f08de052bcdc
79b7cb5f-f9f8-454e-967d-37cea8a81739	7879f271-4036-48be-befb-f08de052bcdc
79b7cb5f-f9f8-454e-967d-37cea8a81739	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
79b7cb5f-f9f8-454e-967d-37cea8a81739	ee140dfb-14f6-41d3-b2b0-4e50764290d7
79b7cb5f-f9f8-454e-967d-37cea8a81739	7a90bccb-346e-4933-aaeb-cdef732be976
79b7cb5f-f9f8-454e-967d-37cea8a81739	ca652ee1-1423-42fe-a0ef-e5761a670845
79b7cb5f-f9f8-454e-967d-37cea8a81739	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
080b882d-03e2-4aaa-b058-eec287d29486	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
080b882d-03e2-4aaa-b058-eec287d29486	7a90bccb-346e-4933-aaeb-cdef732be976
080b882d-03e2-4aaa-b058-eec287d29486	ee140dfb-14f6-41d3-b2b0-4e50764290d7
080b882d-03e2-4aaa-b058-eec287d29486	7879f271-4036-48be-befb-f08de052bcdc
080b882d-03e2-4aaa-b058-eec287d29486	ca652ee1-1423-42fe-a0ef-e5761a670845
5fcf1905-d2cd-495f-9080-56fe218949b6	25db9c19-f84e-40d8-9dfb-ee94478ca40a
5fcf1905-d2cd-495f-9080-56fe218949b6	600ccd3a-a513-4a4a-864b-e00bfc9699f9
5fcf1905-d2cd-495f-9080-56fe218949b6	82f57a9f-6615-4527-816f-31ee7a0b7c98
5fcf1905-d2cd-495f-9080-56fe218949b6	f30de478-b560-47f5-8588-8062ffc64a25
5fcf1905-d2cd-495f-9080-56fe218949b6	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
5fcf1905-d2cd-495f-9080-56fe218949b6	ee140dfb-14f6-41d3-b2b0-4e50764290d7
0fe6380c-f7eb-4652-a4cc-fd778a4a36b5	7a90bccb-346e-4933-aaeb-cdef732be976
cf9197da-a54f-4735-b942-771424d3983d	ca652ee1-1423-42fe-a0ef-e5761a670845
cf9197da-a54f-4735-b942-771424d3983d	ee140dfb-14f6-41d3-b2b0-4e50764290d7
cf9197da-a54f-4735-b942-771424d3983d	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
cf9197da-a54f-4735-b942-771424d3983d	7879f271-4036-48be-befb-f08de052bcdc
cf9197da-a54f-4735-b942-771424d3983d	7a90bccb-346e-4933-aaeb-cdef732be976
bc605602-de72-4582-80bf-426980cfc9e3	600ccd3a-a513-4a4a-864b-e00bfc9699f9
bc605602-de72-4582-80bf-426980cfc9e3	25db9c19-f84e-40d8-9dfb-ee94478ca40a
bc605602-de72-4582-80bf-426980cfc9e3	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
cf9197da-a54f-4735-b942-771424d3983d	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
3c15419b-a818-4680-9e64-10f8596c8d58	ee140dfb-14f6-41d3-b2b0-4e50764290d7
3c15419b-a818-4680-9e64-10f8596c8d58	7a90bccb-346e-4933-aaeb-cdef732be976
3c15419b-a818-4680-9e64-10f8596c8d58	ca652ee1-1423-42fe-a0ef-e5761a670845
3c15419b-a818-4680-9e64-10f8596c8d58	7879f271-4036-48be-befb-f08de052bcdc
3c15419b-a818-4680-9e64-10f8596c8d58	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
8e4ce16b-d503-4077-869e-fa0eb955e555	ee140dfb-14f6-41d3-b2b0-4e50764290d7
8e4ce16b-d503-4077-869e-fa0eb955e555	25db9c19-f84e-40d8-9dfb-ee94478ca40a
8e4ce16b-d503-4077-869e-fa0eb955e555	600ccd3a-a513-4a4a-864b-e00bfc9699f9
8e4ce16b-d503-4077-869e-fa0eb955e555	7a90bccb-346e-4933-aaeb-cdef732be976
8e4ce16b-d503-4077-869e-fa0eb955e555	82f57a9f-6615-4527-816f-31ee7a0b7c98
8e4ce16b-d503-4077-869e-fa0eb955e555	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
8e4ce16b-d503-4077-869e-fa0eb955e555	f30de478-b560-47f5-8588-8062ffc64a25
8e4ce16b-d503-4077-869e-fa0eb955e555	ca652ee1-1423-42fe-a0ef-e5761a670845
8e4ce16b-d503-4077-869e-fa0eb955e555	7879f271-4036-48be-befb-f08de052bcdc
8e4ce16b-d503-4077-869e-fa0eb955e555	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
f61f40f0-4ece-419c-a554-d659ac990ba7	600ccd3a-a513-4a4a-864b-e00bfc9699f9
f61f40f0-4ece-419c-a554-d659ac990ba7	ee140dfb-14f6-41d3-b2b0-4e50764290d7
f61f40f0-4ece-419c-a554-d659ac990ba7	f30de478-b560-47f5-8588-8062ffc64a25
f61f40f0-4ece-419c-a554-d659ac990ba7	7a90bccb-346e-4933-aaeb-cdef732be976
f61f40f0-4ece-419c-a554-d659ac990ba7	ca652ee1-1423-42fe-a0ef-e5761a670845
f61f40f0-4ece-419c-a554-d659ac990ba7	82f57a9f-6615-4527-816f-31ee7a0b7c98
f61f40f0-4ece-419c-a554-d659ac990ba7	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
f61f40f0-4ece-419c-a554-d659ac990ba7	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
f61f40f0-4ece-419c-a554-d659ac990ba7	7879f271-4036-48be-befb-f08de052bcdc
b1e4d74b-916e-44cd-a8ce-cc685927058c	600ccd3a-a513-4a4a-864b-e00bfc9699f9
b1e4d74b-916e-44cd-a8ce-cc685927058c	82f57a9f-6615-4527-816f-31ee7a0b7c98
b1e4d74b-916e-44cd-a8ce-cc685927058c	f30de478-b560-47f5-8588-8062ffc64a25
fe514238-04d9-4388-9084-4b823511bb9f	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
fe514238-04d9-4388-9084-4b823511bb9f	ee140dfb-14f6-41d3-b2b0-4e50764290d7
fe514238-04d9-4388-9084-4b823511bb9f	25db9c19-f84e-40d8-9dfb-ee94478ca40a
fe514238-04d9-4388-9084-4b823511bb9f	600ccd3a-a513-4a4a-864b-e00bfc9699f9
fe514238-04d9-4388-9084-4b823511bb9f	7a90bccb-346e-4933-aaeb-cdef732be976
fe514238-04d9-4388-9084-4b823511bb9f	82f57a9f-6615-4527-816f-31ee7a0b7c98
fe514238-04d9-4388-9084-4b823511bb9f	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
fe514238-04d9-4388-9084-4b823511bb9f	f30de478-b560-47f5-8588-8062ffc64a25
fe514238-04d9-4388-9084-4b823511bb9f	ca652ee1-1423-42fe-a0ef-e5761a670845
fe514238-04d9-4388-9084-4b823511bb9f	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
fe514238-04d9-4388-9084-4b823511bb9f	7879f271-4036-48be-befb-f08de052bcdc
fe514238-04d9-4388-9084-4b823511bb9f	4d783a5d-2c91-4cc0-89f6-42d0b5d189c8
c6d65e11-d335-4ab4-9d46-7ed3d9760c06	ca652ee1-1423-42fe-a0ef-e5761a670845
6d2dce9f-bbb3-42f8-ab65-e6582e2ec894	ee140dfb-14f6-41d3-b2b0-4e50764290d7
6d2dce9f-bbb3-42f8-ab65-e6582e2ec894	7a90bccb-346e-4933-aaeb-cdef732be976
6d2dce9f-bbb3-42f8-ab65-e6582e2ec894	ca652ee1-1423-42fe-a0ef-e5761a670845
6d2dce9f-bbb3-42f8-ab65-e6582e2ec894	7879f271-4036-48be-befb-f08de052bcdc
6d2dce9f-bbb3-42f8-ab65-e6582e2ec894	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
385c3cc5-ac05-4913-91c1-a7560cefdc93	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
385c3cc5-ac05-4913-91c1-a7560cefdc93	600ccd3a-a513-4a4a-864b-e00bfc9699f9
385c3cc5-ac05-4913-91c1-a7560cefdc93	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
385c3cc5-ac05-4913-91c1-a7560cefdc93	7a90bccb-346e-4933-aaeb-cdef732be976
385c3cc5-ac05-4913-91c1-a7560cefdc93	ee140dfb-14f6-41d3-b2b0-4e50764290d7
385c3cc5-ac05-4913-91c1-a7560cefdc93	25db9c19-f84e-40d8-9dfb-ee94478ca40a
742634cf-bc44-43df-a1e2-c5e087c2e116	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
5fcf1905-d2cd-495f-9080-56fe218949b6	31f1de58-af98-4946-997c-622cb20d9504
e880dda2-9fa8-418f-9d3c-452225126c65	ee140dfb-14f6-41d3-b2b0-4e50764290d7
e880dda2-9fa8-418f-9d3c-452225126c65	25db9c19-f84e-40d8-9dfb-ee94478ca40a
e880dda2-9fa8-418f-9d3c-452225126c65	600ccd3a-a513-4a4a-864b-e00bfc9699f9
e880dda2-9fa8-418f-9d3c-452225126c65	7a90bccb-346e-4933-aaeb-cdef732be976
e880dda2-9fa8-418f-9d3c-452225126c65	82f57a9f-6615-4527-816f-31ee7a0b7c98
e880dda2-9fa8-418f-9d3c-452225126c65	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
e880dda2-9fa8-418f-9d3c-452225126c65	f30de478-b560-47f5-8588-8062ffc64a25
e880dda2-9fa8-418f-9d3c-452225126c65	ca652ee1-1423-42fe-a0ef-e5761a670845
e880dda2-9fa8-418f-9d3c-452225126c65	7879f271-4036-48be-befb-f08de052bcdc
e880dda2-9fa8-418f-9d3c-452225126c65	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
385c3cc5-ac05-4913-91c1-a7560cefdc93	f30de478-b560-47f5-8588-8062ffc64a25
\.


--
-- Data for Name: space_member; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.space_member (space_id, user_id) FROM stdin;
d02ec7e4-109b-4888-a98b-8c9bccccc7a5	25db9c19-f84e-40d8-9dfb-ee94478ca40a
d02ec7e4-109b-4888-a98b-8c9bccccc7a5	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
d02ec7e4-109b-4888-a98b-8c9bccccc7a5	600ccd3a-a513-4a4a-864b-e00bfc9699f9
d02ec7e4-109b-4888-a98b-8c9bccccc7a5	f30de478-b560-47f5-8588-8062ffc64a25
4d2d08e5-03a7-49f1-a7d8-69a30e7d5026	600ccd3a-a513-4a4a-864b-e00bfc9699f9
4d2d08e5-03a7-49f1-a7d8-69a30e7d5026	25db9c19-f84e-40d8-9dfb-ee94478ca40a
1ff2fe4d-70a9-429a-b122-0a0c005ea33e	25db9c19-f84e-40d8-9dfb-ee94478ca40a
c1ddb887-3877-418f-90d2-ae219bf80385	4d783a5d-2c91-4cc0-89f6-42d0b5d189c8
8411965c-1b83-41df-a090-904777ee199f	4d783a5d-2c91-4cc0-89f6-42d0b5d189c8
c1ddb887-3877-418f-90d2-ae219bf80385	f30de478-b560-47f5-8588-8062ffc64a25
c1ddb887-3877-418f-90d2-ae219bf80385	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
c1ddb887-3877-418f-90d2-ae219bf80385	25db9c19-f84e-40d8-9dfb-ee94478ca40a
c1ddb887-3877-418f-90d2-ae219bf80385	600ccd3a-a513-4a4a-864b-e00bfc9699f9
c1ddb887-3877-418f-90d2-ae219bf80385	7a90bccb-346e-4933-aaeb-cdef732be976
c1ddb887-3877-418f-90d2-ae219bf80385	82f57a9f-6615-4527-816f-31ee7a0b7c98
c1ddb887-3877-418f-90d2-ae219bf80385	ca652ee1-1423-42fe-a0ef-e5761a670845
bf93dbe8-1c6d-447f-8343-debd812a3519	25db9c19-f84e-40d8-9dfb-ee94478ca40a
bf93dbe8-1c6d-447f-8343-debd812a3519	600ccd3a-a513-4a4a-864b-e00bfc9699f9
bf93dbe8-1c6d-447f-8343-debd812a3519	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
bf93dbe8-1c6d-447f-8343-debd812a3519	82f57a9f-6615-4527-816f-31ee7a0b7c98
bbafe64e-d4aa-40a8-8345-e4d2a90cecf9	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
8411965c-1b83-41df-a090-904777ee199f	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
817fe305-f868-4bb0-a9fb-fc15b70ba296	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
929fb8af-5f77-44be-a1f4-f8cee0929456	f30de478-b560-47f5-8588-8062ffc64a25
bf93dbe8-1c6d-447f-8343-debd812a3519	ee140dfb-14f6-41d3-b2b0-4e50764290d7
bbafe64e-d4aa-40a8-8345-e4d2a90cecf9	ca652ee1-1423-42fe-a0ef-e5761a670845
bbafe64e-d4aa-40a8-8345-e4d2a90cecf9	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
1ff2fe4d-70a9-429a-b122-0a0c005ea33e	600ccd3a-a513-4a4a-864b-e00bfc9699f9
817fe305-f868-4bb0-a9fb-fc15b70ba296	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
1ff2fe4d-70a9-429a-b122-0a0c005ea33e	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
817fe305-f868-4bb0-a9fb-fc15b70ba296	600ccd3a-a513-4a4a-864b-e00bfc9699f9
1ff2fe4d-70a9-429a-b122-0a0c005ea33e	ee140dfb-14f6-41d3-b2b0-4e50764290d7
c1ddb887-3877-418f-90d2-ae219bf80385	ee140dfb-14f6-41d3-b2b0-4e50764290d7
929fb8af-5f77-44be-a1f4-f8cee0929456	25db9c19-f84e-40d8-9dfb-ee94478ca40a
c1ddb887-3877-418f-90d2-ae219bf80385	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
4d2d08e5-03a7-49f1-a7d8-69a30e7d5026	f30de478-b560-47f5-8588-8062ffc64a25
bbafe64e-d4aa-40a8-8345-e4d2a90cecf9	7a90bccb-346e-4933-aaeb-cdef732be976
bbafe64e-d4aa-40a8-8345-e4d2a90cecf9	ee140dfb-14f6-41d3-b2b0-4e50764290d7
8411965c-1b83-41df-a090-904777ee199f	f30de478-b560-47f5-8588-8062ffc64a25
1ff2fe4d-70a9-429a-b122-0a0c005ea33e	82f57a9f-6615-4527-816f-31ee7a0b7c98
c1ddb887-3877-418f-90d2-ae219bf80385	7879f271-4036-48be-befb-f08de052bcdc
bbafe64e-d4aa-40a8-8345-e4d2a90cecf9	7879f271-4036-48be-befb-f08de052bcdc
1ff2fe4d-70a9-429a-b122-0a0c005ea33e	31f1de58-af98-4946-997c-622cb20d9504
817fe305-f868-4bb0-a9fb-fc15b70ba296	ca652ee1-1423-42fe-a0ef-e5761a670845
817fe305-f868-4bb0-a9fb-fc15b70ba296	7879f271-4036-48be-befb-f08de052bcdc
\.


--
-- Data for Name: team_invitation; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.team_invitation (id, email, used_at, token, created_at, inviting_user_id, team_id, used_by_user_id) FROM stdin;
a924e75d-dca5-4622-aee3-1eb89fd273e7	adam@acape.la	2021-05-21	24bccd6f-0102-4f83-977c-e0edf9585ee6	2021-05-21 09:58:42.83206+00	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	68246df6-08b9-4555-9e2a-55eba2ae3ad3	\N
dc2cb84f-1094-4845-9961-db6f744f74e7	britta@acape.la	2021-05-21	22c6944a-753c-4b1b-abea-342af76363e7	2021-05-21 11:19:55.091773+00	ee140dfb-14f6-41d3-b2b0-4e50764290d7	68246df6-08b9-4555-9e2a-55eba2ae3ad3	\N
40ce496e-1b3e-4490-811e-0843044f98b9	roland@acape.la	2021-05-21	b58e89b2-c297-4607-a853-7007f733f9e6	2021-05-21 11:19:59.819348+00	ee140dfb-14f6-41d3-b2b0-4e50764290d7	68246df6-08b9-4555-9e2a-55eba2ae3ad3	\N
d08e5d69-0449-440f-9fa6-7a34627ce4f9	omar@acape.la	2021-05-24	b0de2208-87d5-439d-805a-71f18c1bb6ea	2021-05-24 06:39:48.150909+00	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	68246df6-08b9-4555-9e2a-55eba2ae3ad3	\N
788efbc0-291b-4424-a16d-d3b672bc27fb	yuliia@acape.la	2021-05-25	8527ce65-f878-405f-b70f-8de8443ff6cd	2021-05-21 14:16:47.457314+00	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	68246df6-08b9-4555-9e2a-55eba2ae3ad3	\N
ab8dd7a5-8221-41b4-89d9-7ecd32fc9459	arnoldas@acape.la	2021-06-01	cdec3dfe-a152-4f4b-8bb1-aa833b3fe536	2021-06-01 12:16:10.434682+00	25db9c19-f84e-40d8-9dfb-ee94478ca40a	68246df6-08b9-4555-9e2a-55eba2ae3ad3	\N
00476b3a-35b7-4a53-b364-63c1645ee3aa	jannick@acape.la	2021-06-08	a3334554-81d1-4578-9c5c-746c11829412	2021-06-07 14:59:30.326772+00	ee140dfb-14f6-41d3-b2b0-4e50764290d7	68246df6-08b9-4555-9e2a-55eba2ae3ad3	\N
4b0a602d-864e-4e34-8668-4c4d2fe17992	leonie@acape.la	2021-07-15	0a3c6ec4-de1f-4ba0-8f3f-e359a453bae5	2021-07-15 08:20:33.40198+00	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	68246df6-08b9-4555-9e2a-55eba2ae3ad3	4d783a5d-2c91-4cc0-89f6-42d0b5d189c8
df06b066-cf3f-4c47-85ed-0586cfcef8ee	me@christophwitzko.com	2021-07-16	491eada9-525d-40d0-a76f-d02fafa34ce5	2021-07-16 09:04:21.882682+00	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e	68246df6-08b9-4555-9e2a-55eba2ae3ad3	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
95773fa9-c9cd-4fd8-9278-474b84b250ee	gregor@acape.la	2021-07-27	ed5426a0-55d2-4b55-8601-9a3be874319c	2021-07-27 13:18:57.359348+00	600ccd3a-a513-4a4a-864b-e00bfc9699f9	68246df6-08b9-4555-9e2a-55eba2ae3ad3	7879f271-4036-48be-befb-f08de052bcdc
819291c3-2431-4ae9-8fa3-9d6308384a2a	ana@heyana.co	2021-08-03	ff792a8a-e468-4110-9109-4212776b7ddd	2021-08-03 08:53:33.792382+00	f30de478-b560-47f5-8588-8062ffc64a25	68246df6-08b9-4555-9e2a-55eba2ae3ad3	31f1de58-af98-4946-997c-622cb20d9504
\.


--
-- Data for Name: team_member; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.team_member (team_id, user_id) FROM stdin;
68246df6-08b9-4555-9e2a-55eba2ae3ad3	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
68246df6-08b9-4555-9e2a-55eba2ae3ad3	ee140dfb-14f6-41d3-b2b0-4e50764290d7
68246df6-08b9-4555-9e2a-55eba2ae3ad3	25db9c19-f84e-40d8-9dfb-ee94478ca40a
68246df6-08b9-4555-9e2a-55eba2ae3ad3	600ccd3a-a513-4a4a-864b-e00bfc9699f9
68246df6-08b9-4555-9e2a-55eba2ae3ad3	7a90bccb-346e-4933-aaeb-cdef732be976
68246df6-08b9-4555-9e2a-55eba2ae3ad3	82f57a9f-6615-4527-816f-31ee7a0b7c98
68246df6-08b9-4555-9e2a-55eba2ae3ad3	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
68246df6-08b9-4555-9e2a-55eba2ae3ad3	f30de478-b560-47f5-8588-8062ffc64a25
68246df6-08b9-4555-9e2a-55eba2ae3ad3	ca652ee1-1423-42fe-a0ef-e5761a670845
68246df6-08b9-4555-9e2a-55eba2ae3ad3	4d783a5d-2c91-4cc0-89f6-42d0b5d189c8
68246df6-08b9-4555-9e2a-55eba2ae3ad3	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
68246df6-08b9-4555-9e2a-55eba2ae3ad3	7879f271-4036-48be-befb-f08de052bcdc
68246df6-08b9-4555-9e2a-55eba2ae3ad3	31f1de58-af98-4946-997c-622cb20d9504
\.


--
-- Data for Name: team_slack_installation; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.team_slack_installation (team_id, data) FROM stdin;
\.


--
-- Data for Name: topic_member; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.topic_member (topic_id, user_id) FROM stdin;
ccdf7719-9369-4cf4-8421-70c8a2dedd65	82f57a9f-6615-4527-816f-31ee7a0b7c98
ccdf7719-9369-4cf4-8421-70c8a2dedd65	600ccd3a-a513-4a4a-864b-e00bfc9699f9
ccdf7719-9369-4cf4-8421-70c8a2dedd65	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
f5d29f20-c37a-489e-9273-4d29f451ad6f	82f57a9f-6615-4527-816f-31ee7a0b7c98
f5d29f20-c37a-489e-9273-4d29f451ad6f	600ccd3a-a513-4a4a-864b-e00bfc9699f9
f5d29f20-c37a-489e-9273-4d29f451ad6f	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
880ecb5b-b824-4afe-bcbb-59a968d1d803	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
ac7cc3cd-7bd1-4990-95a3-0537ab485bc5	f30de478-b560-47f5-8588-8062ffc64a25
ac7cc3cd-7bd1-4990-95a3-0537ab485bc5	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
ac7cc3cd-7bd1-4990-95a3-0537ab485bc5	ee140dfb-14f6-41d3-b2b0-4e50764290d7
ac7cc3cd-7bd1-4990-95a3-0537ab485bc5	25db9c19-f84e-40d8-9dfb-ee94478ca40a
ac7cc3cd-7bd1-4990-95a3-0537ab485bc5	600ccd3a-a513-4a4a-864b-e00bfc9699f9
ac7cc3cd-7bd1-4990-95a3-0537ab485bc5	7a90bccb-346e-4933-aaeb-cdef732be976
ac7cc3cd-7bd1-4990-95a3-0537ab485bc5	82f57a9f-6615-4527-816f-31ee7a0b7c98
ac7cc3cd-7bd1-4990-95a3-0537ab485bc5	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
ac7cc3cd-7bd1-4990-95a3-0537ab485bc5	ca652ee1-1423-42fe-a0ef-e5761a670845
880ecb5b-b824-4afe-bcbb-59a968d1d803	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
880ecb5b-b824-4afe-bcbb-59a968d1d803	600ccd3a-a513-4a4a-864b-e00bfc9699f9
c56e8548-9a75-43f5-9a52-d45691ab0b13	f30de478-b560-47f5-8588-8062ffc64a25
c56e8548-9a75-43f5-9a52-d45691ab0b13	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
c56e8548-9a75-43f5-9a52-d45691ab0b13	ee140dfb-14f6-41d3-b2b0-4e50764290d7
c56e8548-9a75-43f5-9a52-d45691ab0b13	25db9c19-f84e-40d8-9dfb-ee94478ca40a
880ecb5b-b824-4afe-bcbb-59a968d1d803	25db9c19-f84e-40d8-9dfb-ee94478ca40a
ed0cd994-b487-43f9-a7af-3bd5b64830b4	ca652ee1-1423-42fe-a0ef-e5761a670845
ed0cd994-b487-43f9-a7af-3bd5b64830b4	ee140dfb-14f6-41d3-b2b0-4e50764290d7
ed0cd994-b487-43f9-a7af-3bd5b64830b4	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
ed0cd994-b487-43f9-a7af-3bd5b64830b4	7a90bccb-346e-4933-aaeb-cdef732be976
ed0cd994-b487-43f9-a7af-3bd5b64830b4	82f57a9f-6615-4527-816f-31ee7a0b7c98
ed0cd994-b487-43f9-a7af-3bd5b64830b4	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
3a3ff258-367a-4236-b2ba-40b2619108db	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
3a3ff258-367a-4236-b2ba-40b2619108db	ee140dfb-14f6-41d3-b2b0-4e50764290d7
3a3ff258-367a-4236-b2ba-40b2619108db	7879f271-4036-48be-befb-f08de052bcdc
17b401b9-004c-446d-8b31-c072c5ad870d	f30de478-b560-47f5-8588-8062ffc64a25
2f38aa46-5517-4c9b-b060-81e3a2864bee	f30de478-b560-47f5-8588-8062ffc64a25
3a2032b1-8190-47b2-84d6-28998118838d	f30de478-b560-47f5-8588-8062ffc64a25
810dbc47-af96-4c1b-bdbd-b1dcd6aa4322	f30de478-b560-47f5-8588-8062ffc64a25
9fa78080-867b-4e01-b60a-6f47b55c4b58	f30de478-b560-47f5-8588-8062ffc64a25
44660c03-0bba-42df-b615-b3638a56d282	f30de478-b560-47f5-8588-8062ffc64a25
447c3879-98b7-45f7-a978-77f20fc8c69a	f30de478-b560-47f5-8588-8062ffc64a25
6c291865-999e-4a1d-9588-5ad93cedbbf5	f30de478-b560-47f5-8588-8062ffc64a25
8ef2ac54-7d44-4bfd-b897-f88ee920764e	f30de478-b560-47f5-8588-8062ffc64a25
46cfadba-77ea-42f8-b81f-afa0ab158576	f30de478-b560-47f5-8588-8062ffc64a25
46cfadba-77ea-42f8-b81f-afa0ab158576	25db9c19-f84e-40d8-9dfb-ee94478ca40a
46cfadba-77ea-42f8-b81f-afa0ab158576	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
46cfadba-77ea-42f8-b81f-afa0ab158576	82f57a9f-6615-4527-816f-31ee7a0b7c98
46cfadba-77ea-42f8-b81f-afa0ab158576	ee140dfb-14f6-41d3-b2b0-4e50764290d7
7e4b0258-e951-48ba-957d-9eb46d06a520	f30de478-b560-47f5-8588-8062ffc64a25
7e4b0258-e951-48ba-957d-9eb46d06a520	25db9c19-f84e-40d8-9dfb-ee94478ca40a
7e4b0258-e951-48ba-957d-9eb46d06a520	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
7e4b0258-e951-48ba-957d-9eb46d06a520	82f57a9f-6615-4527-816f-31ee7a0b7c98
7e4b0258-e951-48ba-957d-9eb46d06a520	ee140dfb-14f6-41d3-b2b0-4e50764290d7
7e4b0258-e951-48ba-957d-9eb46d06a520	600ccd3a-a513-4a4a-864b-e00bfc9699f9
7e4b0258-e951-48ba-957d-9eb46d06a520	7a90bccb-346e-4933-aaeb-cdef732be976
7e4b0258-e951-48ba-957d-9eb46d06a520	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
7e4b0258-e951-48ba-957d-9eb46d06a520	ca652ee1-1423-42fe-a0ef-e5761a670845
f761c6ac-aa4c-4da9-bba5-32896711efc4	f30de478-b560-47f5-8588-8062ffc64a25
f761c6ac-aa4c-4da9-bba5-32896711efc4	25db9c19-f84e-40d8-9dfb-ee94478ca40a
f761c6ac-aa4c-4da9-bba5-32896711efc4	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
f761c6ac-aa4c-4da9-bba5-32896711efc4	82f57a9f-6615-4527-816f-31ee7a0b7c98
f761c6ac-aa4c-4da9-bba5-32896711efc4	ee140dfb-14f6-41d3-b2b0-4e50764290d7
f761c6ac-aa4c-4da9-bba5-32896711efc4	600ccd3a-a513-4a4a-864b-e00bfc9699f9
f761c6ac-aa4c-4da9-bba5-32896711efc4	7a90bccb-346e-4933-aaeb-cdef732be976
f761c6ac-aa4c-4da9-bba5-32896711efc4	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
f761c6ac-aa4c-4da9-bba5-32896711efc4	ca652ee1-1423-42fe-a0ef-e5761a670845
a1301660-03c4-4d06-820f-b4cd9d0a64a9	f30de478-b560-47f5-8588-8062ffc64a25
a1301660-03c4-4d06-820f-b4cd9d0a64a9	25db9c19-f84e-40d8-9dfb-ee94478ca40a
a1301660-03c4-4d06-820f-b4cd9d0a64a9	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
a1301660-03c4-4d06-820f-b4cd9d0a64a9	82f57a9f-6615-4527-816f-31ee7a0b7c98
a1301660-03c4-4d06-820f-b4cd9d0a64a9	ee140dfb-14f6-41d3-b2b0-4e50764290d7
a1301660-03c4-4d06-820f-b4cd9d0a64a9	600ccd3a-a513-4a4a-864b-e00bfc9699f9
a1301660-03c4-4d06-820f-b4cd9d0a64a9	7a90bccb-346e-4933-aaeb-cdef732be976
a1301660-03c4-4d06-820f-b4cd9d0a64a9	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
a1301660-03c4-4d06-820f-b4cd9d0a64a9	ca652ee1-1423-42fe-a0ef-e5761a670845
6c291865-999e-4a1d-9588-5ad93cedbbf5	7a90bccb-346e-4933-aaeb-cdef732be976
8209f70d-d1be-4707-834b-3f45dd3b2178	f30de478-b560-47f5-8588-8062ffc64a25
8209f70d-d1be-4707-834b-3f45dd3b2178	25db9c19-f84e-40d8-9dfb-ee94478ca40a
8209f70d-d1be-4707-834b-3f45dd3b2178	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
8209f70d-d1be-4707-834b-3f45dd3b2178	82f57a9f-6615-4527-816f-31ee7a0b7c98
8209f70d-d1be-4707-834b-3f45dd3b2178	ee140dfb-14f6-41d3-b2b0-4e50764290d7
8209f70d-d1be-4707-834b-3f45dd3b2178	600ccd3a-a513-4a4a-864b-e00bfc9699f9
8209f70d-d1be-4707-834b-3f45dd3b2178	7a90bccb-346e-4933-aaeb-cdef732be976
8209f70d-d1be-4707-834b-3f45dd3b2178	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
8209f70d-d1be-4707-834b-3f45dd3b2178	ca652ee1-1423-42fe-a0ef-e5761a670845
16f2850f-f630-44da-8529-d05b38e03394	f30de478-b560-47f5-8588-8062ffc64a25
16f2850f-f630-44da-8529-d05b38e03394	25db9c19-f84e-40d8-9dfb-ee94478ca40a
16f2850f-f630-44da-8529-d05b38e03394	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
16f2850f-f630-44da-8529-d05b38e03394	82f57a9f-6615-4527-816f-31ee7a0b7c98
16f2850f-f630-44da-8529-d05b38e03394	ee140dfb-14f6-41d3-b2b0-4e50764290d7
16f2850f-f630-44da-8529-d05b38e03394	600ccd3a-a513-4a4a-864b-e00bfc9699f9
16f2850f-f630-44da-8529-d05b38e03394	7a90bccb-346e-4933-aaeb-cdef732be976
16f2850f-f630-44da-8529-d05b38e03394	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
16f2850f-f630-44da-8529-d05b38e03394	ca652ee1-1423-42fe-a0ef-e5761a670845
4bede90b-6829-469f-8735-55a430a0547e	f30de478-b560-47f5-8588-8062ffc64a25
4bede90b-6829-469f-8735-55a430a0547e	25db9c19-f84e-40d8-9dfb-ee94478ca40a
4bede90b-6829-469f-8735-55a430a0547e	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
4bede90b-6829-469f-8735-55a430a0547e	82f57a9f-6615-4527-816f-31ee7a0b7c98
4bede90b-6829-469f-8735-55a430a0547e	ee140dfb-14f6-41d3-b2b0-4e50764290d7
4bede90b-6829-469f-8735-55a430a0547e	600ccd3a-a513-4a4a-864b-e00bfc9699f9
4bede90b-6829-469f-8735-55a430a0547e	7a90bccb-346e-4933-aaeb-cdef732be976
4bede90b-6829-469f-8735-55a430a0547e	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
4bede90b-6829-469f-8735-55a430a0547e	ca652ee1-1423-42fe-a0ef-e5761a670845
601996cc-a8e9-44e2-adde-4071301dc791	f30de478-b560-47f5-8588-8062ffc64a25
601996cc-a8e9-44e2-adde-4071301dc791	25db9c19-f84e-40d8-9dfb-ee94478ca40a
601996cc-a8e9-44e2-adde-4071301dc791	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
601996cc-a8e9-44e2-adde-4071301dc791	82f57a9f-6615-4527-816f-31ee7a0b7c98
601996cc-a8e9-44e2-adde-4071301dc791	ee140dfb-14f6-41d3-b2b0-4e50764290d7
601996cc-a8e9-44e2-adde-4071301dc791	600ccd3a-a513-4a4a-864b-e00bfc9699f9
601996cc-a8e9-44e2-adde-4071301dc791	7a90bccb-346e-4933-aaeb-cdef732be976
601996cc-a8e9-44e2-adde-4071301dc791	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
601996cc-a8e9-44e2-adde-4071301dc791	ca652ee1-1423-42fe-a0ef-e5761a670845
eb7722ae-b13b-4a89-9162-6bb597524ee5	f30de478-b560-47f5-8588-8062ffc64a25
eb7722ae-b13b-4a89-9162-6bb597524ee5	25db9c19-f84e-40d8-9dfb-ee94478ca40a
eb7722ae-b13b-4a89-9162-6bb597524ee5	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
eb7722ae-b13b-4a89-9162-6bb597524ee5	82f57a9f-6615-4527-816f-31ee7a0b7c98
eb7722ae-b13b-4a89-9162-6bb597524ee5	ee140dfb-14f6-41d3-b2b0-4e50764290d7
eb7722ae-b13b-4a89-9162-6bb597524ee5	7a90bccb-346e-4933-aaeb-cdef732be976
eb7722ae-b13b-4a89-9162-6bb597524ee5	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
eb7722ae-b13b-4a89-9162-6bb597524ee5	ca652ee1-1423-42fe-a0ef-e5761a670845
eb7722ae-b13b-4a89-9162-6bb597524ee5	600ccd3a-a513-4a4a-864b-e00bfc9699f9
4a2e3c80-7128-4a2a-a727-ca78bd976e77	7a90bccb-346e-4933-aaeb-cdef732be976
4a2e3c80-7128-4a2a-a727-ca78bd976e77	82f57a9f-6615-4527-816f-31ee7a0b7c98
4a2e3c80-7128-4a2a-a727-ca78bd976e77	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
faeb4daa-d511-4807-a679-b023576c5540	7a90bccb-346e-4933-aaeb-cdef732be976
faeb4daa-d511-4807-a679-b023576c5540	82f57a9f-6615-4527-816f-31ee7a0b7c98
faeb4daa-d511-4807-a679-b023576c5540	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
63724e58-b0e4-4095-ab63-b9922400702a	7a90bccb-346e-4933-aaeb-cdef732be976
63724e58-b0e4-4095-ab63-b9922400702a	82f57a9f-6615-4527-816f-31ee7a0b7c98
63724e58-b0e4-4095-ab63-b9922400702a	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
cb232862-61c5-4254-bff4-f2b35f0b8817	25db9c19-f84e-40d8-9dfb-ee94478ca40a
cb232862-61c5-4254-bff4-f2b35f0b8817	600ccd3a-a513-4a4a-864b-e00bfc9699f9
cb232862-61c5-4254-bff4-f2b35f0b8817	82f57a9f-6615-4527-816f-31ee7a0b7c98
cb232862-61c5-4254-bff4-f2b35f0b8817	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
f98de3d4-4dc7-400a-979c-80f15767a230	25db9c19-f84e-40d8-9dfb-ee94478ca40a
f98de3d4-4dc7-400a-979c-80f15767a230	600ccd3a-a513-4a4a-864b-e00bfc9699f9
f98de3d4-4dc7-400a-979c-80f15767a230	82f57a9f-6615-4527-816f-31ee7a0b7c98
f98de3d4-4dc7-400a-979c-80f15767a230	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
53de72b0-b18d-4cf3-93ea-a48b894761e8	25db9c19-f84e-40d8-9dfb-ee94478ca40a
53de72b0-b18d-4cf3-93ea-a48b894761e8	600ccd3a-a513-4a4a-864b-e00bfc9699f9
53de72b0-b18d-4cf3-93ea-a48b894761e8	82f57a9f-6615-4527-816f-31ee7a0b7c98
53de72b0-b18d-4cf3-93ea-a48b894761e8	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
2d06c3da-ac1f-4dac-9c08-fedee14ed5de	25db9c19-f84e-40d8-9dfb-ee94478ca40a
2d06c3da-ac1f-4dac-9c08-fedee14ed5de	600ccd3a-a513-4a4a-864b-e00bfc9699f9
2d06c3da-ac1f-4dac-9c08-fedee14ed5de	82f57a9f-6615-4527-816f-31ee7a0b7c98
2d06c3da-ac1f-4dac-9c08-fedee14ed5de	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
389d6acf-b00a-42fd-bdbd-4df84f96bbf6	82f57a9f-6615-4527-816f-31ee7a0b7c98
389d6acf-b00a-42fd-bdbd-4df84f96bbf6	600ccd3a-a513-4a4a-864b-e00bfc9699f9
389d6acf-b00a-42fd-bdbd-4df84f96bbf6	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
c2e6c5e7-2558-4d15-b8a2-bd393043db01	82f57a9f-6615-4527-816f-31ee7a0b7c98
c2e6c5e7-2558-4d15-b8a2-bd393043db01	600ccd3a-a513-4a4a-864b-e00bfc9699f9
c2e6c5e7-2558-4d15-b8a2-bd393043db01	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
0580623c-90ab-4b56-ae7e-c0a0f97fc6ca	f30de478-b560-47f5-8588-8062ffc64a25
0580623c-90ab-4b56-ae7e-c0a0f97fc6ca	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
0580623c-90ab-4b56-ae7e-c0a0f97fc6ca	ee140dfb-14f6-41d3-b2b0-4e50764290d7
0580623c-90ab-4b56-ae7e-c0a0f97fc6ca	25db9c19-f84e-40d8-9dfb-ee94478ca40a
0580623c-90ab-4b56-ae7e-c0a0f97fc6ca	600ccd3a-a513-4a4a-864b-e00bfc9699f9
0580623c-90ab-4b56-ae7e-c0a0f97fc6ca	7a90bccb-346e-4933-aaeb-cdef732be976
0580623c-90ab-4b56-ae7e-c0a0f97fc6ca	82f57a9f-6615-4527-816f-31ee7a0b7c98
0580623c-90ab-4b56-ae7e-c0a0f97fc6ca	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
c56e8548-9a75-43f5-9a52-d45691ab0b13	600ccd3a-a513-4a4a-864b-e00bfc9699f9
c56e8548-9a75-43f5-9a52-d45691ab0b13	7a90bccb-346e-4933-aaeb-cdef732be976
c56e8548-9a75-43f5-9a52-d45691ab0b13	82f57a9f-6615-4527-816f-31ee7a0b7c98
c56e8548-9a75-43f5-9a52-d45691ab0b13	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
c56e8548-9a75-43f5-9a52-d45691ab0b13	ca652ee1-1423-42fe-a0ef-e5761a670845
47b58a79-58ed-4ab8-91c6-00584868725d	f30de478-b560-47f5-8588-8062ffc64a25
47b58a79-58ed-4ab8-91c6-00584868725d	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
47b58a79-58ed-4ab8-91c6-00584868725d	ee140dfb-14f6-41d3-b2b0-4e50764290d7
47b58a79-58ed-4ab8-91c6-00584868725d	25db9c19-f84e-40d8-9dfb-ee94478ca40a
47b58a79-58ed-4ab8-91c6-00584868725d	600ccd3a-a513-4a4a-864b-e00bfc9699f9
47b58a79-58ed-4ab8-91c6-00584868725d	7a90bccb-346e-4933-aaeb-cdef732be976
47b58a79-58ed-4ab8-91c6-00584868725d	82f57a9f-6615-4527-816f-31ee7a0b7c98
47b58a79-58ed-4ab8-91c6-00584868725d	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
47b58a79-58ed-4ab8-91c6-00584868725d	ca652ee1-1423-42fe-a0ef-e5761a670845
ac783c23-e52d-4786-97b1-26224a4de472	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
b4bbb420-3344-4331-b867-6c41ddd64536	f30de478-b560-47f5-8588-8062ffc64a25
ac783c23-e52d-4786-97b1-26224a4de472	ee140dfb-14f6-41d3-b2b0-4e50764290d7
ac783c23-e52d-4786-97b1-26224a4de472	25db9c19-f84e-40d8-9dfb-ee94478ca40a
ac783c23-e52d-4786-97b1-26224a4de472	600ccd3a-a513-4a4a-864b-e00bfc9699f9
986aa5b3-c238-4f52-a600-4db2ece4b9ee	f30de478-b560-47f5-8588-8062ffc64a25
986aa5b3-c238-4f52-a600-4db2ece4b9ee	25db9c19-f84e-40d8-9dfb-ee94478ca40a
986aa5b3-c238-4f52-a600-4db2ece4b9ee	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
986aa5b3-c238-4f52-a600-4db2ece4b9ee	82f57a9f-6615-4527-816f-31ee7a0b7c98
986aa5b3-c238-4f52-a600-4db2ece4b9ee	ee140dfb-14f6-41d3-b2b0-4e50764290d7
986aa5b3-c238-4f52-a600-4db2ece4b9ee	7a90bccb-346e-4933-aaeb-cdef732be976
986aa5b3-c238-4f52-a600-4db2ece4b9ee	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
986aa5b3-c238-4f52-a600-4db2ece4b9ee	ca652ee1-1423-42fe-a0ef-e5761a670845
986aa5b3-c238-4f52-a600-4db2ece4b9ee	600ccd3a-a513-4a4a-864b-e00bfc9699f9
73763d8a-cbda-477a-95cb-36a1f9e4229b	f30de478-b560-47f5-8588-8062ffc64a25
73763d8a-cbda-477a-95cb-36a1f9e4229b	25db9c19-f84e-40d8-9dfb-ee94478ca40a
73763d8a-cbda-477a-95cb-36a1f9e4229b	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
73763d8a-cbda-477a-95cb-36a1f9e4229b	82f57a9f-6615-4527-816f-31ee7a0b7c98
73763d8a-cbda-477a-95cb-36a1f9e4229b	ee140dfb-14f6-41d3-b2b0-4e50764290d7
73763d8a-cbda-477a-95cb-36a1f9e4229b	7a90bccb-346e-4933-aaeb-cdef732be976
73763d8a-cbda-477a-95cb-36a1f9e4229b	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
73763d8a-cbda-477a-95cb-36a1f9e4229b	ca652ee1-1423-42fe-a0ef-e5761a670845
73763d8a-cbda-477a-95cb-36a1f9e4229b	600ccd3a-a513-4a4a-864b-e00bfc9699f9
af921e4f-c64e-4462-b565-b9bbc85dee8b	ca652ee1-1423-42fe-a0ef-e5761a670845
289bb606-7ac4-49ea-8147-6a9eed284d36	ca652ee1-1423-42fe-a0ef-e5761a670845
b211ac73-ce13-4b92-a9c8-7e2146db3dd5	ca652ee1-1423-42fe-a0ef-e5761a670845
832f3a41-2f78-4402-9202-78ad6d64f4cd	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
92c036e0-1b96-45ad-b529-a227b1e935e4	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
8a0d6a5d-04cf-454b-b088-34c9386e026c	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
8a0d6a5d-04cf-454b-b088-34c9386e026c	ee140dfb-14f6-41d3-b2b0-4e50764290d7
8a0d6a5d-04cf-454b-b088-34c9386e026c	7a90bccb-346e-4933-aaeb-cdef732be976
8a0d6a5d-04cf-454b-b088-34c9386e026c	ca652ee1-1423-42fe-a0ef-e5761a670845
9c515d50-ad3c-406e-a431-57caed837571	600ccd3a-a513-4a4a-864b-e00bfc9699f9
ec3477e0-ea66-4ba8-9275-5d6924345385	600ccd3a-a513-4a4a-864b-e00bfc9699f9
b4bbb420-3344-4331-b867-6c41ddd64536	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
ac783c23-e52d-4786-97b1-26224a4de472	7a90bccb-346e-4933-aaeb-cdef732be976
ac783c23-e52d-4786-97b1-26224a4de472	82f57a9f-6615-4527-816f-31ee7a0b7c98
ac783c23-e52d-4786-97b1-26224a4de472	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
ac783c23-e52d-4786-97b1-26224a4de472	f30de478-b560-47f5-8588-8062ffc64a25
b4bbb420-3344-4331-b867-6c41ddd64536	ee140dfb-14f6-41d3-b2b0-4e50764290d7
b4bbb420-3344-4331-b867-6c41ddd64536	25db9c19-f84e-40d8-9dfb-ee94478ca40a
b4bbb420-3344-4331-b867-6c41ddd64536	600ccd3a-a513-4a4a-864b-e00bfc9699f9
ac783c23-e52d-4786-97b1-26224a4de472	ca652ee1-1423-42fe-a0ef-e5761a670845
b4bbb420-3344-4331-b867-6c41ddd64536	7a90bccb-346e-4933-aaeb-cdef732be976
b4bbb420-3344-4331-b867-6c41ddd64536	82f57a9f-6615-4527-816f-31ee7a0b7c98
b4bbb420-3344-4331-b867-6c41ddd64536	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
a76e9cee-f598-4b10-a3bf-28de9b5f315e	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
b4bbb420-3344-4331-b867-6c41ddd64536	ca652ee1-1423-42fe-a0ef-e5761a670845
44dcd3bf-fb17-401b-a8cc-9cf060f83c01	f30de478-b560-47f5-8588-8062ffc64a25
44dcd3bf-fb17-401b-a8cc-9cf060f83c01	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
44dcd3bf-fb17-401b-a8cc-9cf060f83c01	ee140dfb-14f6-41d3-b2b0-4e50764290d7
44dcd3bf-fb17-401b-a8cc-9cf060f83c01	25db9c19-f84e-40d8-9dfb-ee94478ca40a
44dcd3bf-fb17-401b-a8cc-9cf060f83c01	600ccd3a-a513-4a4a-864b-e00bfc9699f9
44dcd3bf-fb17-401b-a8cc-9cf060f83c01	7a90bccb-346e-4933-aaeb-cdef732be976
44dcd3bf-fb17-401b-a8cc-9cf060f83c01	82f57a9f-6615-4527-816f-31ee7a0b7c98
44dcd3bf-fb17-401b-a8cc-9cf060f83c01	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
44dcd3bf-fb17-401b-a8cc-9cf060f83c01	ca652ee1-1423-42fe-a0ef-e5761a670845
96c354e5-89c7-47c2-8a23-3474dde5b7ee	ca652ee1-1423-42fe-a0ef-e5761a670845
7371c4ac-49c3-46b2-8028-7b1c3a9cef76	ca652ee1-1423-42fe-a0ef-e5761a670845
e738800a-5a93-4e51-90fb-ca78109b076e	ca652ee1-1423-42fe-a0ef-e5761a670845
a76e9cee-f598-4b10-a3bf-28de9b5f315e	ee140dfb-14f6-41d3-b2b0-4e50764290d7
08dc2b07-48df-4877-a228-167e962bd960	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
7e708d94-ba39-4aed-bd69-f0a7d0c9b957	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
806dfed4-1225-47b6-8de7-80b7fbc1cc87	82f57a9f-6615-4527-816f-31ee7a0b7c98
806dfed4-1225-47b6-8de7-80b7fbc1cc87	600ccd3a-a513-4a4a-864b-e00bfc9699f9
806dfed4-1225-47b6-8de7-80b7fbc1cc87	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
4430d17f-63f1-4182-ab5b-608ab06bff29	25db9c19-f84e-40d8-9dfb-ee94478ca40a
d6e29e34-926f-43e5-b8ca-d91e53061ae1	25db9c19-f84e-40d8-9dfb-ee94478ca40a
d6e29e34-926f-43e5-b8ca-d91e53061ae1	600ccd3a-a513-4a4a-864b-e00bfc9699f9
26dc18b0-cbc0-4b34-8927-8be0fb231ae2	25db9c19-f84e-40d8-9dfb-ee94478ca40a
26dc18b0-cbc0-4b34-8927-8be0fb231ae2	600ccd3a-a513-4a4a-864b-e00bfc9699f9
1ed8506a-17c8-4b3c-818b-9d10f670b1b1	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
d0b8bf8e-dd2e-4e00-84f5-b6c3ca13ea2a	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
d0b8bf8e-dd2e-4e00-84f5-b6c3ca13ea2a	ca652ee1-1423-42fe-a0ef-e5761a670845
ed320f20-c3c0-4ffa-9943-37df7eaa5ea8	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
ed320f20-c3c0-4ffa-9943-37df7eaa5ea8	ca652ee1-1423-42fe-a0ef-e5761a670845
749313b8-ad19-40e1-89bc-63844d9fccec	82f57a9f-6615-4527-816f-31ee7a0b7c98
749313b8-ad19-40e1-89bc-63844d9fccec	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
749313b8-ad19-40e1-89bc-63844d9fccec	600ccd3a-a513-4a4a-864b-e00bfc9699f9
3cfb5146-8c01-4581-a5f4-a65130a188a3	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
3cfb5146-8c01-4581-a5f4-a65130a188a3	ee140dfb-14f6-41d3-b2b0-4e50764290d7
3cfb5146-8c01-4581-a5f4-a65130a188a3	25db9c19-f84e-40d8-9dfb-ee94478ca40a
3cfb5146-8c01-4581-a5f4-a65130a188a3	600ccd3a-a513-4a4a-864b-e00bfc9699f9
3cfb5146-8c01-4581-a5f4-a65130a188a3	7a90bccb-346e-4933-aaeb-cdef732be976
3cfb5146-8c01-4581-a5f4-a65130a188a3	82f57a9f-6615-4527-816f-31ee7a0b7c98
3cfb5146-8c01-4581-a5f4-a65130a188a3	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
3cfb5146-8c01-4581-a5f4-a65130a188a3	f30de478-b560-47f5-8588-8062ffc64a25
3cfb5146-8c01-4581-a5f4-a65130a188a3	ca652ee1-1423-42fe-a0ef-e5761a670845
d26b031f-fd54-471c-a6eb-2c481d128340	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
d26b031f-fd54-471c-a6eb-2c481d128340	ee140dfb-14f6-41d3-b2b0-4e50764290d7
d26b031f-fd54-471c-a6eb-2c481d128340	25db9c19-f84e-40d8-9dfb-ee94478ca40a
d26b031f-fd54-471c-a6eb-2c481d128340	600ccd3a-a513-4a4a-864b-e00bfc9699f9
d26b031f-fd54-471c-a6eb-2c481d128340	7a90bccb-346e-4933-aaeb-cdef732be976
d26b031f-fd54-471c-a6eb-2c481d128340	82f57a9f-6615-4527-816f-31ee7a0b7c98
d26b031f-fd54-471c-a6eb-2c481d128340	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
d26b031f-fd54-471c-a6eb-2c481d128340	f30de478-b560-47f5-8588-8062ffc64a25
d26b031f-fd54-471c-a6eb-2c481d128340	ca652ee1-1423-42fe-a0ef-e5761a670845
43856419-1592-4a2d-9ac9-548906db3c28	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
43856419-1592-4a2d-9ac9-548906db3c28	ee140dfb-14f6-41d3-b2b0-4e50764290d7
43856419-1592-4a2d-9ac9-548906db3c28	25db9c19-f84e-40d8-9dfb-ee94478ca40a
43856419-1592-4a2d-9ac9-548906db3c28	600ccd3a-a513-4a4a-864b-e00bfc9699f9
43856419-1592-4a2d-9ac9-548906db3c28	7a90bccb-346e-4933-aaeb-cdef732be976
43856419-1592-4a2d-9ac9-548906db3c28	82f57a9f-6615-4527-816f-31ee7a0b7c98
43856419-1592-4a2d-9ac9-548906db3c28	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
43856419-1592-4a2d-9ac9-548906db3c28	f30de478-b560-47f5-8588-8062ffc64a25
43856419-1592-4a2d-9ac9-548906db3c28	ca652ee1-1423-42fe-a0ef-e5761a670845
2d29bb62-fa72-47dd-92e2-e97256ad3ae1	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
2d29bb62-fa72-47dd-92e2-e97256ad3ae1	ee140dfb-14f6-41d3-b2b0-4e50764290d7
2d29bb62-fa72-47dd-92e2-e97256ad3ae1	600ccd3a-a513-4a4a-864b-e00bfc9699f9
2d29bb62-fa72-47dd-92e2-e97256ad3ae1	82f57a9f-6615-4527-816f-31ee7a0b7c98
2d29bb62-fa72-47dd-92e2-e97256ad3ae1	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
2d29bb62-fa72-47dd-92e2-e97256ad3ae1	ca652ee1-1423-42fe-a0ef-e5761a670845
19507902-5471-42bb-9dce-2b72d42d3456	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
19507902-5471-42bb-9dce-2b72d42d3456	ee140dfb-14f6-41d3-b2b0-4e50764290d7
19507902-5471-42bb-9dce-2b72d42d3456	600ccd3a-a513-4a4a-864b-e00bfc9699f9
19507902-5471-42bb-9dce-2b72d42d3456	82f57a9f-6615-4527-816f-31ee7a0b7c98
19507902-5471-42bb-9dce-2b72d42d3456	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
19507902-5471-42bb-9dce-2b72d42d3456	ca652ee1-1423-42fe-a0ef-e5761a670845
f2bbb218-3433-4e3c-b3be-759d1c470619	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
f2bbb218-3433-4e3c-b3be-759d1c470619	ee140dfb-14f6-41d3-b2b0-4e50764290d7
f2bbb218-3433-4e3c-b3be-759d1c470619	600ccd3a-a513-4a4a-864b-e00bfc9699f9
f2bbb218-3433-4e3c-b3be-759d1c470619	82f57a9f-6615-4527-816f-31ee7a0b7c98
f2bbb218-3433-4e3c-b3be-759d1c470619	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
f2bbb218-3433-4e3c-b3be-759d1c470619	ca652ee1-1423-42fe-a0ef-e5761a670845
ac9192a7-ff8e-4ed9-9d7f-c0c72e71dfd5	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
ac9192a7-ff8e-4ed9-9d7f-c0c72e71dfd5	600ccd3a-a513-4a4a-864b-e00bfc9699f9
6219d4cb-232d-4c8c-86a9-7b4ad4444817	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
6219d4cb-232d-4c8c-86a9-7b4ad4444817	ee140dfb-14f6-41d3-b2b0-4e50764290d7
6219d4cb-232d-4c8c-86a9-7b4ad4444817	600ccd3a-a513-4a4a-864b-e00bfc9699f9
6219d4cb-232d-4c8c-86a9-7b4ad4444817	82f57a9f-6615-4527-816f-31ee7a0b7c98
6219d4cb-232d-4c8c-86a9-7b4ad4444817	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
6219d4cb-232d-4c8c-86a9-7b4ad4444817	ca652ee1-1423-42fe-a0ef-e5761a670845
199c2d94-5468-46a4-bdef-111304e7d005	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
27395777-4065-4830-9c4b-65c7516a400a	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
27395777-4065-4830-9c4b-65c7516a400a	ca652ee1-1423-42fe-a0ef-e5761a670845
27395777-4065-4830-9c4b-65c7516a400a	ee140dfb-14f6-41d3-b2b0-4e50764290d7
d7046540-e347-43df-bd08-49e5a13cc30e	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
d7046540-e347-43df-bd08-49e5a13cc30e	ee140dfb-14f6-41d3-b2b0-4e50764290d7
d7046540-e347-43df-bd08-49e5a13cc30e	f30de478-b560-47f5-8588-8062ffc64a25
1eeb42bc-106a-4487-bf2f-b78f948cddae	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
1eeb42bc-106a-4487-bf2f-b78f948cddae	ee140dfb-14f6-41d3-b2b0-4e50764290d7
1eeb42bc-106a-4487-bf2f-b78f948cddae	82f57a9f-6615-4527-816f-31ee7a0b7c98
09bbcc44-9b82-434a-86cf-337c14f77172	25db9c19-f84e-40d8-9dfb-ee94478ca40a
09bbcc44-9b82-434a-86cf-337c14f77172	600ccd3a-a513-4a4a-864b-e00bfc9699f9
d8637f2f-e6d8-4a8a-b647-68c487eecd06	25db9c19-f84e-40d8-9dfb-ee94478ca40a
d8637f2f-e6d8-4a8a-b647-68c487eecd06	600ccd3a-a513-4a4a-864b-e00bfc9699f9
78221c97-282c-40f1-a65a-21522e819307	25db9c19-f84e-40d8-9dfb-ee94478ca40a
78221c97-282c-40f1-a65a-21522e819307	600ccd3a-a513-4a4a-864b-e00bfc9699f9
a666d87d-e793-42da-bbda-6305da5851e6	82f57a9f-6615-4527-816f-31ee7a0b7c98
a666d87d-e793-42da-bbda-6305da5851e6	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
8a5afa50-4bb2-4820-89ee-5f3c51f0a65c	82f57a9f-6615-4527-816f-31ee7a0b7c98
8a5afa50-4bb2-4820-89ee-5f3c51f0a65c	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
c761769d-faa6-4e2d-8e90-cffde5b87084	82f57a9f-6615-4527-816f-31ee7a0b7c98
c761769d-faa6-4e2d-8e90-cffde5b87084	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
5398f1f3-c8c2-4d39-b1d2-b981c57f732a	82f57a9f-6615-4527-816f-31ee7a0b7c98
5398f1f3-c8c2-4d39-b1d2-b981c57f732a	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
282e0cf6-ba9f-48b9-af3f-e2441779a201	82f57a9f-6615-4527-816f-31ee7a0b7c98
282e0cf6-ba9f-48b9-af3f-e2441779a201	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
62bf892c-50fd-4588-8689-457b43cc086f	f30de478-b560-47f5-8588-8062ffc64a25
62bf892c-50fd-4588-8689-457b43cc086f	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
62bf892c-50fd-4588-8689-457b43cc086f	ee140dfb-14f6-41d3-b2b0-4e50764290d7
62bf892c-50fd-4588-8689-457b43cc086f	25db9c19-f84e-40d8-9dfb-ee94478ca40a
62bf892c-50fd-4588-8689-457b43cc086f	600ccd3a-a513-4a4a-864b-e00bfc9699f9
62bf892c-50fd-4588-8689-457b43cc086f	82f57a9f-6615-4527-816f-31ee7a0b7c98
62bf892c-50fd-4588-8689-457b43cc086f	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
62bf892c-50fd-4588-8689-457b43cc086f	ca652ee1-1423-42fe-a0ef-e5761a670845
66b1e85b-fa20-4fa6-8b28-fe963d3688f4	f30de478-b560-47f5-8588-8062ffc64a25
66b1e85b-fa20-4fa6-8b28-fe963d3688f4	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
66b1e85b-fa20-4fa6-8b28-fe963d3688f4	ee140dfb-14f6-41d3-b2b0-4e50764290d7
66b1e85b-fa20-4fa6-8b28-fe963d3688f4	25db9c19-f84e-40d8-9dfb-ee94478ca40a
66b1e85b-fa20-4fa6-8b28-fe963d3688f4	600ccd3a-a513-4a4a-864b-e00bfc9699f9
66b1e85b-fa20-4fa6-8b28-fe963d3688f4	82f57a9f-6615-4527-816f-31ee7a0b7c98
66b1e85b-fa20-4fa6-8b28-fe963d3688f4	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
66b1e85b-fa20-4fa6-8b28-fe963d3688f4	ca652ee1-1423-42fe-a0ef-e5761a670845
2c680d67-2082-4bde-b507-4ae76898c0e4	f30de478-b560-47f5-8588-8062ffc64a25
2c680d67-2082-4bde-b507-4ae76898c0e4	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
2c680d67-2082-4bde-b507-4ae76898c0e4	ee140dfb-14f6-41d3-b2b0-4e50764290d7
2c680d67-2082-4bde-b507-4ae76898c0e4	25db9c19-f84e-40d8-9dfb-ee94478ca40a
2c680d67-2082-4bde-b507-4ae76898c0e4	600ccd3a-a513-4a4a-864b-e00bfc9699f9
2c680d67-2082-4bde-b507-4ae76898c0e4	82f57a9f-6615-4527-816f-31ee7a0b7c98
2c680d67-2082-4bde-b507-4ae76898c0e4	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
2c680d67-2082-4bde-b507-4ae76898c0e4	ca652ee1-1423-42fe-a0ef-e5761a670845
5a546add-1b24-4216-8a78-e8f0fe03eef3	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
5a546add-1b24-4216-8a78-e8f0fe03eef3	600ccd3a-a513-4a4a-864b-e00bfc9699f9
5a546add-1b24-4216-8a78-e8f0fe03eef3	82f57a9f-6615-4527-816f-31ee7a0b7c98
452413c4-3e20-4c8a-be25-fda44428c9a0	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
452413c4-3e20-4c8a-be25-fda44428c9a0	600ccd3a-a513-4a4a-864b-e00bfc9699f9
452413c4-3e20-4c8a-be25-fda44428c9a0	82f57a9f-6615-4527-816f-31ee7a0b7c98
368d5a03-d0f1-4af7-9ce4-dc55cb7571a3	7879f271-4036-48be-befb-f08de052bcdc
368d5a03-d0f1-4af7-9ce4-dc55cb7571a3	7a90bccb-346e-4933-aaeb-cdef732be976
368d5a03-d0f1-4af7-9ce4-dc55cb7571a3	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
368d5a03-d0f1-4af7-9ce4-dc55cb7571a3	ca652ee1-1423-42fe-a0ef-e5761a670845
368d5a03-d0f1-4af7-9ce4-dc55cb7571a3	ee140dfb-14f6-41d3-b2b0-4e50764290d7
fd31d5d0-5e34-494a-9d25-26a77f0019a8	25db9c19-f84e-40d8-9dfb-ee94478ca40a
6c8e4917-369e-4665-aefb-0ff9e808c0f2	25db9c19-f84e-40d8-9dfb-ee94478ca40a
62890a70-c900-42b0-b16b-bacc42a7a036	f30de478-b560-47f5-8588-8062ffc64a25
62890a70-c900-42b0-b16b-bacc42a7a036	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
62890a70-c900-42b0-b16b-bacc42a7a036	ee140dfb-14f6-41d3-b2b0-4e50764290d7
62890a70-c900-42b0-b16b-bacc42a7a036	25db9c19-f84e-40d8-9dfb-ee94478ca40a
62890a70-c900-42b0-b16b-bacc42a7a036	600ccd3a-a513-4a4a-864b-e00bfc9699f9
62890a70-c900-42b0-b16b-bacc42a7a036	82f57a9f-6615-4527-816f-31ee7a0b7c98
62890a70-c900-42b0-b16b-bacc42a7a036	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
62890a70-c900-42b0-b16b-bacc42a7a036	ca652ee1-1423-42fe-a0ef-e5761a670845
ae383f79-5f57-418a-a547-dc50269da698	25db9c19-f84e-40d8-9dfb-ee94478ca40a
ae383f79-5f57-418a-a547-dc50269da698	600ccd3a-a513-4a4a-864b-e00bfc9699f9
ae383f79-5f57-418a-a547-dc50269da698	f30de478-b560-47f5-8588-8062ffc64a25
335d4e03-91e8-4c83-b3c4-29289dd7d04f	25db9c19-f84e-40d8-9dfb-ee94478ca40a
335d4e03-91e8-4c83-b3c4-29289dd7d04f	600ccd3a-a513-4a4a-864b-e00bfc9699f9
335d4e03-91e8-4c83-b3c4-29289dd7d04f	f30de478-b560-47f5-8588-8062ffc64a25
a71bf8c3-a302-483d-8877-bf1f6c1f15b4	f30de478-b560-47f5-8588-8062ffc64a25
a71bf8c3-a302-483d-8877-bf1f6c1f15b4	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
a71bf8c3-a302-483d-8877-bf1f6c1f15b4	ee140dfb-14f6-41d3-b2b0-4e50764290d7
a71bf8c3-a302-483d-8877-bf1f6c1f15b4	25db9c19-f84e-40d8-9dfb-ee94478ca40a
a71bf8c3-a302-483d-8877-bf1f6c1f15b4	600ccd3a-a513-4a4a-864b-e00bfc9699f9
a71bf8c3-a302-483d-8877-bf1f6c1f15b4	82f57a9f-6615-4527-816f-31ee7a0b7c98
a71bf8c3-a302-483d-8877-bf1f6c1f15b4	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
a71bf8c3-a302-483d-8877-bf1f6c1f15b4	ca652ee1-1423-42fe-a0ef-e5761a670845
31ab13dd-4581-4532-9a7f-ae7be2c069f8	f30de478-b560-47f5-8588-8062ffc64a25
31ab13dd-4581-4532-9a7f-ae7be2c069f8	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
31ab13dd-4581-4532-9a7f-ae7be2c069f8	ee140dfb-14f6-41d3-b2b0-4e50764290d7
31ab13dd-4581-4532-9a7f-ae7be2c069f8	25db9c19-f84e-40d8-9dfb-ee94478ca40a
31ab13dd-4581-4532-9a7f-ae7be2c069f8	600ccd3a-a513-4a4a-864b-e00bfc9699f9
31ab13dd-4581-4532-9a7f-ae7be2c069f8	82f57a9f-6615-4527-816f-31ee7a0b7c98
31ab13dd-4581-4532-9a7f-ae7be2c069f8	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
31ab13dd-4581-4532-9a7f-ae7be2c069f8	ca652ee1-1423-42fe-a0ef-e5761a670845
7b0667e5-2d99-454f-95d2-4a1e71e306e3	f30de478-b560-47f5-8588-8062ffc64a25
7b0667e5-2d99-454f-95d2-4a1e71e306e3	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
7b0667e5-2d99-454f-95d2-4a1e71e306e3	ee140dfb-14f6-41d3-b2b0-4e50764290d7
7b0667e5-2d99-454f-95d2-4a1e71e306e3	25db9c19-f84e-40d8-9dfb-ee94478ca40a
7b0667e5-2d99-454f-95d2-4a1e71e306e3	600ccd3a-a513-4a4a-864b-e00bfc9699f9
7b0667e5-2d99-454f-95d2-4a1e71e306e3	82f57a9f-6615-4527-816f-31ee7a0b7c98
7b0667e5-2d99-454f-95d2-4a1e71e306e3	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
7b0667e5-2d99-454f-95d2-4a1e71e306e3	ca652ee1-1423-42fe-a0ef-e5761a670845
c5c343fd-1570-4bfa-a17e-5bc707d8f07a	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
8739fd8a-5a75-4c10-a573-12b1053df648	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
075df733-01b0-4e48-8953-f655868990b1	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
6bdaa572-6d23-417d-8197-fa0872ab8ba5	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
82924aaa-5223-4dd1-bbce-65b1f7dd1f37	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
82924aaa-5223-4dd1-bbce-65b1f7dd1f37	600ccd3a-a513-4a4a-864b-e00bfc9699f9
82924aaa-5223-4dd1-bbce-65b1f7dd1f37	25db9c19-f84e-40d8-9dfb-ee94478ca40a
82924aaa-5223-4dd1-bbce-65b1f7dd1f37	82f57a9f-6615-4527-816f-31ee7a0b7c98
669cc355-0269-491a-8573-80f7dddb9223	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
669cc355-0269-491a-8573-80f7dddb9223	600ccd3a-a513-4a4a-864b-e00bfc9699f9
669cc355-0269-491a-8573-80f7dddb9223	82f57a9f-6615-4527-816f-31ee7a0b7c98
dd805776-a22f-4897-891a-46ebc6fb4725	f30de478-b560-47f5-8588-8062ffc64a25
dd805776-a22f-4897-891a-46ebc6fb4725	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
dd805776-a22f-4897-891a-46ebc6fb4725	600ccd3a-a513-4a4a-864b-e00bfc9699f9
dd805776-a22f-4897-891a-46ebc6fb4725	25db9c19-f84e-40d8-9dfb-ee94478ca40a
5c601a00-3bdd-4601-836c-dc9a4d9eff3d	f30de478-b560-47f5-8588-8062ffc64a25
5c601a00-3bdd-4601-836c-dc9a4d9eff3d	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
5c601a00-3bdd-4601-836c-dc9a4d9eff3d	600ccd3a-a513-4a4a-864b-e00bfc9699f9
5c601a00-3bdd-4601-836c-dc9a4d9eff3d	25db9c19-f84e-40d8-9dfb-ee94478ca40a
8e7acfee-cfe9-4ec0-a9b8-14aae24e0fa9	f30de478-b560-47f5-8588-8062ffc64a25
8e7acfee-cfe9-4ec0-a9b8-14aae24e0fa9	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
8e7acfee-cfe9-4ec0-a9b8-14aae24e0fa9	600ccd3a-a513-4a4a-864b-e00bfc9699f9
8e7acfee-cfe9-4ec0-a9b8-14aae24e0fa9	25db9c19-f84e-40d8-9dfb-ee94478ca40a
d891bc22-94e7-42b1-96af-b30f2a5efe2c	25db9c19-f84e-40d8-9dfb-ee94478ca40a
a73e3d2e-2e84-4b85-8ade-7d8446010c86	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
a73e3d2e-2e84-4b85-8ade-7d8446010c86	ca652ee1-1423-42fe-a0ef-e5761a670845
a73e3d2e-2e84-4b85-8ade-7d8446010c86	ee140dfb-14f6-41d3-b2b0-4e50764290d7
897e3352-a959-4262-aae9-ab4a3add9af7	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
897e3352-a959-4262-aae9-ab4a3add9af7	25db9c19-f84e-40d8-9dfb-ee94478ca40a
897e3352-a959-4262-aae9-ab4a3add9af7	600ccd3a-a513-4a4a-864b-e00bfc9699f9
a6edd11a-4374-4def-9f96-c3a02e5ed882	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
a6edd11a-4374-4def-9f96-c3a02e5ed882	25db9c19-f84e-40d8-9dfb-ee94478ca40a
a6edd11a-4374-4def-9f96-c3a02e5ed882	600ccd3a-a513-4a4a-864b-e00bfc9699f9
3e976040-4c13-4c7d-853c-884d6788db1a	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
3e976040-4c13-4c7d-853c-884d6788db1a	25db9c19-f84e-40d8-9dfb-ee94478ca40a
3e976040-4c13-4c7d-853c-884d6788db1a	600ccd3a-a513-4a4a-864b-e00bfc9699f9
fb058431-a63e-42a5-bd84-7de87c21427a	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
fb058431-a63e-42a5-bd84-7de87c21427a	ee140dfb-14f6-41d3-b2b0-4e50764290d7
fb058431-a63e-42a5-bd84-7de87c21427a	25db9c19-f84e-40d8-9dfb-ee94478ca40a
fb058431-a63e-42a5-bd84-7de87c21427a	600ccd3a-a513-4a4a-864b-e00bfc9699f9
6e435fa3-e3f1-48e1-a493-dde16cce43a6	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
6e435fa3-e3f1-48e1-a493-dde16cce43a6	ee140dfb-14f6-41d3-b2b0-4e50764290d7
6e435fa3-e3f1-48e1-a493-dde16cce43a6	25db9c19-f84e-40d8-9dfb-ee94478ca40a
6e435fa3-e3f1-48e1-a493-dde16cce43a6	600ccd3a-a513-4a4a-864b-e00bfc9699f9
dfbdedcf-3646-4ff7-b094-25cb7c630c24	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
dfbdedcf-3646-4ff7-b094-25cb7c630c24	ee140dfb-14f6-41d3-b2b0-4e50764290d7
dfbdedcf-3646-4ff7-b094-25cb7c630c24	25db9c19-f84e-40d8-9dfb-ee94478ca40a
dfbdedcf-3646-4ff7-b094-25cb7c630c24	600ccd3a-a513-4a4a-864b-e00bfc9699f9
e1ae4e58-c24a-4cfd-bb67-db0ebe7a2fc9	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
e1ae4e58-c24a-4cfd-bb67-db0ebe7a2fc9	ee140dfb-14f6-41d3-b2b0-4e50764290d7
e1ae4e58-c24a-4cfd-bb67-db0ebe7a2fc9	25db9c19-f84e-40d8-9dfb-ee94478ca40a
e1ae4e58-c24a-4cfd-bb67-db0ebe7a2fc9	600ccd3a-a513-4a4a-864b-e00bfc9699f9
164ebb7f-0c05-45d1-a74a-09d46248d2bf	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
164ebb7f-0c05-45d1-a74a-09d46248d2bf	ee140dfb-14f6-41d3-b2b0-4e50764290d7
164ebb7f-0c05-45d1-a74a-09d46248d2bf	25db9c19-f84e-40d8-9dfb-ee94478ca40a
164ebb7f-0c05-45d1-a74a-09d46248d2bf	600ccd3a-a513-4a4a-864b-e00bfc9699f9
60974c19-638b-4345-81f8-ec7195b3be09	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
60974c19-638b-4345-81f8-ec7195b3be09	600ccd3a-a513-4a4a-864b-e00bfc9699f9
60974c19-638b-4345-81f8-ec7195b3be09	25db9c19-f84e-40d8-9dfb-ee94478ca40a
60974c19-638b-4345-81f8-ec7195b3be09	82f57a9f-6615-4527-816f-31ee7a0b7c98
d1652c94-3a20-405b-b578-4da26650989f	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
d1652c94-3a20-405b-b578-4da26650989f	ee140dfb-14f6-41d3-b2b0-4e50764290d7
d1652c94-3a20-405b-b578-4da26650989f	25db9c19-f84e-40d8-9dfb-ee94478ca40a
d1652c94-3a20-405b-b578-4da26650989f	600ccd3a-a513-4a4a-864b-e00bfc9699f9
d1652c94-3a20-405b-b578-4da26650989f	7a90bccb-346e-4933-aaeb-cdef732be976
d1652c94-3a20-405b-b578-4da26650989f	82f57a9f-6615-4527-816f-31ee7a0b7c98
d1652c94-3a20-405b-b578-4da26650989f	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
d1652c94-3a20-405b-b578-4da26650989f	f30de478-b560-47f5-8588-8062ffc64a25
d1652c94-3a20-405b-b578-4da26650989f	ca652ee1-1423-42fe-a0ef-e5761a670845
50b7fdb5-5067-4cb4-a178-121e4e61cd43	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
50b7fdb5-5067-4cb4-a178-121e4e61cd43	ee140dfb-14f6-41d3-b2b0-4e50764290d7
50b7fdb5-5067-4cb4-a178-121e4e61cd43	25db9c19-f84e-40d8-9dfb-ee94478ca40a
50b7fdb5-5067-4cb4-a178-121e4e61cd43	600ccd3a-a513-4a4a-864b-e00bfc9699f9
50b7fdb5-5067-4cb4-a178-121e4e61cd43	7a90bccb-346e-4933-aaeb-cdef732be976
50b7fdb5-5067-4cb4-a178-121e4e61cd43	82f57a9f-6615-4527-816f-31ee7a0b7c98
50b7fdb5-5067-4cb4-a178-121e4e61cd43	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
50b7fdb5-5067-4cb4-a178-121e4e61cd43	f30de478-b560-47f5-8588-8062ffc64a25
50b7fdb5-5067-4cb4-a178-121e4e61cd43	ca652ee1-1423-42fe-a0ef-e5761a670845
df6b6e91-9e9d-4f59-aa10-58ba5b25f9e0	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
df6b6e91-9e9d-4f59-aa10-58ba5b25f9e0	ee140dfb-14f6-41d3-b2b0-4e50764290d7
df6b6e91-9e9d-4f59-aa10-58ba5b25f9e0	25db9c19-f84e-40d8-9dfb-ee94478ca40a
df6b6e91-9e9d-4f59-aa10-58ba5b25f9e0	600ccd3a-a513-4a4a-864b-e00bfc9699f9
df6b6e91-9e9d-4f59-aa10-58ba5b25f9e0	7a90bccb-346e-4933-aaeb-cdef732be976
df6b6e91-9e9d-4f59-aa10-58ba5b25f9e0	82f57a9f-6615-4527-816f-31ee7a0b7c98
df6b6e91-9e9d-4f59-aa10-58ba5b25f9e0	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
df6b6e91-9e9d-4f59-aa10-58ba5b25f9e0	f30de478-b560-47f5-8588-8062ffc64a25
df6b6e91-9e9d-4f59-aa10-58ba5b25f9e0	ca652ee1-1423-42fe-a0ef-e5761a670845
84d076a1-b88b-4232-8fe4-755f25411d9d	25db9c19-f84e-40d8-9dfb-ee94478ca40a
84d076a1-b88b-4232-8fe4-755f25411d9d	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
84d076a1-b88b-4232-8fe4-755f25411d9d	600ccd3a-a513-4a4a-864b-e00bfc9699f9
1f1026c2-5246-4788-8f67-933e06dffd7e	82f57a9f-6615-4527-816f-31ee7a0b7c98
1f1026c2-5246-4788-8f67-933e06dffd7e	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
1f1026c2-5246-4788-8f67-933e06dffd7e	600ccd3a-a513-4a4a-864b-e00bfc9699f9
84ae1cf9-da5c-49f5-aa64-bdf5796cf16b	ee140dfb-14f6-41d3-b2b0-4e50764290d7
84ae1cf9-da5c-49f5-aa64-bdf5796cf16b	ca652ee1-1423-42fe-a0ef-e5761a670845
84ae1cf9-da5c-49f5-aa64-bdf5796cf16b	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
8ac1179f-d0ae-4c76-8a3f-ffce22b68723	82f57a9f-6615-4527-816f-31ee7a0b7c98
8ac1179f-d0ae-4c76-8a3f-ffce22b68723	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
8ac1179f-d0ae-4c76-8a3f-ffce22b68723	600ccd3a-a513-4a4a-864b-e00bfc9699f9
8ac1179f-d0ae-4c76-8a3f-ffce22b68723	25db9c19-f84e-40d8-9dfb-ee94478ca40a
72158001-ba0e-426d-9636-d09bf63efe9d	25db9c19-f84e-40d8-9dfb-ee94478ca40a
72158001-ba0e-426d-9636-d09bf63efe9d	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
72158001-ba0e-426d-9636-d09bf63efe9d	600ccd3a-a513-4a4a-864b-e00bfc9699f9
235faf89-59ed-4520-8957-38fbd49e2490	ee140dfb-14f6-41d3-b2b0-4e50764290d7
235faf89-59ed-4520-8957-38fbd49e2490	7a90bccb-346e-4933-aaeb-cdef732be976
235faf89-59ed-4520-8957-38fbd49e2490	ca652ee1-1423-42fe-a0ef-e5761a670845
235faf89-59ed-4520-8957-38fbd49e2490	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
bb3e81c0-88ed-4458-8d03-8770ea1a5ec1	82f57a9f-6615-4527-816f-31ee7a0b7c98
bb3e81c0-88ed-4458-8d03-8770ea1a5ec1	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
bb3e81c0-88ed-4458-8d03-8770ea1a5ec1	600ccd3a-a513-4a4a-864b-e00bfc9699f9
bb3e81c0-88ed-4458-8d03-8770ea1a5ec1	25db9c19-f84e-40d8-9dfb-ee94478ca40a
f159d13d-55aa-42eb-8653-89486d8ba839	25db9c19-f84e-40d8-9dfb-ee94478ca40a
f159d13d-55aa-42eb-8653-89486d8ba839	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
f159d13d-55aa-42eb-8653-89486d8ba839	600ccd3a-a513-4a4a-864b-e00bfc9699f9
c09f5001-8876-40ac-bfb5-7468d65edfc2	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
c09f5001-8876-40ac-bfb5-7468d65edfc2	ee140dfb-14f6-41d3-b2b0-4e50764290d7
c09f5001-8876-40ac-bfb5-7468d65edfc2	25db9c19-f84e-40d8-9dfb-ee94478ca40a
c09f5001-8876-40ac-bfb5-7468d65edfc2	600ccd3a-a513-4a4a-864b-e00bfc9699f9
c09f5001-8876-40ac-bfb5-7468d65edfc2	7a90bccb-346e-4933-aaeb-cdef732be976
c09f5001-8876-40ac-bfb5-7468d65edfc2	82f57a9f-6615-4527-816f-31ee7a0b7c98
c09f5001-8876-40ac-bfb5-7468d65edfc2	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
c09f5001-8876-40ac-bfb5-7468d65edfc2	f30de478-b560-47f5-8588-8062ffc64a25
c09f5001-8876-40ac-bfb5-7468d65edfc2	ca652ee1-1423-42fe-a0ef-e5761a670845
b9b3f5f8-35a9-40cf-aed4-6f7cde6a2e37	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
b9b3f5f8-35a9-40cf-aed4-6f7cde6a2e37	ca652ee1-1423-42fe-a0ef-e5761a670845
b9b3f5f8-35a9-40cf-aed4-6f7cde6a2e37	ee140dfb-14f6-41d3-b2b0-4e50764290d7
b9b3f5f8-35a9-40cf-aed4-6f7cde6a2e37	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
b9b3f5f8-35a9-40cf-aed4-6f7cde6a2e37	7a90bccb-346e-4933-aaeb-cdef732be976
b9b3f5f8-35a9-40cf-aed4-6f7cde6a2e37	82f57a9f-6615-4527-816f-31ee7a0b7c98
69b94728-fc60-46c6-b9cb-d6485e622725	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
69b94728-fc60-46c6-b9cb-d6485e622725	ca652ee1-1423-42fe-a0ef-e5761a670845
69b94728-fc60-46c6-b9cb-d6485e622725	ee140dfb-14f6-41d3-b2b0-4e50764290d7
69b94728-fc60-46c6-b9cb-d6485e622725	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
69b94728-fc60-46c6-b9cb-d6485e622725	7a90bccb-346e-4933-aaeb-cdef732be976
69b94728-fc60-46c6-b9cb-d6485e622725	82f57a9f-6615-4527-816f-31ee7a0b7c98
a76e9cee-f598-4b10-a3bf-28de9b5f315e	25db9c19-f84e-40d8-9dfb-ee94478ca40a
a76e9cee-f598-4b10-a3bf-28de9b5f315e	600ccd3a-a513-4a4a-864b-e00bfc9699f9
a76e9cee-f598-4b10-a3bf-28de9b5f315e	7a90bccb-346e-4933-aaeb-cdef732be976
a76e9cee-f598-4b10-a3bf-28de9b5f315e	82f57a9f-6615-4527-816f-31ee7a0b7c98
fc45c751-19c6-421e-96e9-a0fe01874f37	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
fc45c751-19c6-421e-96e9-a0fe01874f37	ca652ee1-1423-42fe-a0ef-e5761a670845
fc45c751-19c6-421e-96e9-a0fe01874f37	ee140dfb-14f6-41d3-b2b0-4e50764290d7
fc45c751-19c6-421e-96e9-a0fe01874f37	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
fc45c751-19c6-421e-96e9-a0fe01874f37	7a90bccb-346e-4933-aaeb-cdef732be976
fc45c751-19c6-421e-96e9-a0fe01874f37	82f57a9f-6615-4527-816f-31ee7a0b7c98
a76e9cee-f598-4b10-a3bf-28de9b5f315e	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
50cc22f8-e1b5-4e97-b005-57794768edae	ca652ee1-1423-42fe-a0ef-e5761a670845
a76e9cee-f598-4b10-a3bf-28de9b5f315e	f30de478-b560-47f5-8588-8062ffc64a25
a76e9cee-f598-4b10-a3bf-28de9b5f315e	ca652ee1-1423-42fe-a0ef-e5761a670845
ef11cb56-4eff-45f3-a347-702a914cb9f1	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
ef11cb56-4eff-45f3-a347-702a914cb9f1	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
ef11cb56-4eff-45f3-a347-702a914cb9f1	600ccd3a-a513-4a4a-864b-e00bfc9699f9
ef11cb56-4eff-45f3-a347-702a914cb9f1	25db9c19-f84e-40d8-9dfb-ee94478ca40a
106b166b-b521-4776-bc32-4ec500ee7cd2	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
69e20f79-d685-4bf8-b21a-73dbbef108e2	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
9a0b5d33-e7ca-4a14-b693-44e988d4cc68	ee140dfb-14f6-41d3-b2b0-4e50764290d7
9a0b5d33-e7ca-4a14-b693-44e988d4cc68	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
9a0b5d33-e7ca-4a14-b693-44e988d4cc68	ca652ee1-1423-42fe-a0ef-e5761a670845
9a0b5d33-e7ca-4a14-b693-44e988d4cc68	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
6a3cae7c-a380-4fc7-beb5-5660e516d8f6	600ccd3a-a513-4a4a-864b-e00bfc9699f9
d346172f-a1b2-48f4-b1e1-ea65bfbfaa6c	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
950ad578-3e05-4e73-aed4-25a21b5393ac	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
dced53b7-5ea8-453b-b0d2-8b1aa88e87fd	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
fcc42886-7ae4-4f92-b31a-a90d0df23f6d	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
fcc42886-7ae4-4f92-b31a-a90d0df23f6d	600ccd3a-a513-4a4a-864b-e00bfc9699f9
fcc42886-7ae4-4f92-b31a-a90d0df23f6d	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
aee59dba-2ead-47b1-8d38-334fef5ebade	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
63a7e4fb-03c6-4a8b-9581-063725d3faa5	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
d3b9a5c5-04dd-4875-8440-b5726b3bb231	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
7968122e-e49e-4d59-b1e7-d4e128824615	ca652ee1-1423-42fe-a0ef-e5761a670845
7968122e-e49e-4d59-b1e7-d4e128824615	ee140dfb-14f6-41d3-b2b0-4e50764290d7
7968122e-e49e-4d59-b1e7-d4e128824615	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
7968122e-e49e-4d59-b1e7-d4e128824615	7a90bccb-346e-4933-aaeb-cdef732be976
7968122e-e49e-4d59-b1e7-d4e128824615	82f57a9f-6615-4527-816f-31ee7a0b7c98
7968122e-e49e-4d59-b1e7-d4e128824615	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
560f0651-59d7-4641-ab99-24776dceddc6	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
560f0651-59d7-4641-ab99-24776dceddc6	600ccd3a-a513-4a4a-864b-e00bfc9699f9
560f0651-59d7-4641-ab99-24776dceddc6	25db9c19-f84e-40d8-9dfb-ee94478ca40a
560f0651-59d7-4641-ab99-24776dceddc6	82f57a9f-6615-4527-816f-31ee7a0b7c98
ec23d178-0a3a-4eaf-b2de-ef36bf46c235	ca652ee1-1423-42fe-a0ef-e5761a670845
ec23d178-0a3a-4eaf-b2de-ef36bf46c235	ee140dfb-14f6-41d3-b2b0-4e50764290d7
ec23d178-0a3a-4eaf-b2de-ef36bf46c235	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
ec23d178-0a3a-4eaf-b2de-ef36bf46c235	7a90bccb-346e-4933-aaeb-cdef732be976
ec23d178-0a3a-4eaf-b2de-ef36bf46c235	82f57a9f-6615-4527-816f-31ee7a0b7c98
ec23d178-0a3a-4eaf-b2de-ef36bf46c235	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
c1c1d528-b74c-4847-8938-df9771bd02c1	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
c1c1d528-b74c-4847-8938-df9771bd02c1	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
1d0464b7-8b84-4731-bb53-37c247f2b179	ca652ee1-1423-42fe-a0ef-e5761a670845
1d0464b7-8b84-4731-bb53-37c247f2b179	ee140dfb-14f6-41d3-b2b0-4e50764290d7
1d0464b7-8b84-4731-bb53-37c247f2b179	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
1d0464b7-8b84-4731-bb53-37c247f2b179	7a90bccb-346e-4933-aaeb-cdef732be976
1d0464b7-8b84-4731-bb53-37c247f2b179	82f57a9f-6615-4527-816f-31ee7a0b7c98
1d0464b7-8b84-4731-bb53-37c247f2b179	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
454b94ed-7e72-4a9e-b221-efc9aad86483	25db9c19-f84e-40d8-9dfb-ee94478ca40a
454b94ed-7e72-4a9e-b221-efc9aad86483	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
454b94ed-7e72-4a9e-b221-efc9aad86483	600ccd3a-a513-4a4a-864b-e00bfc9699f9
c1c1d528-b74c-4847-8938-df9771bd02c1	600ccd3a-a513-4a4a-864b-e00bfc9699f9
c1c1d528-b74c-4847-8938-df9771bd02c1	25db9c19-f84e-40d8-9dfb-ee94478ca40a
f49a2562-3073-4a5a-8c77-c2e7a514b63f	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
f49a2562-3073-4a5a-8c77-c2e7a514b63f	ee140dfb-14f6-41d3-b2b0-4e50764290d7
f49a2562-3073-4a5a-8c77-c2e7a514b63f	25db9c19-f84e-40d8-9dfb-ee94478ca40a
f49a2562-3073-4a5a-8c77-c2e7a514b63f	600ccd3a-a513-4a4a-864b-e00bfc9699f9
f49a2562-3073-4a5a-8c77-c2e7a514b63f	7a90bccb-346e-4933-aaeb-cdef732be976
f49a2562-3073-4a5a-8c77-c2e7a514b63f	82f57a9f-6615-4527-816f-31ee7a0b7c98
f49a2562-3073-4a5a-8c77-c2e7a514b63f	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
f49a2562-3073-4a5a-8c77-c2e7a514b63f	f30de478-b560-47f5-8588-8062ffc64a25
f49a2562-3073-4a5a-8c77-c2e7a514b63f	ca652ee1-1423-42fe-a0ef-e5761a670845
12a4253d-c1aa-4858-a8cd-b5c0ef17d220	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
12a4253d-c1aa-4858-a8cd-b5c0ef17d220	ee140dfb-14f6-41d3-b2b0-4e50764290d7
12a4253d-c1aa-4858-a8cd-b5c0ef17d220	25db9c19-f84e-40d8-9dfb-ee94478ca40a
12a4253d-c1aa-4858-a8cd-b5c0ef17d220	600ccd3a-a513-4a4a-864b-e00bfc9699f9
12a4253d-c1aa-4858-a8cd-b5c0ef17d220	7a90bccb-346e-4933-aaeb-cdef732be976
12a4253d-c1aa-4858-a8cd-b5c0ef17d220	82f57a9f-6615-4527-816f-31ee7a0b7c98
12a4253d-c1aa-4858-a8cd-b5c0ef17d220	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
12a4253d-c1aa-4858-a8cd-b5c0ef17d220	f30de478-b560-47f5-8588-8062ffc64a25
12a4253d-c1aa-4858-a8cd-b5c0ef17d220	ca652ee1-1423-42fe-a0ef-e5761a670845
839b9f13-e9ff-49f2-9e11-932b03ed8d10	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
839b9f13-e9ff-49f2-9e11-932b03ed8d10	ee140dfb-14f6-41d3-b2b0-4e50764290d7
839b9f13-e9ff-49f2-9e11-932b03ed8d10	25db9c19-f84e-40d8-9dfb-ee94478ca40a
839b9f13-e9ff-49f2-9e11-932b03ed8d10	600ccd3a-a513-4a4a-864b-e00bfc9699f9
839b9f13-e9ff-49f2-9e11-932b03ed8d10	7a90bccb-346e-4933-aaeb-cdef732be976
839b9f13-e9ff-49f2-9e11-932b03ed8d10	82f57a9f-6615-4527-816f-31ee7a0b7c98
839b9f13-e9ff-49f2-9e11-932b03ed8d10	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
839b9f13-e9ff-49f2-9e11-932b03ed8d10	f30de478-b560-47f5-8588-8062ffc64a25
839b9f13-e9ff-49f2-9e11-932b03ed8d10	ca652ee1-1423-42fe-a0ef-e5761a670845
a7f00a6e-f036-4062-9798-f1a770405c0e	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
a7f00a6e-f036-4062-9798-f1a770405c0e	ee140dfb-14f6-41d3-b2b0-4e50764290d7
a7f00a6e-f036-4062-9798-f1a770405c0e	25db9c19-f84e-40d8-9dfb-ee94478ca40a
a7f00a6e-f036-4062-9798-f1a770405c0e	600ccd3a-a513-4a4a-864b-e00bfc9699f9
a7f00a6e-f036-4062-9798-f1a770405c0e	7a90bccb-346e-4933-aaeb-cdef732be976
a7f00a6e-f036-4062-9798-f1a770405c0e	82f57a9f-6615-4527-816f-31ee7a0b7c98
a7f00a6e-f036-4062-9798-f1a770405c0e	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
a7f00a6e-f036-4062-9798-f1a770405c0e	f30de478-b560-47f5-8588-8062ffc64a25
a7f00a6e-f036-4062-9798-f1a770405c0e	ca652ee1-1423-42fe-a0ef-e5761a670845
2d78f563-87d1-4771-9d03-befff5d76f31	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
2d78f563-87d1-4771-9d03-befff5d76f31	ee140dfb-14f6-41d3-b2b0-4e50764290d7
2d78f563-87d1-4771-9d03-befff5d76f31	25db9c19-f84e-40d8-9dfb-ee94478ca40a
2d78f563-87d1-4771-9d03-befff5d76f31	600ccd3a-a513-4a4a-864b-e00bfc9699f9
2d78f563-87d1-4771-9d03-befff5d76f31	7a90bccb-346e-4933-aaeb-cdef732be976
2d78f563-87d1-4771-9d03-befff5d76f31	82f57a9f-6615-4527-816f-31ee7a0b7c98
2d78f563-87d1-4771-9d03-befff5d76f31	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
2d78f563-87d1-4771-9d03-befff5d76f31	f30de478-b560-47f5-8588-8062ffc64a25
2d78f563-87d1-4771-9d03-befff5d76f31	ca652ee1-1423-42fe-a0ef-e5761a670845
6a19a95e-f371-4667-8b58-0cab5a2a7056	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
535c5640-82c2-44b9-950d-7555e86556f6	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
c97d1a8b-87ea-449a-8274-69dfcc683ddf	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
f49a2818-8800-4ab8-8906-c727153454f2	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
31e965a5-bd2e-4183-80cf-c92862e75123	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
34389740-7677-46f3-89d6-76ea52017019	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
34389740-7677-46f3-89d6-76ea52017019	ee140dfb-14f6-41d3-b2b0-4e50764290d7
34389740-7677-46f3-89d6-76ea52017019	25db9c19-f84e-40d8-9dfb-ee94478ca40a
34389740-7677-46f3-89d6-76ea52017019	600ccd3a-a513-4a4a-864b-e00bfc9699f9
34389740-7677-46f3-89d6-76ea52017019	7a90bccb-346e-4933-aaeb-cdef732be976
34389740-7677-46f3-89d6-76ea52017019	82f57a9f-6615-4527-816f-31ee7a0b7c98
34389740-7677-46f3-89d6-76ea52017019	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
34389740-7677-46f3-89d6-76ea52017019	f30de478-b560-47f5-8588-8062ffc64a25
34389740-7677-46f3-89d6-76ea52017019	ca652ee1-1423-42fe-a0ef-e5761a670845
5d4e1943-67b7-4d68-9baf-3fa7c1df599e	82f57a9f-6615-4527-816f-31ee7a0b7c98
5d4e1943-67b7-4d68-9baf-3fa7c1df599e	25db9c19-f84e-40d8-9dfb-ee94478ca40a
5d4e1943-67b7-4d68-9baf-3fa7c1df599e	600ccd3a-a513-4a4a-864b-e00bfc9699f9
60931661-0e2a-45d6-af0f-6c44d8d60f27	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
015141bb-8bc0-4bab-9771-9e0a13a9f0b2	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
437ef8f1-41b1-4504-828d-2fa1675c1401	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
490d13aa-ae0a-4573-a9c0-e794bb0677ea	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
39424537-869a-4c67-94fb-dc1bedd6460e	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
30337aa3-0269-42d8-9e6e-efac86a1db9e	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
30337aa3-0269-42d8-9e6e-efac86a1db9e	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
1ef10234-ceff-4c57-a295-facbed92592d	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
3fd39670-e573-4e14-9623-751ec185e073	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
30337aa3-0269-42d8-9e6e-efac86a1db9e	600ccd3a-a513-4a4a-864b-e00bfc9699f9
30337aa3-0269-42d8-9e6e-efac86a1db9e	25db9c19-f84e-40d8-9dfb-ee94478ca40a
62a36a3c-e335-4022-90ef-d3a5e3615d11	ca652ee1-1423-42fe-a0ef-e5761a670845
62a36a3c-e335-4022-90ef-d3a5e3615d11	ee140dfb-14f6-41d3-b2b0-4e50764290d7
62a36a3c-e335-4022-90ef-d3a5e3615d11	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
62a36a3c-e335-4022-90ef-d3a5e3615d11	7a90bccb-346e-4933-aaeb-cdef732be976
62a36a3c-e335-4022-90ef-d3a5e3615d11	82f57a9f-6615-4527-816f-31ee7a0b7c98
62a36a3c-e335-4022-90ef-d3a5e3615d11	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
df0bcc2f-0459-4b5a-af3f-6bf616b393f3	82f57a9f-6615-4527-816f-31ee7a0b7c98
df0bcc2f-0459-4b5a-af3f-6bf616b393f3	25db9c19-f84e-40d8-9dfb-ee94478ca40a
df0bcc2f-0459-4b5a-af3f-6bf616b393f3	600ccd3a-a513-4a4a-864b-e00bfc9699f9
df0bcc2f-0459-4b5a-af3f-6bf616b393f3	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
19eda0fd-71e8-49fd-9847-d2b9d8466527	82f57a9f-6615-4527-816f-31ee7a0b7c98
19eda0fd-71e8-49fd-9847-d2b9d8466527	25db9c19-f84e-40d8-9dfb-ee94478ca40a
19eda0fd-71e8-49fd-9847-d2b9d8466527	600ccd3a-a513-4a4a-864b-e00bfc9699f9
19eda0fd-71e8-49fd-9847-d2b9d8466527	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
fafc97b7-182c-4bd6-87ac-d444592c2c54	ca652ee1-1423-42fe-a0ef-e5761a670845
fafc97b7-182c-4bd6-87ac-d444592c2c54	ee140dfb-14f6-41d3-b2b0-4e50764290d7
fafc97b7-182c-4bd6-87ac-d444592c2c54	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
fafc97b7-182c-4bd6-87ac-d444592c2c54	7a90bccb-346e-4933-aaeb-cdef732be976
fafc97b7-182c-4bd6-87ac-d444592c2c54	82f57a9f-6615-4527-816f-31ee7a0b7c98
fafc97b7-182c-4bd6-87ac-d444592c2c54	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
52fba8d8-7964-4248-a182-c72798e80be5	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
d3b491f4-684e-4161-bc02-a8a2d8b096af	7a90bccb-346e-4933-aaeb-cdef732be976
d3b491f4-684e-4161-bc02-a8a2d8b096af	ca652ee1-1423-42fe-a0ef-e5761a670845
d3b491f4-684e-4161-bc02-a8a2d8b096af	ee140dfb-14f6-41d3-b2b0-4e50764290d7
d3b491f4-684e-4161-bc02-a8a2d8b096af	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
a61b79aa-6905-47ae-bbf8-4bd1df8ea21a	7a90bccb-346e-4933-aaeb-cdef732be976
a61b79aa-6905-47ae-bbf8-4bd1df8ea21a	ca652ee1-1423-42fe-a0ef-e5761a670845
a61b79aa-6905-47ae-bbf8-4bd1df8ea21a	ee140dfb-14f6-41d3-b2b0-4e50764290d7
a61b79aa-6905-47ae-bbf8-4bd1df8ea21a	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
85eb2862-060e-42da-b0bb-c70844c3e88d	7a90bccb-346e-4933-aaeb-cdef732be976
85eb2862-060e-42da-b0bb-c70844c3e88d	ca652ee1-1423-42fe-a0ef-e5761a670845
85eb2862-060e-42da-b0bb-c70844c3e88d	ee140dfb-14f6-41d3-b2b0-4e50764290d7
85eb2862-060e-42da-b0bb-c70844c3e88d	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
f22e69ce-7082-4cb9-a4ce-e6cf8e71d2fc	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
d1243295-e6ac-4da5-866f-582a9b419a4f	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
d1243295-e6ac-4da5-866f-582a9b419a4f	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
d1243295-e6ac-4da5-866f-582a9b419a4f	600ccd3a-a513-4a4a-864b-e00bfc9699f9
f22e69ce-7082-4cb9-a4ce-e6cf8e71d2fc	600ccd3a-a513-4a4a-864b-e00bfc9699f9
12aee6ec-e255-4446-b825-23a2dbdedcdd	ee140dfb-14f6-41d3-b2b0-4e50764290d7
12aee6ec-e255-4446-b825-23a2dbdedcdd	82f57a9f-6615-4527-816f-31ee7a0b7c98
12aee6ec-e255-4446-b825-23a2dbdedcdd	ca652ee1-1423-42fe-a0ef-e5761a670845
12aee6ec-e255-4446-b825-23a2dbdedcdd	f30de478-b560-47f5-8588-8062ffc64a25
12aee6ec-e255-4446-b825-23a2dbdedcdd	25db9c19-f84e-40d8-9dfb-ee94478ca40a
12aee6ec-e255-4446-b825-23a2dbdedcdd	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
12aee6ec-e255-4446-b825-23a2dbdedcdd	600ccd3a-a513-4a4a-864b-e00bfc9699f9
12aee6ec-e255-4446-b825-23a2dbdedcdd	7a90bccb-346e-4933-aaeb-cdef732be976
12aee6ec-e255-4446-b825-23a2dbdedcdd	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
80439d52-b5f8-40d3-af3f-7947802431a3	f30de478-b560-47f5-8588-8062ffc64a25
80439d52-b5f8-40d3-af3f-7947802431a3	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
80439d52-b5f8-40d3-af3f-7947802431a3	600ccd3a-a513-4a4a-864b-e00bfc9699f9
80439d52-b5f8-40d3-af3f-7947802431a3	25db9c19-f84e-40d8-9dfb-ee94478ca40a
f22e69ce-7082-4cb9-a4ce-e6cf8e71d2fc	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
c5707707-dbec-4b11-87e8-bf0f0cb6bbaa	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
c5707707-dbec-4b11-87e8-bf0f0cb6bbaa	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
c5707707-dbec-4b11-87e8-bf0f0cb6bbaa	600ccd3a-a513-4a4a-864b-e00bfc9699f9
d3a11bcb-6569-4772-a537-cf6f64388932	82f57a9f-6615-4527-816f-31ee7a0b7c98
d3a11bcb-6569-4772-a537-cf6f64388932	25db9c19-f84e-40d8-9dfb-ee94478ca40a
d3a11bcb-6569-4772-a537-cf6f64388932	600ccd3a-a513-4a4a-864b-e00bfc9699f9
d3a11bcb-6569-4772-a537-cf6f64388932	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
d3a11bcb-6569-4772-a537-cf6f64388932	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
940314a3-c49c-460c-ba31-7dd36450fd1c	600ccd3a-a513-4a4a-864b-e00bfc9699f9
940314a3-c49c-460c-ba31-7dd36450fd1c	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
940314a3-c49c-460c-ba31-7dd36450fd1c	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
d346172f-a1b2-48f4-b1e1-ea65bfbfaa6c	ca652ee1-1423-42fe-a0ef-e5761a670845
d346172f-a1b2-48f4-b1e1-ea65bfbfaa6c	ee140dfb-14f6-41d3-b2b0-4e50764290d7
d346172f-a1b2-48f4-b1e1-ea65bfbfaa6c	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
d346172f-a1b2-48f4-b1e1-ea65bfbfaa6c	7a90bccb-346e-4933-aaeb-cdef732be976
77a17631-b400-4aaf-a4cd-09091e8714b0	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
77a17631-b400-4aaf-a4cd-09091e8714b0	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
77a17631-b400-4aaf-a4cd-09091e8714b0	600ccd3a-a513-4a4a-864b-e00bfc9699f9
5c3e89c7-a099-49af-8c7a-54a70088d97a	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
5c3e89c7-a099-49af-8c7a-54a70088d97a	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
5c3e89c7-a099-49af-8c7a-54a70088d97a	600ccd3a-a513-4a4a-864b-e00bfc9699f9
d346172f-a1b2-48f4-b1e1-ea65bfbfaa6c	82f57a9f-6615-4527-816f-31ee7a0b7c98
16571812-9e72-46d0-8568-cf402abd1f5e	25db9c19-f84e-40d8-9dfb-ee94478ca40a
1596717f-6516-4270-9d63-36cdf11a3427	25db9c19-f84e-40d8-9dfb-ee94478ca40a
3339f5b6-bf9d-4e8c-a4b0-91a660ff93a5	25db9c19-f84e-40d8-9dfb-ee94478ca40a
7d4b2466-c340-4bb6-91d1-72f931cec5dc	25db9c19-f84e-40d8-9dfb-ee94478ca40a
7d4b2466-c340-4bb6-91d1-72f931cec5dc	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
7d4b2466-c340-4bb6-91d1-72f931cec5dc	600ccd3a-a513-4a4a-864b-e00bfc9699f9
25383b6c-859b-4656-8a24-da4d3110ec97	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
40464e44-d5df-48cb-b862-5a9b5d4ffa11	7879f271-4036-48be-befb-f08de052bcdc
40464e44-d5df-48cb-b862-5a9b5d4ffa11	7a90bccb-346e-4933-aaeb-cdef732be976
40464e44-d5df-48cb-b862-5a9b5d4ffa11	82f57a9f-6615-4527-816f-31ee7a0b7c98
40464e44-d5df-48cb-b862-5a9b5d4ffa11	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
40464e44-d5df-48cb-b862-5a9b5d4ffa11	ca652ee1-1423-42fe-a0ef-e5761a670845
40464e44-d5df-48cb-b862-5a9b5d4ffa11	ee140dfb-14f6-41d3-b2b0-4e50764290d7
40464e44-d5df-48cb-b862-5a9b5d4ffa11	f30de478-b560-47f5-8588-8062ffc64a25
b620880f-3182-471f-88ed-2726bcebf800	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
b620880f-3182-471f-88ed-2726bcebf800	ca652ee1-1423-42fe-a0ef-e5761a670845
b620880f-3182-471f-88ed-2726bcebf800	ee140dfb-14f6-41d3-b2b0-4e50764290d7
b620880f-3182-471f-88ed-2726bcebf800	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
b620880f-3182-471f-88ed-2726bcebf800	7879f271-4036-48be-befb-f08de052bcdc
b620880f-3182-471f-88ed-2726bcebf800	7a90bccb-346e-4933-aaeb-cdef732be976
b620880f-3182-471f-88ed-2726bcebf800	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
8b62b6ad-fe39-40aa-b8b5-44284657b286	ca652ee1-1423-42fe-a0ef-e5761a670845
8b62b6ad-fe39-40aa-b8b5-44284657b286	ee140dfb-14f6-41d3-b2b0-4e50764290d7
8b62b6ad-fe39-40aa-b8b5-44284657b286	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
8b62b6ad-fe39-40aa-b8b5-44284657b286	7a90bccb-346e-4933-aaeb-cdef732be976
8b62b6ad-fe39-40aa-b8b5-44284657b286	82f57a9f-6615-4527-816f-31ee7a0b7c98
8b62b6ad-fe39-40aa-b8b5-44284657b286	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
b7330847-fe0d-4446-83b1-a989f47a959e	ee140dfb-14f6-41d3-b2b0-4e50764290d7
b7330847-fe0d-4446-83b1-a989f47a959e	ca652ee1-1423-42fe-a0ef-e5761a670845
b7330847-fe0d-4446-83b1-a989f47a959e	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
b7330847-fe0d-4446-83b1-a989f47a959e	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
b7330847-fe0d-4446-83b1-a989f47a959e	7a90bccb-346e-4933-aaeb-cdef732be976
1f144355-4143-4f39-8331-d688eed9a1b8	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
1f144355-4143-4f39-8331-d688eed9a1b8	25db9c19-f84e-40d8-9dfb-ee94478ca40a
1f144355-4143-4f39-8331-d688eed9a1b8	600ccd3a-a513-4a4a-864b-e00bfc9699f9
1f144355-4143-4f39-8331-d688eed9a1b8	82f57a9f-6615-4527-816f-31ee7a0b7c98
1f144355-4143-4f39-8331-d688eed9a1b8	f30de478-b560-47f5-8588-8062ffc64a25
1f144355-4143-4f39-8331-d688eed9a1b8	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
1f144355-4143-4f39-8331-d688eed9a1b8	31f1de58-af98-4946-997c-622cb20d9504
1f144355-4143-4f39-8331-d688eed9a1b8	ee140dfb-14f6-41d3-b2b0-4e50764290d7
206b161d-acbf-4844-8946-2fa4981de272	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
206b161d-acbf-4844-8946-2fa4981de272	25db9c19-f84e-40d8-9dfb-ee94478ca40a
206b161d-acbf-4844-8946-2fa4981de272	600ccd3a-a513-4a4a-864b-e00bfc9699f9
206b161d-acbf-4844-8946-2fa4981de272	82f57a9f-6615-4527-816f-31ee7a0b7c98
206b161d-acbf-4844-8946-2fa4981de272	f30de478-b560-47f5-8588-8062ffc64a25
206b161d-acbf-4844-8946-2fa4981de272	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
206b161d-acbf-4844-8946-2fa4981de272	ee140dfb-14f6-41d3-b2b0-4e50764290d7
0558025b-be7f-429b-9736-4764a82933f0	ca652ee1-1423-42fe-a0ef-e5761a670845
0558025b-be7f-429b-9736-4764a82933f0	ee140dfb-14f6-41d3-b2b0-4e50764290d7
0558025b-be7f-429b-9736-4764a82933f0	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
0558025b-be7f-429b-9736-4764a82933f0	7a90bccb-346e-4933-aaeb-cdef732be976
0558025b-be7f-429b-9736-4764a82933f0	82f57a9f-6615-4527-816f-31ee7a0b7c98
0558025b-be7f-429b-9736-4764a82933f0	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
a7e76ba5-9d54-4d3b-be5d-f74e782c6903	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
a7e76ba5-9d54-4d3b-be5d-f74e782c6903	ca652ee1-1423-42fe-a0ef-e5761a670845
a7e76ba5-9d54-4d3b-be5d-f74e782c6903	ee140dfb-14f6-41d3-b2b0-4e50764290d7
a7e76ba5-9d54-4d3b-be5d-f74e782c6903	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
a7e76ba5-9d54-4d3b-be5d-f74e782c6903	7879f271-4036-48be-befb-f08de052bcdc
a7e76ba5-9d54-4d3b-be5d-f74e782c6903	7a90bccb-346e-4933-aaeb-cdef732be976
a7e76ba5-9d54-4d3b-be5d-f74e782c6903	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
d5e1da06-f141-4bff-8b38-d480bf6c0b80	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
d5e1da06-f141-4bff-8b38-d480bf6c0b80	ca652ee1-1423-42fe-a0ef-e5761a670845
d5e1da06-f141-4bff-8b38-d480bf6c0b80	ee140dfb-14f6-41d3-b2b0-4e50764290d7
d5e1da06-f141-4bff-8b38-d480bf6c0b80	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
d5e1da06-f141-4bff-8b38-d480bf6c0b80	7879f271-4036-48be-befb-f08de052bcdc
d5e1da06-f141-4bff-8b38-d480bf6c0b80	7a90bccb-346e-4933-aaeb-cdef732be976
d5e1da06-f141-4bff-8b38-d480bf6c0b80	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
dc512cc6-7ef4-489b-9187-45a8202156ad	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
dc512cc6-7ef4-489b-9187-45a8202156ad	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
dc512cc6-7ef4-489b-9187-45a8202156ad	600ccd3a-a513-4a4a-864b-e00bfc9699f9
dc512cc6-7ef4-489b-9187-45a8202156ad	25db9c19-f84e-40d8-9dfb-ee94478ca40a
dc512cc6-7ef4-489b-9187-45a8202156ad	7a90bccb-346e-4933-aaeb-cdef732be976
6f4d0bba-4553-4747-bd7b-0f91ab5617a2	600ccd3a-a513-4a4a-864b-e00bfc9699f9
6f4d0bba-4553-4747-bd7b-0f91ab5617a2	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
6f4d0bba-4553-4747-bd7b-0f91ab5617a2	7879f271-4036-48be-befb-f08de052bcdc
6f4d0bba-4553-4747-bd7b-0f91ab5617a2	7a90bccb-346e-4933-aaeb-cdef732be976
6f4d0bba-4553-4747-bd7b-0f91ab5617a2	82f57a9f-6615-4527-816f-31ee7a0b7c98
6f4d0bba-4553-4747-bd7b-0f91ab5617a2	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
6f4d0bba-4553-4747-bd7b-0f91ab5617a2	ca652ee1-1423-42fe-a0ef-e5761a670845
6f4d0bba-4553-4747-bd7b-0f91ab5617a2	ee140dfb-14f6-41d3-b2b0-4e50764290d7
6f4d0bba-4553-4747-bd7b-0f91ab5617a2	f30de478-b560-47f5-8588-8062ffc64a25
1b11054e-5c4d-4add-9e63-e72448846652	ca652ee1-1423-42fe-a0ef-e5761a670845
1b11054e-5c4d-4add-9e63-e72448846652	ee140dfb-14f6-41d3-b2b0-4e50764290d7
1b11054e-5c4d-4add-9e63-e72448846652	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
1b11054e-5c4d-4add-9e63-e72448846652	7a90bccb-346e-4933-aaeb-cdef732be976
87b6097f-6232-43f6-a3a8-0e1c3104212d	7879f271-4036-48be-befb-f08de052bcdc
527f10e5-ce40-4d9f-9db3-1eda40155817	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
e1e350f2-0a06-4d93-93f4-e5ff082a3888	600ccd3a-a513-4a4a-864b-e00bfc9699f9
e1e350f2-0a06-4d93-93f4-e5ff082a3888	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
e1e350f2-0a06-4d93-93f4-e5ff082a3888	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
534402d8-8489-44c8-baa4-eb1608ed0df9	ee140dfb-14f6-41d3-b2b0-4e50764290d7
534402d8-8489-44c8-baa4-eb1608ed0df9	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
534402d8-8489-44c8-baa4-eb1608ed0df9	ca652ee1-1423-42fe-a0ef-e5761a670845
534402d8-8489-44c8-baa4-eb1608ed0df9	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
534402d8-8489-44c8-baa4-eb1608ed0df9	7a90bccb-346e-4933-aaeb-cdef732be976
d109bee0-13f8-4a3f-9f99-c0c44b5c6ba8	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
958d55ae-37fd-4ed9-a467-6125dd188dc3	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
5a4c6026-1e3a-4a0e-9f6f-b8245067de7f	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
bae4482e-a3b5-4d4f-ac31-e744b9d8cc10	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
32db5328-d846-44c4-867f-e81359e947e2	ee140dfb-14f6-41d3-b2b0-4e50764290d7
32db5328-d846-44c4-867f-e81359e947e2	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
32db5328-d846-44c4-867f-e81359e947e2	ca652ee1-1423-42fe-a0ef-e5761a670845
32db5328-d846-44c4-867f-e81359e947e2	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
32db5328-d846-44c4-867f-e81359e947e2	7a90bccb-346e-4933-aaeb-cdef732be976
807d7448-0f1f-435f-880a-66ff98f39d2a	25db9c19-f84e-40d8-9dfb-ee94478ca40a
807d7448-0f1f-435f-880a-66ff98f39d2a	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
807d7448-0f1f-435f-880a-66ff98f39d2a	600ccd3a-a513-4a4a-864b-e00bfc9699f9
dc61a442-bafe-4280-bc7e-2a068321a6e0	600ccd3a-a513-4a4a-864b-e00bfc9699f9
dc61a442-bafe-4280-bc7e-2a068321a6e0	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
dc61a442-bafe-4280-bc7e-2a068321a6e0	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
24a10f8e-2a51-48ec-ba9a-a756a822ce6e	25db9c19-f84e-40d8-9dfb-ee94478ca40a
24a10f8e-2a51-48ec-ba9a-a756a822ce6e	f30de478-b560-47f5-8588-8062ffc64a25
9b5f2c7c-4df1-48e6-89c1-1ae2d23e57c6	82f57a9f-6615-4527-816f-31ee7a0b7c98
9b5f2c7c-4df1-48e6-89c1-1ae2d23e57c6	25db9c19-f84e-40d8-9dfb-ee94478ca40a
9b5f2c7c-4df1-48e6-89c1-1ae2d23e57c6	600ccd3a-a513-4a4a-864b-e00bfc9699f9
9b5f2c7c-4df1-48e6-89c1-1ae2d23e57c6	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
3c9e5c02-47a1-47b0-95cf-cf2e6f7db188	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
3c9e5c02-47a1-47b0-95cf-cf2e6f7db188	ee140dfb-14f6-41d3-b2b0-4e50764290d7
3c9e5c02-47a1-47b0-95cf-cf2e6f7db188	7879f271-4036-48be-befb-f08de052bcdc
3c9e5c02-47a1-47b0-95cf-cf2e6f7db188	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
dc28716e-8807-4f93-b3f8-278fe40e280a	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
dc28716e-8807-4f93-b3f8-278fe40e280a	ee140dfb-14f6-41d3-b2b0-4e50764290d7
dc28716e-8807-4f93-b3f8-278fe40e280a	25db9c19-f84e-40d8-9dfb-ee94478ca40a
dc28716e-8807-4f93-b3f8-278fe40e280a	600ccd3a-a513-4a4a-864b-e00bfc9699f9
dc28716e-8807-4f93-b3f8-278fe40e280a	82f57a9f-6615-4527-816f-31ee7a0b7c98
dc28716e-8807-4f93-b3f8-278fe40e280a	f30de478-b560-47f5-8588-8062ffc64a25
e32c539a-adc3-4ec9-bf15-2d3311a1be29	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
e32c539a-adc3-4ec9-bf15-2d3311a1be29	ee140dfb-14f6-41d3-b2b0-4e50764290d7
e32c539a-adc3-4ec9-bf15-2d3311a1be29	7879f271-4036-48be-befb-f08de052bcdc
e32c539a-adc3-4ec9-bf15-2d3311a1be29	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
0cef7d91-df40-49f1-b9ea-be7b1457d560	25db9c19-f84e-40d8-9dfb-ee94478ca40a
0cef7d91-df40-49f1-b9ea-be7b1457d560	600ccd3a-a513-4a4a-864b-e00bfc9699f9
0cef7d91-df40-49f1-b9ea-be7b1457d560	82f57a9f-6615-4527-816f-31ee7a0b7c98
21870c63-93c0-4ec3-841e-bd813ae079d4	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
21870c63-93c0-4ec3-841e-bd813ae079d4	ee140dfb-14f6-41d3-b2b0-4e50764290d7
21870c63-93c0-4ec3-841e-bd813ae079d4	25db9c19-f84e-40d8-9dfb-ee94478ca40a
21870c63-93c0-4ec3-841e-bd813ae079d4	600ccd3a-a513-4a4a-864b-e00bfc9699f9
21870c63-93c0-4ec3-841e-bd813ae079d4	82f57a9f-6615-4527-816f-31ee7a0b7c98
21870c63-93c0-4ec3-841e-bd813ae079d4	f30de478-b560-47f5-8588-8062ffc64a25
60b8e726-b97c-4f77-95bb-2702f8dcc216	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
60b8e726-b97c-4f77-95bb-2702f8dcc216	ee140dfb-14f6-41d3-b2b0-4e50764290d7
60b8e726-b97c-4f77-95bb-2702f8dcc216	25db9c19-f84e-40d8-9dfb-ee94478ca40a
60b8e726-b97c-4f77-95bb-2702f8dcc216	600ccd3a-a513-4a4a-864b-e00bfc9699f9
60b8e726-b97c-4f77-95bb-2702f8dcc216	82f57a9f-6615-4527-816f-31ee7a0b7c98
60b8e726-b97c-4f77-95bb-2702f8dcc216	f30de478-b560-47f5-8588-8062ffc64a25
065f3700-82a7-4025-bb40-c5362b53f3ba	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
065f3700-82a7-4025-bb40-c5362b53f3ba	ee140dfb-14f6-41d3-b2b0-4e50764290d7
065f3700-82a7-4025-bb40-c5362b53f3ba	25db9c19-f84e-40d8-9dfb-ee94478ca40a
065f3700-82a7-4025-bb40-c5362b53f3ba	600ccd3a-a513-4a4a-864b-e00bfc9699f9
065f3700-82a7-4025-bb40-c5362b53f3ba	7a90bccb-346e-4933-aaeb-cdef732be976
065f3700-82a7-4025-bb40-c5362b53f3ba	82f57a9f-6615-4527-816f-31ee7a0b7c98
065f3700-82a7-4025-bb40-c5362b53f3ba	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
065f3700-82a7-4025-bb40-c5362b53f3ba	f30de478-b560-47f5-8588-8062ffc64a25
065f3700-82a7-4025-bb40-c5362b53f3ba	ca652ee1-1423-42fe-a0ef-e5761a670845
065f3700-82a7-4025-bb40-c5362b53f3ba	7879f271-4036-48be-befb-f08de052bcdc
afda9b41-aa30-4dde-9b3b-781c45133b69	7879f271-4036-48be-befb-f08de052bcdc
87b6097f-6232-43f6-a3a8-0e1c3104212d	7a90bccb-346e-4933-aaeb-cdef732be976
87b6097f-6232-43f6-a3a8-0e1c3104212d	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
87b6097f-6232-43f6-a3a8-0e1c3104212d	ca652ee1-1423-42fe-a0ef-e5761a670845
87b6097f-6232-43f6-a3a8-0e1c3104212d	ee140dfb-14f6-41d3-b2b0-4e50764290d7
0ac27c5b-fa0a-4079-aa7a-5f76d332081d	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
0ac27c5b-fa0a-4079-aa7a-5f76d332081d	7a90bccb-346e-4933-aaeb-cdef732be976
0ac27c5b-fa0a-4079-aa7a-5f76d332081d	ee140dfb-14f6-41d3-b2b0-4e50764290d7
0ac27c5b-fa0a-4079-aa7a-5f76d332081d	7879f271-4036-48be-befb-f08de052bcdc
0ac27c5b-fa0a-4079-aa7a-5f76d332081d	ca652ee1-1423-42fe-a0ef-e5761a670845
90430aff-6410-494f-ad50-94aaf8eb0292	25db9c19-f84e-40d8-9dfb-ee94478ca40a
90430aff-6410-494f-ad50-94aaf8eb0292	600ccd3a-a513-4a4a-864b-e00bfc9699f9
90430aff-6410-494f-ad50-94aaf8eb0292	82f57a9f-6615-4527-816f-31ee7a0b7c98
90430aff-6410-494f-ad50-94aaf8eb0292	f30de478-b560-47f5-8588-8062ffc64a25
90430aff-6410-494f-ad50-94aaf8eb0292	31f1de58-af98-4946-997c-622cb20d9504
fe1bcd9c-03c9-48e7-85c5-b4de3ade9287	25db9c19-f84e-40d8-9dfb-ee94478ca40a
fe1bcd9c-03c9-48e7-85c5-b4de3ade9287	600ccd3a-a513-4a4a-864b-e00bfc9699f9
fe1bcd9c-03c9-48e7-85c5-b4de3ade9287	82f57a9f-6615-4527-816f-31ee7a0b7c98
fe1bcd9c-03c9-48e7-85c5-b4de3ade9287	f30de478-b560-47f5-8588-8062ffc64a25
fe1bcd9c-03c9-48e7-85c5-b4de3ade9287	31f1de58-af98-4946-997c-622cb20d9504
e0c2d69a-acfd-4080-9bcd-71fbc7f3a182	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
e0c2d69a-acfd-4080-9bcd-71fbc7f3a182	ee140dfb-14f6-41d3-b2b0-4e50764290d7
e0c2d69a-acfd-4080-9bcd-71fbc7f3a182	25db9c19-f84e-40d8-9dfb-ee94478ca40a
e0c2d69a-acfd-4080-9bcd-71fbc7f3a182	600ccd3a-a513-4a4a-864b-e00bfc9699f9
e0c2d69a-acfd-4080-9bcd-71fbc7f3a182	7a90bccb-346e-4933-aaeb-cdef732be976
e0c2d69a-acfd-4080-9bcd-71fbc7f3a182	82f57a9f-6615-4527-816f-31ee7a0b7c98
e0c2d69a-acfd-4080-9bcd-71fbc7f3a182	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
e0c2d69a-acfd-4080-9bcd-71fbc7f3a182	f30de478-b560-47f5-8588-8062ffc64a25
e0c2d69a-acfd-4080-9bcd-71fbc7f3a182	ca652ee1-1423-42fe-a0ef-e5761a670845
e0c2d69a-acfd-4080-9bcd-71fbc7f3a182	7879f271-4036-48be-befb-f08de052bcdc
b3abd6a4-3434-4550-bc84-f1f452130e64	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
b3abd6a4-3434-4550-bc84-f1f452130e64	ee140dfb-14f6-41d3-b2b0-4e50764290d7
b3abd6a4-3434-4550-bc84-f1f452130e64	25db9c19-f84e-40d8-9dfb-ee94478ca40a
b3abd6a4-3434-4550-bc84-f1f452130e64	600ccd3a-a513-4a4a-864b-e00bfc9699f9
b3abd6a4-3434-4550-bc84-f1f452130e64	7a90bccb-346e-4933-aaeb-cdef732be976
b3abd6a4-3434-4550-bc84-f1f452130e64	82f57a9f-6615-4527-816f-31ee7a0b7c98
b3abd6a4-3434-4550-bc84-f1f452130e64	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
b3abd6a4-3434-4550-bc84-f1f452130e64	f30de478-b560-47f5-8588-8062ffc64a25
b3abd6a4-3434-4550-bc84-f1f452130e64	ca652ee1-1423-42fe-a0ef-e5761a670845
b3abd6a4-3434-4550-bc84-f1f452130e64	7879f271-4036-48be-befb-f08de052bcdc
f4525973-166d-46e6-9d1b-e6f9e786c1ca	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
f4525973-166d-46e6-9d1b-e6f9e786c1ca	ee140dfb-14f6-41d3-b2b0-4e50764290d7
f4525973-166d-46e6-9d1b-e6f9e786c1ca	25db9c19-f84e-40d8-9dfb-ee94478ca40a
f4525973-166d-46e6-9d1b-e6f9e786c1ca	600ccd3a-a513-4a4a-864b-e00bfc9699f9
f4525973-166d-46e6-9d1b-e6f9e786c1ca	7a90bccb-346e-4933-aaeb-cdef732be976
f4525973-166d-46e6-9d1b-e6f9e786c1ca	82f57a9f-6615-4527-816f-31ee7a0b7c98
f4525973-166d-46e6-9d1b-e6f9e786c1ca	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
f4525973-166d-46e6-9d1b-e6f9e786c1ca	f30de478-b560-47f5-8588-8062ffc64a25
f4525973-166d-46e6-9d1b-e6f9e786c1ca	ca652ee1-1423-42fe-a0ef-e5761a670845
f4525973-166d-46e6-9d1b-e6f9e786c1ca	7879f271-4036-48be-befb-f08de052bcdc
0e98bd99-373d-42e4-9d94-aea273569288	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
0e98bd99-373d-42e4-9d94-aea273569288	ee140dfb-14f6-41d3-b2b0-4e50764290d7
0e98bd99-373d-42e4-9d94-aea273569288	25db9c19-f84e-40d8-9dfb-ee94478ca40a
0e98bd99-373d-42e4-9d94-aea273569288	600ccd3a-a513-4a4a-864b-e00bfc9699f9
0e98bd99-373d-42e4-9d94-aea273569288	7a90bccb-346e-4933-aaeb-cdef732be976
0e98bd99-373d-42e4-9d94-aea273569288	82f57a9f-6615-4527-816f-31ee7a0b7c98
0e98bd99-373d-42e4-9d94-aea273569288	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
0e98bd99-373d-42e4-9d94-aea273569288	f30de478-b560-47f5-8588-8062ffc64a25
0e98bd99-373d-42e4-9d94-aea273569288	ca652ee1-1423-42fe-a0ef-e5761a670845
0e98bd99-373d-42e4-9d94-aea273569288	7879f271-4036-48be-befb-f08de052bcdc
13e1cbea-1c54-4cfb-8a19-f87aab0f72ea	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
13e1cbea-1c54-4cfb-8a19-f87aab0f72ea	ee140dfb-14f6-41d3-b2b0-4e50764290d7
13e1cbea-1c54-4cfb-8a19-f87aab0f72ea	25db9c19-f84e-40d8-9dfb-ee94478ca40a
13e1cbea-1c54-4cfb-8a19-f87aab0f72ea	600ccd3a-a513-4a4a-864b-e00bfc9699f9
13e1cbea-1c54-4cfb-8a19-f87aab0f72ea	7a90bccb-346e-4933-aaeb-cdef732be976
13e1cbea-1c54-4cfb-8a19-f87aab0f72ea	82f57a9f-6615-4527-816f-31ee7a0b7c98
13e1cbea-1c54-4cfb-8a19-f87aab0f72ea	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
13e1cbea-1c54-4cfb-8a19-f87aab0f72ea	f30de478-b560-47f5-8588-8062ffc64a25
13e1cbea-1c54-4cfb-8a19-f87aab0f72ea	ca652ee1-1423-42fe-a0ef-e5761a670845
13e1cbea-1c54-4cfb-8a19-f87aab0f72ea	7879f271-4036-48be-befb-f08de052bcdc
d7ea0771-8275-4dec-a537-a45fff12922a	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
d7ea0771-8275-4dec-a537-a45fff12922a	600ccd3a-a513-4a4a-864b-e00bfc9699f9
d7ea0771-8275-4dec-a537-a45fff12922a	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
8f2cff72-cd3c-480f-9d63-5cd260b08d27	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
8f2cff72-cd3c-480f-9d63-5cd260b08d27	600ccd3a-a513-4a4a-864b-e00bfc9699f9
8f2cff72-cd3c-480f-9d63-5cd260b08d27	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
b0710d71-7225-48bd-983a-4bac000e28ea	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
b0710d71-7225-48bd-983a-4bac000e28ea	600ccd3a-a513-4a4a-864b-e00bfc9699f9
b0710d71-7225-48bd-983a-4bac000e28ea	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
c1784cee-aa7e-4b69-8d0d-bdbbbfdb94b2	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
c1784cee-aa7e-4b69-8d0d-bdbbbfdb94b2	600ccd3a-a513-4a4a-864b-e00bfc9699f9
c1784cee-aa7e-4b69-8d0d-bdbbbfdb94b2	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
8785d709-a946-4bbb-8a55-8c2f3bf0a25e	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
8785d709-a946-4bbb-8a55-8c2f3bf0a25e	600ccd3a-a513-4a4a-864b-e00bfc9699f9
8785d709-a946-4bbb-8a55-8c2f3bf0a25e	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
6bba30f9-e03a-447f-b883-32b548f2df98	25db9c19-f84e-40d8-9dfb-ee94478ca40a
6bba30f9-e03a-447f-b883-32b548f2df98	600ccd3a-a513-4a4a-864b-e00bfc9699f9
6bba30f9-e03a-447f-b883-32b548f2df98	82f57a9f-6615-4527-816f-31ee7a0b7c98
6bba30f9-e03a-447f-b883-32b548f2df98	f30de478-b560-47f5-8588-8062ffc64a25
6bba30f9-e03a-447f-b883-32b548f2df98	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
6bba30f9-e03a-447f-b883-32b548f2df98	31f1de58-af98-4946-997c-622cb20d9504
6bba30f9-e03a-447f-b883-32b548f2df98	ee140dfb-14f6-41d3-b2b0-4e50764290d7
aff449b5-f49f-4417-8258-8a671518962e	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
fdc4af0e-d8ac-46de-a2fa-0e0045529c67	ca652ee1-1423-42fe-a0ef-e5761a670845
fdc4af0e-d8ac-46de-a2fa-0e0045529c67	ee140dfb-14f6-41d3-b2b0-4e50764290d7
fdc4af0e-d8ac-46de-a2fa-0e0045529c67	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
fdc4af0e-d8ac-46de-a2fa-0e0045529c67	7879f271-4036-48be-befb-f08de052bcdc
fdc4af0e-d8ac-46de-a2fa-0e0045529c67	7a90bccb-346e-4933-aaeb-cdef732be976
3ffa3d3c-ee5f-4ec6-b12d-33128498ce3f	ca652ee1-1423-42fe-a0ef-e5761a670845
3ffa3d3c-ee5f-4ec6-b12d-33128498ce3f	ee140dfb-14f6-41d3-b2b0-4e50764290d7
3ffa3d3c-ee5f-4ec6-b12d-33128498ce3f	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
3ffa3d3c-ee5f-4ec6-b12d-33128498ce3f	7a90bccb-346e-4933-aaeb-cdef732be976
3ffa3d3c-ee5f-4ec6-b12d-33128498ce3f	82f57a9f-6615-4527-816f-31ee7a0b7c98
3ffa3d3c-ee5f-4ec6-b12d-33128498ce3f	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
a442e7be-2447-493d-9403-78b4969d569c	25db9c19-f84e-40d8-9dfb-ee94478ca40a
a442e7be-2447-493d-9403-78b4969d569c	600ccd3a-a513-4a4a-864b-e00bfc9699f9
a442e7be-2447-493d-9403-78b4969d569c	82f57a9f-6615-4527-816f-31ee7a0b7c98
a442e7be-2447-493d-9403-78b4969d569c	f30de478-b560-47f5-8588-8062ffc64a25
a442e7be-2447-493d-9403-78b4969d569c	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
a442e7be-2447-493d-9403-78b4969d569c	31f1de58-af98-4946-997c-622cb20d9504
a442e7be-2447-493d-9403-78b4969d569c	ee140dfb-14f6-41d3-b2b0-4e50764290d7
517f6e60-ddc7-48ad-b7c4-6a08167efc09	ca652ee1-1423-42fe-a0ef-e5761a670845
517f6e60-ddc7-48ad-b7c4-6a08167efc09	ee140dfb-14f6-41d3-b2b0-4e50764290d7
517f6e60-ddc7-48ad-b7c4-6a08167efc09	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
517f6e60-ddc7-48ad-b7c4-6a08167efc09	7879f271-4036-48be-befb-f08de052bcdc
517f6e60-ddc7-48ad-b7c4-6a08167efc09	7a90bccb-346e-4933-aaeb-cdef732be976
61659450-ba26-43cf-bc54-dbdeee7a39c8	ca652ee1-1423-42fe-a0ef-e5761a670845
61659450-ba26-43cf-bc54-dbdeee7a39c8	ee140dfb-14f6-41d3-b2b0-4e50764290d7
61659450-ba26-43cf-bc54-dbdeee7a39c8	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
61659450-ba26-43cf-bc54-dbdeee7a39c8	7879f271-4036-48be-befb-f08de052bcdc
61659450-ba26-43cf-bc54-dbdeee7a39c8	7a90bccb-346e-4933-aaeb-cdef732be976
61659450-ba26-43cf-bc54-dbdeee7a39c8	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
69e24a15-a7a5-408c-ae3c-523a89b58799	ee140dfb-14f6-41d3-b2b0-4e50764290d7
69e24a15-a7a5-408c-ae3c-523a89b58799	7a90bccb-346e-4933-aaeb-cdef732be976
69e24a15-a7a5-408c-ae3c-523a89b58799	ca652ee1-1423-42fe-a0ef-e5761a670845
69e24a15-a7a5-408c-ae3c-523a89b58799	7879f271-4036-48be-befb-f08de052bcdc
69e24a15-a7a5-408c-ae3c-523a89b58799	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
39b9b01b-8d3c-4ed5-b161-231d825b7f90	ca652ee1-1423-42fe-a0ef-e5761a670845
39b9b01b-8d3c-4ed5-b161-231d825b7f90	ee140dfb-14f6-41d3-b2b0-4e50764290d7
39b9b01b-8d3c-4ed5-b161-231d825b7f90	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
39b9b01b-8d3c-4ed5-b161-231d825b7f90	7879f271-4036-48be-befb-f08de052bcdc
39b9b01b-8d3c-4ed5-b161-231d825b7f90	7a90bccb-346e-4933-aaeb-cdef732be976
39b9b01b-8d3c-4ed5-b161-231d825b7f90	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
2afaa7d4-89ee-49ec-9391-dc10c7f9bd6c	ca652ee1-1423-42fe-a0ef-e5761a670845
2afaa7d4-89ee-49ec-9391-dc10c7f9bd6c	ee140dfb-14f6-41d3-b2b0-4e50764290d7
2afaa7d4-89ee-49ec-9391-dc10c7f9bd6c	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
2afaa7d4-89ee-49ec-9391-dc10c7f9bd6c	7879f271-4036-48be-befb-f08de052bcdc
2afaa7d4-89ee-49ec-9391-dc10c7f9bd6c	7a90bccb-346e-4933-aaeb-cdef732be976
2afaa7d4-89ee-49ec-9391-dc10c7f9bd6c	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
25522813-086e-4ef1-ad4b-eac1740a83eb	25db9c19-f84e-40d8-9dfb-ee94478ca40a
25522813-086e-4ef1-ad4b-eac1740a83eb	600ccd3a-a513-4a4a-864b-e00bfc9699f9
25522813-086e-4ef1-ad4b-eac1740a83eb	82f57a9f-6615-4527-816f-31ee7a0b7c98
25522813-086e-4ef1-ad4b-eac1740a83eb	f30de478-b560-47f5-8588-8062ffc64a25
25522813-086e-4ef1-ad4b-eac1740a83eb	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
25522813-086e-4ef1-ad4b-eac1740a83eb	31f1de58-af98-4946-997c-622cb20d9504
25522813-086e-4ef1-ad4b-eac1740a83eb	ee140dfb-14f6-41d3-b2b0-4e50764290d7
d438642d-c090-43c5-9d22-2c4cedd787a4	ee140dfb-14f6-41d3-b2b0-4e50764290d7
d438642d-c090-43c5-9d22-2c4cedd787a4	25db9c19-f84e-40d8-9dfb-ee94478ca40a
d438642d-c090-43c5-9d22-2c4cedd787a4	600ccd3a-a513-4a4a-864b-e00bfc9699f9
d438642d-c090-43c5-9d22-2c4cedd787a4	7a90bccb-346e-4933-aaeb-cdef732be976
d438642d-c090-43c5-9d22-2c4cedd787a4	82f57a9f-6615-4527-816f-31ee7a0b7c98
d438642d-c090-43c5-9d22-2c4cedd787a4	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
d438642d-c090-43c5-9d22-2c4cedd787a4	f30de478-b560-47f5-8588-8062ffc64a25
d438642d-c090-43c5-9d22-2c4cedd787a4	ca652ee1-1423-42fe-a0ef-e5761a670845
d438642d-c090-43c5-9d22-2c4cedd787a4	7879f271-4036-48be-befb-f08de052bcdc
d438642d-c090-43c5-9d22-2c4cedd787a4	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
a3bb912d-893d-40b9-bda9-5f74c5da9d2a	ca652ee1-1423-42fe-a0ef-e5761a670845
a3bb912d-893d-40b9-bda9-5f74c5da9d2a	ee140dfb-14f6-41d3-b2b0-4e50764290d7
a3bb912d-893d-40b9-bda9-5f74c5da9d2a	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
a3bb912d-893d-40b9-bda9-5f74c5da9d2a	7879f271-4036-48be-befb-f08de052bcdc
a3bb912d-893d-40b9-bda9-5f74c5da9d2a	7a90bccb-346e-4933-aaeb-cdef732be976
a3bb912d-893d-40b9-bda9-5f74c5da9d2a	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
7fe5f795-13fb-4cb0-b888-a06f3ddf6cac	25db9c19-f84e-40d8-9dfb-ee94478ca40a
7fe5f795-13fb-4cb0-b888-a06f3ddf6cac	600ccd3a-a513-4a4a-864b-e00bfc9699f9
7fe5f795-13fb-4cb0-b888-a06f3ddf6cac	82f57a9f-6615-4527-816f-31ee7a0b7c98
7fe5f795-13fb-4cb0-b888-a06f3ddf6cac	f30de478-b560-47f5-8588-8062ffc64a25
7fe5f795-13fb-4cb0-b888-a06f3ddf6cac	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
7fe5f795-13fb-4cb0-b888-a06f3ddf6cac	31f1de58-af98-4946-997c-622cb20d9504
7fe5f795-13fb-4cb0-b888-a06f3ddf6cac	ee140dfb-14f6-41d3-b2b0-4e50764290d7
896e7658-05a4-449b-8c25-89c4c7d11be1	25db9c19-f84e-40d8-9dfb-ee94478ca40a
896e7658-05a4-449b-8c25-89c4c7d11be1	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
896e7658-05a4-449b-8c25-89c4c7d11be1	600ccd3a-a513-4a4a-864b-e00bfc9699f9
e6fa7e76-533c-45fa-85b8-ecef973c3c00	ca652ee1-1423-42fe-a0ef-e5761a670845
e6fa7e76-533c-45fa-85b8-ecef973c3c00	ee140dfb-14f6-41d3-b2b0-4e50764290d7
e6fa7e76-533c-45fa-85b8-ecef973c3c00	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
e6fa7e76-533c-45fa-85b8-ecef973c3c00	7879f271-4036-48be-befb-f08de052bcdc
e6fa7e76-533c-45fa-85b8-ecef973c3c00	7a90bccb-346e-4933-aaeb-cdef732be976
e6fa7e76-533c-45fa-85b8-ecef973c3c00	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
7d401447-9caf-4713-812c-f1072d277d5c	ca652ee1-1423-42fe-a0ef-e5761a670845
7d401447-9caf-4713-812c-f1072d277d5c	ee140dfb-14f6-41d3-b2b0-4e50764290d7
7d401447-9caf-4713-812c-f1072d277d5c	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
7d401447-9caf-4713-812c-f1072d277d5c	7a90bccb-346e-4933-aaeb-cdef732be976
7d401447-9caf-4713-812c-f1072d277d5c	82f57a9f-6615-4527-816f-31ee7a0b7c98
7d401447-9caf-4713-812c-f1072d277d5c	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
055a8d84-dc22-4aad-8d37-adbe9e19545d	600ccd3a-a513-4a4a-864b-e00bfc9699f9
52fe8757-21c1-4e21-b75f-c20bf1efdee4	600ccd3a-a513-4a4a-864b-e00bfc9699f9
f927973b-9861-482c-92b6-390df01bf193	600ccd3a-a513-4a4a-864b-e00bfc9699f9
f927973b-9861-482c-92b6-390df01bf193	82f57a9f-6615-4527-816f-31ee7a0b7c98
f927973b-9861-482c-92b6-390df01bf193	f30de478-b560-47f5-8588-8062ffc64a25
9e0612da-7c2d-460b-aa24-b762d4202b88	600ccd3a-a513-4a4a-864b-e00bfc9699f9
9e0612da-7c2d-460b-aa24-b762d4202b88	82f57a9f-6615-4527-816f-31ee7a0b7c98
9e0612da-7c2d-460b-aa24-b762d4202b88	f30de478-b560-47f5-8588-8062ffc64a25
d8d2844e-e84c-4c27-a1d7-c3310afafda0	ca652ee1-1423-42fe-a0ef-e5761a670845
d8d2844e-e84c-4c27-a1d7-c3310afafda0	ee140dfb-14f6-41d3-b2b0-4e50764290d7
d8d2844e-e84c-4c27-a1d7-c3310afafda0	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
d8d2844e-e84c-4c27-a1d7-c3310afafda0	7879f271-4036-48be-befb-f08de052bcdc
d8d2844e-e84c-4c27-a1d7-c3310afafda0	7a90bccb-346e-4933-aaeb-cdef732be976
d8d2844e-e84c-4c27-a1d7-c3310afafda0	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
9fa70a66-1e09-4dc4-b5da-4fd46e6f3cb4	25db9c19-f84e-40d8-9dfb-ee94478ca40a
9fa70a66-1e09-4dc4-b5da-4fd46e6f3cb4	600ccd3a-a513-4a4a-864b-e00bfc9699f9
9fa70a66-1e09-4dc4-b5da-4fd46e6f3cb4	82f57a9f-6615-4527-816f-31ee7a0b7c98
9fa70a66-1e09-4dc4-b5da-4fd46e6f3cb4	f30de478-b560-47f5-8588-8062ffc64a25
9fa70a66-1e09-4dc4-b5da-4fd46e6f3cb4	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
9fa70a66-1e09-4dc4-b5da-4fd46e6f3cb4	31f1de58-af98-4946-997c-622cb20d9504
9fa70a66-1e09-4dc4-b5da-4fd46e6f3cb4	ee140dfb-14f6-41d3-b2b0-4e50764290d7
dab455dc-a825-4287-816a-29310bd8c38f	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
dab455dc-a825-4287-816a-29310bd8c38f	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
dab455dc-a825-4287-816a-29310bd8c38f	600ccd3a-a513-4a4a-864b-e00bfc9699f9
dab455dc-a825-4287-816a-29310bd8c38f	25db9c19-f84e-40d8-9dfb-ee94478ca40a
dab455dc-a825-4287-816a-29310bd8c38f	82f57a9f-6615-4527-816f-31ee7a0b7c98
dab455dc-a825-4287-816a-29310bd8c38f	ee140dfb-14f6-41d3-b2b0-4e50764290d7
dab455dc-a825-4287-816a-29310bd8c38f	ca652ee1-1423-42fe-a0ef-e5761a670845
ba6f00ff-074e-41ab-b0f2-110e08b72e23	ca652ee1-1423-42fe-a0ef-e5761a670845
ba6f00ff-074e-41ab-b0f2-110e08b72e23	ee140dfb-14f6-41d3-b2b0-4e50764290d7
ba6f00ff-074e-41ab-b0f2-110e08b72e23	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
ba6f00ff-074e-41ab-b0f2-110e08b72e23	7879f271-4036-48be-befb-f08de052bcdc
ba6f00ff-074e-41ab-b0f2-110e08b72e23	7a90bccb-346e-4933-aaeb-cdef732be976
ba6f00ff-074e-41ab-b0f2-110e08b72e23	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
8819386c-658f-4629-9746-36de21ced530	ca652ee1-1423-42fe-a0ef-e5761a670845
8819386c-658f-4629-9746-36de21ced530	ee140dfb-14f6-41d3-b2b0-4e50764290d7
8819386c-658f-4629-9746-36de21ced530	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
8819386c-658f-4629-9746-36de21ced530	7879f271-4036-48be-befb-f08de052bcdc
8819386c-658f-4629-9746-36de21ced530	7a90bccb-346e-4933-aaeb-cdef732be976
8819386c-658f-4629-9746-36de21ced530	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
a61bd1a0-ab6c-4c3d-8ef2-d90dd7b4ceef	ca652ee1-1423-42fe-a0ef-e5761a670845
a61bd1a0-ab6c-4c3d-8ef2-d90dd7b4ceef	ee140dfb-14f6-41d3-b2b0-4e50764290d7
a61bd1a0-ab6c-4c3d-8ef2-d90dd7b4ceef	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
a61bd1a0-ab6c-4c3d-8ef2-d90dd7b4ceef	7879f271-4036-48be-befb-f08de052bcdc
a61bd1a0-ab6c-4c3d-8ef2-d90dd7b4ceef	7a90bccb-346e-4933-aaeb-cdef732be976
a61bd1a0-ab6c-4c3d-8ef2-d90dd7b4ceef	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
59add48e-eb2e-41cc-babf-e37172728fce	ca652ee1-1423-42fe-a0ef-e5761a670845
59add48e-eb2e-41cc-babf-e37172728fce	ee140dfb-14f6-41d3-b2b0-4e50764290d7
59add48e-eb2e-41cc-babf-e37172728fce	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
59add48e-eb2e-41cc-babf-e37172728fce	7879f271-4036-48be-befb-f08de052bcdc
59add48e-eb2e-41cc-babf-e37172728fce	7a90bccb-346e-4933-aaeb-cdef732be976
59add48e-eb2e-41cc-babf-e37172728fce	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
81146d99-7c5f-4b86-8826-de0b955093c1	25db9c19-f84e-40d8-9dfb-ee94478ca40a
81146d99-7c5f-4b86-8826-de0b955093c1	4d783a5d-2c91-4cc0-89f6-42d0b5d189c8
81146d99-7c5f-4b86-8826-de0b955093c1	600ccd3a-a513-4a4a-864b-e00bfc9699f9
81146d99-7c5f-4b86-8826-de0b955093c1	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
81146d99-7c5f-4b86-8826-de0b955093c1	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
81146d99-7c5f-4b86-8826-de0b955093c1	7879f271-4036-48be-befb-f08de052bcdc
81146d99-7c5f-4b86-8826-de0b955093c1	7a90bccb-346e-4933-aaeb-cdef732be976
81146d99-7c5f-4b86-8826-de0b955093c1	82f57a9f-6615-4527-816f-31ee7a0b7c98
81146d99-7c5f-4b86-8826-de0b955093c1	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
81146d99-7c5f-4b86-8826-de0b955093c1	ca652ee1-1423-42fe-a0ef-e5761a670845
81146d99-7c5f-4b86-8826-de0b955093c1	ee140dfb-14f6-41d3-b2b0-4e50764290d7
81146d99-7c5f-4b86-8826-de0b955093c1	f30de478-b560-47f5-8588-8062ffc64a25
18982189-4823-414e-b456-65e09d1237fa	ca652ee1-1423-42fe-a0ef-e5761a670845
18982189-4823-414e-b456-65e09d1237fa	ee140dfb-14f6-41d3-b2b0-4e50764290d7
18982189-4823-414e-b456-65e09d1237fa	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
18982189-4823-414e-b456-65e09d1237fa	7a90bccb-346e-4933-aaeb-cdef732be976
18982189-4823-414e-b456-65e09d1237fa	82f57a9f-6615-4527-816f-31ee7a0b7c98
18982189-4823-414e-b456-65e09d1237fa	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
bf3664b6-87c1-4932-9b2f-5cc5178c5fa0	ee140dfb-14f6-41d3-b2b0-4e50764290d7
bf3664b6-87c1-4932-9b2f-5cc5178c5fa0	82f57a9f-6615-4527-816f-31ee7a0b7c98
bf3664b6-87c1-4932-9b2f-5cc5178c5fa0	25db9c19-f84e-40d8-9dfb-ee94478ca40a
bf3664b6-87c1-4932-9b2f-5cc5178c5fa0	600ccd3a-a513-4a4a-864b-e00bfc9699f9
bf3664b6-87c1-4932-9b2f-5cc5178c5fa0	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
aa52c52f-fddc-45a4-945a-ed73947d74c9	25db9c19-f84e-40d8-9dfb-ee94478ca40a
aa52c52f-fddc-45a4-945a-ed73947d74c9	600ccd3a-a513-4a4a-864b-e00bfc9699f9
aa52c52f-fddc-45a4-945a-ed73947d74c9	82f57a9f-6615-4527-816f-31ee7a0b7c98
aa52c52f-fddc-45a4-945a-ed73947d74c9	f30de478-b560-47f5-8588-8062ffc64a25
aa52c52f-fddc-45a4-945a-ed73947d74c9	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
aa52c52f-fddc-45a4-945a-ed73947d74c9	31f1de58-af98-4946-997c-622cb20d9504
aa52c52f-fddc-45a4-945a-ed73947d74c9	ee140dfb-14f6-41d3-b2b0-4e50764290d7
6159e96d-a508-45e2-8868-345533482eed	25db9c19-f84e-40d8-9dfb-ee94478ca40a
6159e96d-a508-45e2-8868-345533482eed	600ccd3a-a513-4a4a-864b-e00bfc9699f9
6159e96d-a508-45e2-8868-345533482eed	82f57a9f-6615-4527-816f-31ee7a0b7c98
6159e96d-a508-45e2-8868-345533482eed	f30de478-b560-47f5-8588-8062ffc64a25
6159e96d-a508-45e2-8868-345533482eed	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
6159e96d-a508-45e2-8868-345533482eed	31f1de58-af98-4946-997c-622cb20d9504
6159e96d-a508-45e2-8868-345533482eed	ee140dfb-14f6-41d3-b2b0-4e50764290d7
8318452f-09bc-48ae-b89b-6c479ff3ce34	600ccd3a-a513-4a4a-864b-e00bfc9699f9
8318452f-09bc-48ae-b89b-6c479ff3ce34	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
8318452f-09bc-48ae-b89b-6c479ff3ce34	7879f271-4036-48be-befb-f08de052bcdc
8318452f-09bc-48ae-b89b-6c479ff3ce34	7a90bccb-346e-4933-aaeb-cdef732be976
8318452f-09bc-48ae-b89b-6c479ff3ce34	82f57a9f-6615-4527-816f-31ee7a0b7c98
8318452f-09bc-48ae-b89b-6c479ff3ce34	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
8318452f-09bc-48ae-b89b-6c479ff3ce34	ca652ee1-1423-42fe-a0ef-e5761a670845
8318452f-09bc-48ae-b89b-6c479ff3ce34	ee140dfb-14f6-41d3-b2b0-4e50764290d7
8318452f-09bc-48ae-b89b-6c479ff3ce34	f30de478-b560-47f5-8588-8062ffc64a25
2a2c495e-2921-45b6-9dd6-5c8245c63ea0	ca652ee1-1423-42fe-a0ef-e5761a670845
2a2c495e-2921-45b6-9dd6-5c8245c63ea0	ee140dfb-14f6-41d3-b2b0-4e50764290d7
2a2c495e-2921-45b6-9dd6-5c8245c63ea0	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
2a2c495e-2921-45b6-9dd6-5c8245c63ea0	7879f271-4036-48be-befb-f08de052bcdc
2a2c495e-2921-45b6-9dd6-5c8245c63ea0	7a90bccb-346e-4933-aaeb-cdef732be976
2a2c495e-2921-45b6-9dd6-5c8245c63ea0	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
67fc219e-072b-4b22-b295-0fd462aae098	ee140dfb-14f6-41d3-b2b0-4e50764290d7
67fc219e-072b-4b22-b295-0fd462aae098	25db9c19-f84e-40d8-9dfb-ee94478ca40a
67fc219e-072b-4b22-b295-0fd462aae098	600ccd3a-a513-4a4a-864b-e00bfc9699f9
67fc219e-072b-4b22-b295-0fd462aae098	7a90bccb-346e-4933-aaeb-cdef732be976
67fc219e-072b-4b22-b295-0fd462aae098	82f57a9f-6615-4527-816f-31ee7a0b7c98
67fc219e-072b-4b22-b295-0fd462aae098	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
67fc219e-072b-4b22-b295-0fd462aae098	f30de478-b560-47f5-8588-8062ffc64a25
67fc219e-072b-4b22-b295-0fd462aae098	ca652ee1-1423-42fe-a0ef-e5761a670845
67fc219e-072b-4b22-b295-0fd462aae098	7879f271-4036-48be-befb-f08de052bcdc
67fc219e-072b-4b22-b295-0fd462aae098	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
5402f67d-3e1f-46df-a5de-71d8f162e9c6	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
5402f67d-3e1f-46df-a5de-71d8f162e9c6	25db9c19-f84e-40d8-9dfb-ee94478ca40a
5402f67d-3e1f-46df-a5de-71d8f162e9c6	600ccd3a-a513-4a4a-864b-e00bfc9699f9
5402f67d-3e1f-46df-a5de-71d8f162e9c6	82f57a9f-6615-4527-816f-31ee7a0b7c98
5402f67d-3e1f-46df-a5de-71d8f162e9c6	f30de478-b560-47f5-8588-8062ffc64a25
5402f67d-3e1f-46df-a5de-71d8f162e9c6	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
5402f67d-3e1f-46df-a5de-71d8f162e9c6	31f1de58-af98-4946-997c-622cb20d9504
5402f67d-3e1f-46df-a5de-71d8f162e9c6	ee140dfb-14f6-41d3-b2b0-4e50764290d7
7da19367-6883-4946-b4e6-789744d03b89	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
7da19367-6883-4946-b4e6-789744d03b89	25db9c19-f84e-40d8-9dfb-ee94478ca40a
7da19367-6883-4946-b4e6-789744d03b89	600ccd3a-a513-4a4a-864b-e00bfc9699f9
7da19367-6883-4946-b4e6-789744d03b89	82f57a9f-6615-4527-816f-31ee7a0b7c98
7da19367-6883-4946-b4e6-789744d03b89	f30de478-b560-47f5-8588-8062ffc64a25
7da19367-6883-4946-b4e6-789744d03b89	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
7da19367-6883-4946-b4e6-789744d03b89	31f1de58-af98-4946-997c-622cb20d9504
7da19367-6883-4946-b4e6-789744d03b89	ee140dfb-14f6-41d3-b2b0-4e50764290d7
27187133-565c-4d11-9227-c8a068cdd154	ca652ee1-1423-42fe-a0ef-e5761a670845
27187133-565c-4d11-9227-c8a068cdd154	ee140dfb-14f6-41d3-b2b0-4e50764290d7
27187133-565c-4d11-9227-c8a068cdd154	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
27187133-565c-4d11-9227-c8a068cdd154	7879f271-4036-48be-befb-f08de052bcdc
27187133-565c-4d11-9227-c8a068cdd154	7a90bccb-346e-4933-aaeb-cdef732be976
27187133-565c-4d11-9227-c8a068cdd154	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
59ebd84d-6382-43e3-b5ed-d5f6ef582f2c	ee140dfb-14f6-41d3-b2b0-4e50764290d7
59ebd84d-6382-43e3-b5ed-d5f6ef582f2c	25db9c19-f84e-40d8-9dfb-ee94478ca40a
59ebd84d-6382-43e3-b5ed-d5f6ef582f2c	600ccd3a-a513-4a4a-864b-e00bfc9699f9
59ebd84d-6382-43e3-b5ed-d5f6ef582f2c	7a90bccb-346e-4933-aaeb-cdef732be976
59ebd84d-6382-43e3-b5ed-d5f6ef582f2c	82f57a9f-6615-4527-816f-31ee7a0b7c98
59ebd84d-6382-43e3-b5ed-d5f6ef582f2c	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
59ebd84d-6382-43e3-b5ed-d5f6ef582f2c	f30de478-b560-47f5-8588-8062ffc64a25
59ebd84d-6382-43e3-b5ed-d5f6ef582f2c	ca652ee1-1423-42fe-a0ef-e5761a670845
59ebd84d-6382-43e3-b5ed-d5f6ef582f2c	7879f271-4036-48be-befb-f08de052bcdc
59ebd84d-6382-43e3-b5ed-d5f6ef582f2c	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
795d9351-a097-48a7-9c5a-7a0409341af4	600ccd3a-a513-4a4a-864b-e00bfc9699f9
795d9351-a097-48a7-9c5a-7a0409341af4	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
795d9351-a097-48a7-9c5a-7a0409341af4	7879f271-4036-48be-befb-f08de052bcdc
795d9351-a097-48a7-9c5a-7a0409341af4	7a90bccb-346e-4933-aaeb-cdef732be976
795d9351-a097-48a7-9c5a-7a0409341af4	82f57a9f-6615-4527-816f-31ee7a0b7c98
795d9351-a097-48a7-9c5a-7a0409341af4	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
795d9351-a097-48a7-9c5a-7a0409341af4	ca652ee1-1423-42fe-a0ef-e5761a670845
795d9351-a097-48a7-9c5a-7a0409341af4	ee140dfb-14f6-41d3-b2b0-4e50764290d7
795d9351-a097-48a7-9c5a-7a0409341af4	f30de478-b560-47f5-8588-8062ffc64a25
9ba172a0-a1a7-4caa-a221-b8a2704e5a9c	ee140dfb-14f6-41d3-b2b0-4e50764290d7
9ba172a0-a1a7-4caa-a221-b8a2704e5a9c	25db9c19-f84e-40d8-9dfb-ee94478ca40a
9ba172a0-a1a7-4caa-a221-b8a2704e5a9c	600ccd3a-a513-4a4a-864b-e00bfc9699f9
9ba172a0-a1a7-4caa-a221-b8a2704e5a9c	7a90bccb-346e-4933-aaeb-cdef732be976
9ba172a0-a1a7-4caa-a221-b8a2704e5a9c	82f57a9f-6615-4527-816f-31ee7a0b7c98
9ba172a0-a1a7-4caa-a221-b8a2704e5a9c	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
9ba172a0-a1a7-4caa-a221-b8a2704e5a9c	f30de478-b560-47f5-8588-8062ffc64a25
9ba172a0-a1a7-4caa-a221-b8a2704e5a9c	ca652ee1-1423-42fe-a0ef-e5761a670845
9ba172a0-a1a7-4caa-a221-b8a2704e5a9c	7879f271-4036-48be-befb-f08de052bcdc
9ba172a0-a1a7-4caa-a221-b8a2704e5a9c	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
759033ee-010f-4517-8506-b65d6ad11ee8	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
759033ee-010f-4517-8506-b65d6ad11ee8	ca652ee1-1423-42fe-a0ef-e5761a670845
759033ee-010f-4517-8506-b65d6ad11ee8	ee140dfb-14f6-41d3-b2b0-4e50764290d7
759033ee-010f-4517-8506-b65d6ad11ee8	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
759033ee-010f-4517-8506-b65d6ad11ee8	7879f271-4036-48be-befb-f08de052bcdc
759033ee-010f-4517-8506-b65d6ad11ee8	7a90bccb-346e-4933-aaeb-cdef732be976
759033ee-010f-4517-8506-b65d6ad11ee8	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
add6498d-bbfa-4d87-b3da-ff3115179a0e	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
add6498d-bbfa-4d87-b3da-ff3115179a0e	ca652ee1-1423-42fe-a0ef-e5761a670845
add6498d-bbfa-4d87-b3da-ff3115179a0e	ee140dfb-14f6-41d3-b2b0-4e50764290d7
add6498d-bbfa-4d87-b3da-ff3115179a0e	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
add6498d-bbfa-4d87-b3da-ff3115179a0e	7879f271-4036-48be-befb-f08de052bcdc
add6498d-bbfa-4d87-b3da-ff3115179a0e	7a90bccb-346e-4933-aaeb-cdef732be976
add6498d-bbfa-4d87-b3da-ff3115179a0e	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
2d595a43-5d31-45d0-b38f-0323c78dc7cb	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
2d595a43-5d31-45d0-b38f-0323c78dc7cb	ca652ee1-1423-42fe-a0ef-e5761a670845
2d595a43-5d31-45d0-b38f-0323c78dc7cb	ee140dfb-14f6-41d3-b2b0-4e50764290d7
2d595a43-5d31-45d0-b38f-0323c78dc7cb	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
2d595a43-5d31-45d0-b38f-0323c78dc7cb	7879f271-4036-48be-befb-f08de052bcdc
2d595a43-5d31-45d0-b38f-0323c78dc7cb	7a90bccb-346e-4933-aaeb-cdef732be976
2d595a43-5d31-45d0-b38f-0323c78dc7cb	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
d86f2de5-853a-435a-ac57-dfc200e6a846	ee140dfb-14f6-41d3-b2b0-4e50764290d7
d86f2de5-853a-435a-ac57-dfc200e6a846	25db9c19-f84e-40d8-9dfb-ee94478ca40a
d86f2de5-853a-435a-ac57-dfc200e6a846	600ccd3a-a513-4a4a-864b-e00bfc9699f9
d86f2de5-853a-435a-ac57-dfc200e6a846	7a90bccb-346e-4933-aaeb-cdef732be976
d86f2de5-853a-435a-ac57-dfc200e6a846	82f57a9f-6615-4527-816f-31ee7a0b7c98
d86f2de5-853a-435a-ac57-dfc200e6a846	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
d86f2de5-853a-435a-ac57-dfc200e6a846	f30de478-b560-47f5-8588-8062ffc64a25
d86f2de5-853a-435a-ac57-dfc200e6a846	ca652ee1-1423-42fe-a0ef-e5761a670845
d86f2de5-853a-435a-ac57-dfc200e6a846	7879f271-4036-48be-befb-f08de052bcdc
d86f2de5-853a-435a-ac57-dfc200e6a846	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
7ef55206-4dc3-44f9-89f2-8f141237b3a7	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
7ef55206-4dc3-44f9-89f2-8f141237b3a7	ca652ee1-1423-42fe-a0ef-e5761a670845
7ef55206-4dc3-44f9-89f2-8f141237b3a7	ee140dfb-14f6-41d3-b2b0-4e50764290d7
7ef55206-4dc3-44f9-89f2-8f141237b3a7	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
7ef55206-4dc3-44f9-89f2-8f141237b3a7	7879f271-4036-48be-befb-f08de052bcdc
7ef55206-4dc3-44f9-89f2-8f141237b3a7	7a90bccb-346e-4933-aaeb-cdef732be976
7ef55206-4dc3-44f9-89f2-8f141237b3a7	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
40464e44-d5df-48cb-b862-5a9b5d4ffa11	600ccd3a-a513-4a4a-864b-e00bfc9699f9
40464e44-d5df-48cb-b862-5a9b5d4ffa11	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
302234fb-76ed-42cd-b9d2-959f66e7bdff	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
302234fb-76ed-42cd-b9d2-959f66e7bdff	ca652ee1-1423-42fe-a0ef-e5761a670845
302234fb-76ed-42cd-b9d2-959f66e7bdff	ee140dfb-14f6-41d3-b2b0-4e50764290d7
302234fb-76ed-42cd-b9d2-959f66e7bdff	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
302234fb-76ed-42cd-b9d2-959f66e7bdff	7879f271-4036-48be-befb-f08de052bcdc
302234fb-76ed-42cd-b9d2-959f66e7bdff	7a90bccb-346e-4933-aaeb-cdef732be976
302234fb-76ed-42cd-b9d2-959f66e7bdff	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
c9d1165c-a8f3-496d-8825-74c1cf81684e	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
c9d1165c-a8f3-496d-8825-74c1cf81684e	25db9c19-f84e-40d8-9dfb-ee94478ca40a
c9d1165c-a8f3-496d-8825-74c1cf81684e	600ccd3a-a513-4a4a-864b-e00bfc9699f9
c9d1165c-a8f3-496d-8825-74c1cf81684e	82f57a9f-6615-4527-816f-31ee7a0b7c98
c9d1165c-a8f3-496d-8825-74c1cf81684e	f30de478-b560-47f5-8588-8062ffc64a25
c9d1165c-a8f3-496d-8825-74c1cf81684e	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
c9d1165c-a8f3-496d-8825-74c1cf81684e	31f1de58-af98-4946-997c-622cb20d9504
c9d1165c-a8f3-496d-8825-74c1cf81684e	ee140dfb-14f6-41d3-b2b0-4e50764290d7
ddf30ba1-4908-409d-ab39-cf57d34d658e	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
ddf30ba1-4908-409d-ab39-cf57d34d658e	ca652ee1-1423-42fe-a0ef-e5761a670845
ddf30ba1-4908-409d-ab39-cf57d34d658e	ee140dfb-14f6-41d3-b2b0-4e50764290d7
ddf30ba1-4908-409d-ab39-cf57d34d658e	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
ddf30ba1-4908-409d-ab39-cf57d34d658e	7879f271-4036-48be-befb-f08de052bcdc
ddf30ba1-4908-409d-ab39-cf57d34d658e	7a90bccb-346e-4933-aaeb-cdef732be976
ddf30ba1-4908-409d-ab39-cf57d34d658e	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
3a5978db-27ab-471b-88cf-fd7431226e17	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
3a5978db-27ab-471b-88cf-fd7431226e17	ca652ee1-1423-42fe-a0ef-e5761a670845
3a5978db-27ab-471b-88cf-fd7431226e17	ee140dfb-14f6-41d3-b2b0-4e50764290d7
3a5978db-27ab-471b-88cf-fd7431226e17	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
3a5978db-27ab-471b-88cf-fd7431226e17	7879f271-4036-48be-befb-f08de052bcdc
3a5978db-27ab-471b-88cf-fd7431226e17	7a90bccb-346e-4933-aaeb-cdef732be976
3a5978db-27ab-471b-88cf-fd7431226e17	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
074089ce-2f23-49b6-bfa5-7b8b2f7a1f31	7879f271-4036-48be-befb-f08de052bcdc
074089ce-2f23-49b6-bfa5-7b8b2f7a1f31	7a90bccb-346e-4933-aaeb-cdef732be976
074089ce-2f23-49b6-bfa5-7b8b2f7a1f31	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
074089ce-2f23-49b6-bfa5-7b8b2f7a1f31	ca652ee1-1423-42fe-a0ef-e5761a670845
074089ce-2f23-49b6-bfa5-7b8b2f7a1f31	ee140dfb-14f6-41d3-b2b0-4e50764290d7
e0a7b845-b083-4f2c-a93b-38bd9d04df10	25db9c19-f84e-40d8-9dfb-ee94478ca40a
e0a7b845-b083-4f2c-a93b-38bd9d04df10	4d783a5d-2c91-4cc0-89f6-42d0b5d189c8
e0a7b845-b083-4f2c-a93b-38bd9d04df10	600ccd3a-a513-4a4a-864b-e00bfc9699f9
e0a7b845-b083-4f2c-a93b-38bd9d04df10	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
e0a7b845-b083-4f2c-a93b-38bd9d04df10	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
e0a7b845-b083-4f2c-a93b-38bd9d04df10	7879f271-4036-48be-befb-f08de052bcdc
e0a7b845-b083-4f2c-a93b-38bd9d04df10	7a90bccb-346e-4933-aaeb-cdef732be976
e0a7b845-b083-4f2c-a93b-38bd9d04df10	82f57a9f-6615-4527-816f-31ee7a0b7c98
e0a7b845-b083-4f2c-a93b-38bd9d04df10	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
e0a7b845-b083-4f2c-a93b-38bd9d04df10	ca652ee1-1423-42fe-a0ef-e5761a670845
e0a7b845-b083-4f2c-a93b-38bd9d04df10	ee140dfb-14f6-41d3-b2b0-4e50764290d7
e0a7b845-b083-4f2c-a93b-38bd9d04df10	f30de478-b560-47f5-8588-8062ffc64a25
1b11054e-5c4d-4add-9e63-e72448846652	82f57a9f-6615-4527-816f-31ee7a0b7c98
1b11054e-5c4d-4add-9e63-e72448846652	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
c9082d89-1383-4f85-9a06-b3e2a518eaf5	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
375b6658-2684-4295-83c8-09c5d062749d	25db9c19-f84e-40d8-9dfb-ee94478ca40a
375b6658-2684-4295-83c8-09c5d062749d	600ccd3a-a513-4a4a-864b-e00bfc9699f9
375b6658-2684-4295-83c8-09c5d062749d	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
375b6658-2684-4295-83c8-09c5d062749d	7a90bccb-346e-4933-aaeb-cdef732be976
375b6658-2684-4295-83c8-09c5d062749d	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
375b6658-2684-4295-83c8-09c5d062749d	ee140dfb-14f6-41d3-b2b0-4e50764290d7
5e1d4688-01f9-4040-8367-402d346492e5	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
5e1d4688-01f9-4040-8367-402d346492e5	ca652ee1-1423-42fe-a0ef-e5761a670845
5e1d4688-01f9-4040-8367-402d346492e5	ee140dfb-14f6-41d3-b2b0-4e50764290d7
5e1d4688-01f9-4040-8367-402d346492e5	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
5e1d4688-01f9-4040-8367-402d346492e5	7879f271-4036-48be-befb-f08de052bcdc
5e1d4688-01f9-4040-8367-402d346492e5	7a90bccb-346e-4933-aaeb-cdef732be976
5e1d4688-01f9-4040-8367-402d346492e5	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
252e608e-1966-49c9-a1ac-c617eabb01bb	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
0948ffd3-19e3-4819-a667-0f9a4d3991f7	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
63d96d4d-9eba-42f1-853b-c4756a104308	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
608df3c5-f75e-4457-81f0-3aa52cc47c9d	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
48f01dec-6f89-41eb-a461-5c8aed9b8c76	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
48f01dec-6f89-41eb-a461-5c8aed9b8c76	ca652ee1-1423-42fe-a0ef-e5761a670845
48f01dec-6f89-41eb-a461-5c8aed9b8c76	ee140dfb-14f6-41d3-b2b0-4e50764290d7
48f01dec-6f89-41eb-a461-5c8aed9b8c76	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
48f01dec-6f89-41eb-a461-5c8aed9b8c76	7879f271-4036-48be-befb-f08de052bcdc
48f01dec-6f89-41eb-a461-5c8aed9b8c76	7a90bccb-346e-4933-aaeb-cdef732be976
48f01dec-6f89-41eb-a461-5c8aed9b8c76	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
cb2365c8-f314-4744-a80e-a709a02817f8	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
cb2365c8-f314-4744-a80e-a709a02817f8	ca652ee1-1423-42fe-a0ef-e5761a670845
cb2365c8-f314-4744-a80e-a709a02817f8	ee140dfb-14f6-41d3-b2b0-4e50764290d7
cb2365c8-f314-4744-a80e-a709a02817f8	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
cb2365c8-f314-4744-a80e-a709a02817f8	7879f271-4036-48be-befb-f08de052bcdc
cb2365c8-f314-4744-a80e-a709a02817f8	7a90bccb-346e-4933-aaeb-cdef732be976
cb2365c8-f314-4744-a80e-a709a02817f8	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
b09018a0-a20b-4bd3-9852-e711754efbf5	600ccd3a-a513-4a4a-864b-e00bfc9699f9
b09018a0-a20b-4bd3-9852-e711754efbf5	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
b09018a0-a20b-4bd3-9852-e711754efbf5	7879f271-4036-48be-befb-f08de052bcdc
b09018a0-a20b-4bd3-9852-e711754efbf5	7a90bccb-346e-4933-aaeb-cdef732be976
b09018a0-a20b-4bd3-9852-e711754efbf5	82f57a9f-6615-4527-816f-31ee7a0b7c98
b09018a0-a20b-4bd3-9852-e711754efbf5	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
b09018a0-a20b-4bd3-9852-e711754efbf5	ca652ee1-1423-42fe-a0ef-e5761a670845
b09018a0-a20b-4bd3-9852-e711754efbf5	ee140dfb-14f6-41d3-b2b0-4e50764290d7
b09018a0-a20b-4bd3-9852-e711754efbf5	f30de478-b560-47f5-8588-8062ffc64a25
daea1cc1-364d-4be3-a8d3-ba1259d61e54	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
daea1cc1-364d-4be3-a8d3-ba1259d61e54	ca652ee1-1423-42fe-a0ef-e5761a670845
daea1cc1-364d-4be3-a8d3-ba1259d61e54	ee140dfb-14f6-41d3-b2b0-4e50764290d7
daea1cc1-364d-4be3-a8d3-ba1259d61e54	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
daea1cc1-364d-4be3-a8d3-ba1259d61e54	7879f271-4036-48be-befb-f08de052bcdc
daea1cc1-364d-4be3-a8d3-ba1259d61e54	7a90bccb-346e-4933-aaeb-cdef732be976
daea1cc1-364d-4be3-a8d3-ba1259d61e54	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
8dac34bd-e5d0-4e88-97be-76ef1da6965a	25db9c19-f84e-40d8-9dfb-ee94478ca40a
8dac34bd-e5d0-4e88-97be-76ef1da6965a	600ccd3a-a513-4a4a-864b-e00bfc9699f9
8dac34bd-e5d0-4e88-97be-76ef1da6965a	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
8dac34bd-e5d0-4e88-97be-76ef1da6965a	7879f271-4036-48be-befb-f08de052bcdc
8dac34bd-e5d0-4e88-97be-76ef1da6965a	7a90bccb-346e-4933-aaeb-cdef732be976
8dac34bd-e5d0-4e88-97be-76ef1da6965a	82f57a9f-6615-4527-816f-31ee7a0b7c98
8dac34bd-e5d0-4e88-97be-76ef1da6965a	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
8dac34bd-e5d0-4e88-97be-76ef1da6965a	ca652ee1-1423-42fe-a0ef-e5761a670845
8dac34bd-e5d0-4e88-97be-76ef1da6965a	ee140dfb-14f6-41d3-b2b0-4e50764290d7
8dac34bd-e5d0-4e88-97be-76ef1da6965a	f30de478-b560-47f5-8588-8062ffc64a25
29f7bc2a-76ff-4f94-8cb1-1f11045297a1	25db9c19-f84e-40d8-9dfb-ee94478ca40a
29f7bc2a-76ff-4f94-8cb1-1f11045297a1	600ccd3a-a513-4a4a-864b-e00bfc9699f9
29f7bc2a-76ff-4f94-8cb1-1f11045297a1	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
29f7bc2a-76ff-4f94-8cb1-1f11045297a1	7879f271-4036-48be-befb-f08de052bcdc
29f7bc2a-76ff-4f94-8cb1-1f11045297a1	7a90bccb-346e-4933-aaeb-cdef732be976
29f7bc2a-76ff-4f94-8cb1-1f11045297a1	82f57a9f-6615-4527-816f-31ee7a0b7c98
29f7bc2a-76ff-4f94-8cb1-1f11045297a1	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
29f7bc2a-76ff-4f94-8cb1-1f11045297a1	ca652ee1-1423-42fe-a0ef-e5761a670845
29f7bc2a-76ff-4f94-8cb1-1f11045297a1	ee140dfb-14f6-41d3-b2b0-4e50764290d7
29f7bc2a-76ff-4f94-8cb1-1f11045297a1	f30de478-b560-47f5-8588-8062ffc64a25
6eaf91dc-0e6f-4760-a528-272403cdc422	25db9c19-f84e-40d8-9dfb-ee94478ca40a
6eaf91dc-0e6f-4760-a528-272403cdc422	600ccd3a-a513-4a4a-864b-e00bfc9699f9
6eaf91dc-0e6f-4760-a528-272403cdc422	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
6eaf91dc-0e6f-4760-a528-272403cdc422	7879f271-4036-48be-befb-f08de052bcdc
6eaf91dc-0e6f-4760-a528-272403cdc422	7a90bccb-346e-4933-aaeb-cdef732be976
6eaf91dc-0e6f-4760-a528-272403cdc422	82f57a9f-6615-4527-816f-31ee7a0b7c98
6eaf91dc-0e6f-4760-a528-272403cdc422	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
6eaf91dc-0e6f-4760-a528-272403cdc422	ca652ee1-1423-42fe-a0ef-e5761a670845
6eaf91dc-0e6f-4760-a528-272403cdc422	ee140dfb-14f6-41d3-b2b0-4e50764290d7
6eaf91dc-0e6f-4760-a528-272403cdc422	f30de478-b560-47f5-8588-8062ffc64a25
a3df9a5b-6188-4a59-b780-019b5897954c	25db9c19-f84e-40d8-9dfb-ee94478ca40a
a3df9a5b-6188-4a59-b780-019b5897954c	600ccd3a-a513-4a4a-864b-e00bfc9699f9
a3df9a5b-6188-4a59-b780-019b5897954c	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
a3df9a5b-6188-4a59-b780-019b5897954c	7879f271-4036-48be-befb-f08de052bcdc
a3df9a5b-6188-4a59-b780-019b5897954c	7a90bccb-346e-4933-aaeb-cdef732be976
a3df9a5b-6188-4a59-b780-019b5897954c	82f57a9f-6615-4527-816f-31ee7a0b7c98
a3df9a5b-6188-4a59-b780-019b5897954c	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
a3df9a5b-6188-4a59-b780-019b5897954c	ca652ee1-1423-42fe-a0ef-e5761a670845
a3df9a5b-6188-4a59-b780-019b5897954c	ee140dfb-14f6-41d3-b2b0-4e50764290d7
a3df9a5b-6188-4a59-b780-019b5897954c	f30de478-b560-47f5-8588-8062ffc64a25
4260972d-58a7-41bc-8ebb-a2c94c6cbe8c	ee140dfb-14f6-41d3-b2b0-4e50764290d7
4260972d-58a7-41bc-8ebb-a2c94c6cbe8c	ca652ee1-1423-42fe-a0ef-e5761a670845
4260972d-58a7-41bc-8ebb-a2c94c6cbe8c	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
4260972d-58a7-41bc-8ebb-a2c94c6cbe8c	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
4260972d-58a7-41bc-8ebb-a2c94c6cbe8c	7a90bccb-346e-4933-aaeb-cdef732be976
78dc049f-b901-4a54-8068-05f5e3c879b8	25db9c19-f84e-40d8-9dfb-ee94478ca40a
78dc049f-b901-4a54-8068-05f5e3c879b8	600ccd3a-a513-4a4a-864b-e00bfc9699f9
78dc049f-b901-4a54-8068-05f5e3c879b8	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
78dc049f-b901-4a54-8068-05f5e3c879b8	7879f271-4036-48be-befb-f08de052bcdc
78dc049f-b901-4a54-8068-05f5e3c879b8	7a90bccb-346e-4933-aaeb-cdef732be976
78dc049f-b901-4a54-8068-05f5e3c879b8	82f57a9f-6615-4527-816f-31ee7a0b7c98
78dc049f-b901-4a54-8068-05f5e3c879b8	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
78dc049f-b901-4a54-8068-05f5e3c879b8	ca652ee1-1423-42fe-a0ef-e5761a670845
78dc049f-b901-4a54-8068-05f5e3c879b8	ee140dfb-14f6-41d3-b2b0-4e50764290d7
78dc049f-b901-4a54-8068-05f5e3c879b8	f30de478-b560-47f5-8588-8062ffc64a25
8bdd2810-4147-4198-9008-67bdb770b440	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
8bdd2810-4147-4198-9008-67bdb770b440	ca652ee1-1423-42fe-a0ef-e5761a670845
8bdd2810-4147-4198-9008-67bdb770b440	ee140dfb-14f6-41d3-b2b0-4e50764290d7
8bdd2810-4147-4198-9008-67bdb770b440	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
8bdd2810-4147-4198-9008-67bdb770b440	7879f271-4036-48be-befb-f08de052bcdc
8bdd2810-4147-4198-9008-67bdb770b440	7a90bccb-346e-4933-aaeb-cdef732be976
8bdd2810-4147-4198-9008-67bdb770b440	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
13041466-28d1-49be-9f9c-baea49780335	ca652ee1-1423-42fe-a0ef-e5761a670845
13041466-28d1-49be-9f9c-baea49780335	ee140dfb-14f6-41d3-b2b0-4e50764290d7
13041466-28d1-49be-9f9c-baea49780335	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
13041466-28d1-49be-9f9c-baea49780335	7a90bccb-346e-4933-aaeb-cdef732be976
13041466-28d1-49be-9f9c-baea49780335	82f57a9f-6615-4527-816f-31ee7a0b7c98
13041466-28d1-49be-9f9c-baea49780335	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
ce8a900c-eab9-44c2-bf95-873272fa5e77	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
ce8a900c-eab9-44c2-bf95-873272fa5e77	ee140dfb-14f6-41d3-b2b0-4e50764290d7
ce8a900c-eab9-44c2-bf95-873272fa5e77	25db9c19-f84e-40d8-9dfb-ee94478ca40a
ce8a900c-eab9-44c2-bf95-873272fa5e77	600ccd3a-a513-4a4a-864b-e00bfc9699f9
ce8a900c-eab9-44c2-bf95-873272fa5e77	7a90bccb-346e-4933-aaeb-cdef732be976
ce8a900c-eab9-44c2-bf95-873272fa5e77	82f57a9f-6615-4527-816f-31ee7a0b7c98
ce8a900c-eab9-44c2-bf95-873272fa5e77	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
ce8a900c-eab9-44c2-bf95-873272fa5e77	f30de478-b560-47f5-8588-8062ffc64a25
ce8a900c-eab9-44c2-bf95-873272fa5e77	ca652ee1-1423-42fe-a0ef-e5761a670845
ce8a900c-eab9-44c2-bf95-873272fa5e77	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
ce8a900c-eab9-44c2-bf95-873272fa5e77	7879f271-4036-48be-befb-f08de052bcdc
ce8a900c-eab9-44c2-bf95-873272fa5e77	4d783a5d-2c91-4cc0-89f6-42d0b5d189c8
b79e885e-41bd-4fd6-8fb1-9e04ef3424fa	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
b79e885e-41bd-4fd6-8fb1-9e04ef3424fa	ee140dfb-14f6-41d3-b2b0-4e50764290d7
b79e885e-41bd-4fd6-8fb1-9e04ef3424fa	25db9c19-f84e-40d8-9dfb-ee94478ca40a
b79e885e-41bd-4fd6-8fb1-9e04ef3424fa	600ccd3a-a513-4a4a-864b-e00bfc9699f9
b79e885e-41bd-4fd6-8fb1-9e04ef3424fa	7a90bccb-346e-4933-aaeb-cdef732be976
b79e885e-41bd-4fd6-8fb1-9e04ef3424fa	82f57a9f-6615-4527-816f-31ee7a0b7c98
b79e885e-41bd-4fd6-8fb1-9e04ef3424fa	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
b79e885e-41bd-4fd6-8fb1-9e04ef3424fa	f30de478-b560-47f5-8588-8062ffc64a25
b79e885e-41bd-4fd6-8fb1-9e04ef3424fa	ca652ee1-1423-42fe-a0ef-e5761a670845
b79e885e-41bd-4fd6-8fb1-9e04ef3424fa	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
b79e885e-41bd-4fd6-8fb1-9e04ef3424fa	7879f271-4036-48be-befb-f08de052bcdc
b79e885e-41bd-4fd6-8fb1-9e04ef3424fa	4d783a5d-2c91-4cc0-89f6-42d0b5d189c8
c5ec9832-9fac-4c5f-b44f-de7dacedf5da	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
c5ec9832-9fac-4c5f-b44f-de7dacedf5da	ee140dfb-14f6-41d3-b2b0-4e50764290d7
c5ec9832-9fac-4c5f-b44f-de7dacedf5da	25db9c19-f84e-40d8-9dfb-ee94478ca40a
c5ec9832-9fac-4c5f-b44f-de7dacedf5da	600ccd3a-a513-4a4a-864b-e00bfc9699f9
c5ec9832-9fac-4c5f-b44f-de7dacedf5da	7a90bccb-346e-4933-aaeb-cdef732be976
c5ec9832-9fac-4c5f-b44f-de7dacedf5da	82f57a9f-6615-4527-816f-31ee7a0b7c98
c5ec9832-9fac-4c5f-b44f-de7dacedf5da	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
c5ec9832-9fac-4c5f-b44f-de7dacedf5da	f30de478-b560-47f5-8588-8062ffc64a25
c5ec9832-9fac-4c5f-b44f-de7dacedf5da	ca652ee1-1423-42fe-a0ef-e5761a670845
c5ec9832-9fac-4c5f-b44f-de7dacedf5da	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
c5ec9832-9fac-4c5f-b44f-de7dacedf5da	7879f271-4036-48be-befb-f08de052bcdc
c5ec9832-9fac-4c5f-b44f-de7dacedf5da	4d783a5d-2c91-4cc0-89f6-42d0b5d189c8
885eabe5-ee9d-4574-b03a-921865923f62	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
885eabe5-ee9d-4574-b03a-921865923f62	ee140dfb-14f6-41d3-b2b0-4e50764290d7
885eabe5-ee9d-4574-b03a-921865923f62	25db9c19-f84e-40d8-9dfb-ee94478ca40a
885eabe5-ee9d-4574-b03a-921865923f62	600ccd3a-a513-4a4a-864b-e00bfc9699f9
885eabe5-ee9d-4574-b03a-921865923f62	7a90bccb-346e-4933-aaeb-cdef732be976
885eabe5-ee9d-4574-b03a-921865923f62	82f57a9f-6615-4527-816f-31ee7a0b7c98
885eabe5-ee9d-4574-b03a-921865923f62	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
885eabe5-ee9d-4574-b03a-921865923f62	f30de478-b560-47f5-8588-8062ffc64a25
885eabe5-ee9d-4574-b03a-921865923f62	ca652ee1-1423-42fe-a0ef-e5761a670845
885eabe5-ee9d-4574-b03a-921865923f62	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
885eabe5-ee9d-4574-b03a-921865923f62	7879f271-4036-48be-befb-f08de052bcdc
885eabe5-ee9d-4574-b03a-921865923f62	4d783a5d-2c91-4cc0-89f6-42d0b5d189c8
4225e883-1e99-4cab-9000-eee3c4dfd200	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
4225e883-1e99-4cab-9000-eee3c4dfd200	ee140dfb-14f6-41d3-b2b0-4e50764290d7
4225e883-1e99-4cab-9000-eee3c4dfd200	25db9c19-f84e-40d8-9dfb-ee94478ca40a
4225e883-1e99-4cab-9000-eee3c4dfd200	600ccd3a-a513-4a4a-864b-e00bfc9699f9
4225e883-1e99-4cab-9000-eee3c4dfd200	7a90bccb-346e-4933-aaeb-cdef732be976
4225e883-1e99-4cab-9000-eee3c4dfd200	82f57a9f-6615-4527-816f-31ee7a0b7c98
4225e883-1e99-4cab-9000-eee3c4dfd200	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
4225e883-1e99-4cab-9000-eee3c4dfd200	f30de478-b560-47f5-8588-8062ffc64a25
4225e883-1e99-4cab-9000-eee3c4dfd200	ca652ee1-1423-42fe-a0ef-e5761a670845
4225e883-1e99-4cab-9000-eee3c4dfd200	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
4225e883-1e99-4cab-9000-eee3c4dfd200	7879f271-4036-48be-befb-f08de052bcdc
4225e883-1e99-4cab-9000-eee3c4dfd200	4d783a5d-2c91-4cc0-89f6-42d0b5d189c8
9752c7ba-94e3-4441-ae79-37118fcbd72e	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
9752c7ba-94e3-4441-ae79-37118fcbd72e	ee140dfb-14f6-41d3-b2b0-4e50764290d7
9752c7ba-94e3-4441-ae79-37118fcbd72e	25db9c19-f84e-40d8-9dfb-ee94478ca40a
9752c7ba-94e3-4441-ae79-37118fcbd72e	600ccd3a-a513-4a4a-864b-e00bfc9699f9
9752c7ba-94e3-4441-ae79-37118fcbd72e	7a90bccb-346e-4933-aaeb-cdef732be976
9752c7ba-94e3-4441-ae79-37118fcbd72e	82f57a9f-6615-4527-816f-31ee7a0b7c98
9752c7ba-94e3-4441-ae79-37118fcbd72e	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
9752c7ba-94e3-4441-ae79-37118fcbd72e	f30de478-b560-47f5-8588-8062ffc64a25
9752c7ba-94e3-4441-ae79-37118fcbd72e	ca652ee1-1423-42fe-a0ef-e5761a670845
9752c7ba-94e3-4441-ae79-37118fcbd72e	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
9752c7ba-94e3-4441-ae79-37118fcbd72e	7879f271-4036-48be-befb-f08de052bcdc
9752c7ba-94e3-4441-ae79-37118fcbd72e	4d783a5d-2c91-4cc0-89f6-42d0b5d189c8
d2495640-61f5-4c4d-95ee-59999fe26f27	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
d2495640-61f5-4c4d-95ee-59999fe26f27	ee140dfb-14f6-41d3-b2b0-4e50764290d7
d2495640-61f5-4c4d-95ee-59999fe26f27	25db9c19-f84e-40d8-9dfb-ee94478ca40a
d2495640-61f5-4c4d-95ee-59999fe26f27	600ccd3a-a513-4a4a-864b-e00bfc9699f9
d2495640-61f5-4c4d-95ee-59999fe26f27	7a90bccb-346e-4933-aaeb-cdef732be976
d2495640-61f5-4c4d-95ee-59999fe26f27	82f57a9f-6615-4527-816f-31ee7a0b7c98
d2495640-61f5-4c4d-95ee-59999fe26f27	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
d2495640-61f5-4c4d-95ee-59999fe26f27	f30de478-b560-47f5-8588-8062ffc64a25
d2495640-61f5-4c4d-95ee-59999fe26f27	ca652ee1-1423-42fe-a0ef-e5761a670845
d2495640-61f5-4c4d-95ee-59999fe26f27	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
d2495640-61f5-4c4d-95ee-59999fe26f27	7879f271-4036-48be-befb-f08de052bcdc
d2495640-61f5-4c4d-95ee-59999fe26f27	4d783a5d-2c91-4cc0-89f6-42d0b5d189c8
28799055-2bf2-420e-b6fb-6cb332de30b4	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
28799055-2bf2-420e-b6fb-6cb332de30b4	ee140dfb-14f6-41d3-b2b0-4e50764290d7
28799055-2bf2-420e-b6fb-6cb332de30b4	25db9c19-f84e-40d8-9dfb-ee94478ca40a
28799055-2bf2-420e-b6fb-6cb332de30b4	600ccd3a-a513-4a4a-864b-e00bfc9699f9
28799055-2bf2-420e-b6fb-6cb332de30b4	7a90bccb-346e-4933-aaeb-cdef732be976
28799055-2bf2-420e-b6fb-6cb332de30b4	82f57a9f-6615-4527-816f-31ee7a0b7c98
28799055-2bf2-420e-b6fb-6cb332de30b4	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
28799055-2bf2-420e-b6fb-6cb332de30b4	f30de478-b560-47f5-8588-8062ffc64a25
28799055-2bf2-420e-b6fb-6cb332de30b4	ca652ee1-1423-42fe-a0ef-e5761a670845
28799055-2bf2-420e-b6fb-6cb332de30b4	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
28799055-2bf2-420e-b6fb-6cb332de30b4	7879f271-4036-48be-befb-f08de052bcdc
28799055-2bf2-420e-b6fb-6cb332de30b4	4d783a5d-2c91-4cc0-89f6-42d0b5d189c8
45eafa21-ebc0-4843-9ca5-a3f65bcd3ebf	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
45eafa21-ebc0-4843-9ca5-a3f65bcd3ebf	ee140dfb-14f6-41d3-b2b0-4e50764290d7
45eafa21-ebc0-4843-9ca5-a3f65bcd3ebf	25db9c19-f84e-40d8-9dfb-ee94478ca40a
45eafa21-ebc0-4843-9ca5-a3f65bcd3ebf	600ccd3a-a513-4a4a-864b-e00bfc9699f9
45eafa21-ebc0-4843-9ca5-a3f65bcd3ebf	7a90bccb-346e-4933-aaeb-cdef732be976
45eafa21-ebc0-4843-9ca5-a3f65bcd3ebf	82f57a9f-6615-4527-816f-31ee7a0b7c98
45eafa21-ebc0-4843-9ca5-a3f65bcd3ebf	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
45eafa21-ebc0-4843-9ca5-a3f65bcd3ebf	f30de478-b560-47f5-8588-8062ffc64a25
45eafa21-ebc0-4843-9ca5-a3f65bcd3ebf	ca652ee1-1423-42fe-a0ef-e5761a670845
45eafa21-ebc0-4843-9ca5-a3f65bcd3ebf	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
45eafa21-ebc0-4843-9ca5-a3f65bcd3ebf	7879f271-4036-48be-befb-f08de052bcdc
45eafa21-ebc0-4843-9ca5-a3f65bcd3ebf	4d783a5d-2c91-4cc0-89f6-42d0b5d189c8
624bc2ec-5a14-4998-bf48-ee1216f38790	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
624bc2ec-5a14-4998-bf48-ee1216f38790	600ccd3a-a513-4a4a-864b-e00bfc9699f9
624bc2ec-5a14-4998-bf48-ee1216f38790	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
624bc2ec-5a14-4998-bf48-ee1216f38790	7a90bccb-346e-4933-aaeb-cdef732be976
624bc2ec-5a14-4998-bf48-ee1216f38790	ee140dfb-14f6-41d3-b2b0-4e50764290d7
624bc2ec-5a14-4998-bf48-ee1216f38790	25db9c19-f84e-40d8-9dfb-ee94478ca40a
624bc2ec-5a14-4998-bf48-ee1216f38790	f30de478-b560-47f5-8588-8062ffc64a25
a8663afc-06b9-4e95-a9c8-bd57f898bf52	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
a8663afc-06b9-4e95-a9c8-bd57f898bf52	ca652ee1-1423-42fe-a0ef-e5761a670845
a8663afc-06b9-4e95-a9c8-bd57f898bf52	ee140dfb-14f6-41d3-b2b0-4e50764290d7
a8663afc-06b9-4e95-a9c8-bd57f898bf52	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
a8663afc-06b9-4e95-a9c8-bd57f898bf52	7879f271-4036-48be-befb-f08de052bcdc
a8663afc-06b9-4e95-a9c8-bd57f898bf52	7a90bccb-346e-4933-aaeb-cdef732be976
a8663afc-06b9-4e95-a9c8-bd57f898bf52	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
d167d1c7-ba53-42c5-ac8a-c07c204215c8	69324499-ae41-4ce4-bdaa-6072e0e5c2d3
d167d1c7-ba53-42c5-ac8a-c07c204215c8	ca652ee1-1423-42fe-a0ef-e5761a670845
d167d1c7-ba53-42c5-ac8a-c07c204215c8	ee140dfb-14f6-41d3-b2b0-4e50764290d7
d167d1c7-ba53-42c5-ac8a-c07c204215c8	b205816d-d8cb-4dc5-a6b0-9d68e3c7e38e
d167d1c7-ba53-42c5-ac8a-c07c204215c8	7879f271-4036-48be-befb-f08de052bcdc
d167d1c7-ba53-42c5-ac8a-c07c204215c8	7a90bccb-346e-4933-aaeb-cdef732be976
d167d1c7-ba53-42c5-ac8a-c07c204215c8	6cf94e1d-6931-4c2b-9dbd-51412cd3e9e0
\.


--
-- Data for Name: verification_requests; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.verification_requests (id, created_at, updated_at, identifier, token, expires) FROM stdin;
fda2b513-be49-4f30-b4bb-196647a2d5a9	2021-04-21 12:07:51.130826+00	2021-04-21 12:07:51.13087+00	null	5daa639ad35b7048685fb9e9e8fdc9bbe18e5e3cc48e3adb147c4ba3d1b2a8bc	2021-04-22 12:07:51.129+00
74011d92-c42f-42e8-b180-e9d29dc970f8	2021-04-21 12:08:00.527538+00	2021-04-21 12:08:00.527561+00	me@asd.com	7f673fe487fb67cc24629fac8f7453c6135ac135138df5e02eb2b936993b905a	2021-04-22 12:08:00.526+00
f2f98973-7f12-481d-89c1-b997beb6a434	2021-05-21 10:00:25.787+00	2021-05-21 10:00:25.787+00	null	5a68754233cbebf40934b00c4844df689fecde3894fec5ee34978c5d967fe079	2021-05-22 10:00:25.786+00
5d28babc-d0ae-4684-aff1-cfd4d2846dbc	2021-07-30 10:48:16.426+00	2021-07-30 10:48:16.426+00	me@chrsitophwitzko.com	6601965750de866262acd4b8939a4a4fd4e8fb54e0960d3767da95844ab0565f	2021-07-31 10:48:16.424+00
\.


--
-- Data for Name: whitelist; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.whitelist (email, "timestamp", is_approved) FROM stdin;
marcel@steeped.app	2021-07-07 13:58:30.043736+00	t
harry@greyparrot.ai	2021-07-07 13:58:46.127388+00	t
janek@steeped.app	2021-07-07 13:58:39.717725+00	t
noah@obilityconsulting.com	2021-07-12 15:39:41.695+00	t
torben@friehe.me	2021-07-13 19:55:21.679841+00	t
yann@leretaille.com	2021-07-13 19:55:54.017429+00	t
lisa@visionariesclub.vc	2021-07-15 08:22:00.217665+00	t
bobby@visionaries.vc	2021-07-15 08:22:09.513093+00	t
alex@sumup.com	2021-07-15 08:30:41.136108+00	t
alexander.riesenkampff@sumup.com	2021-07-16 13:15:39.598+00	t
j.oshea@ladder.io	2021-07-19 13:24:56.916+00	t
robert.jaeckle@visionariesclub.vc	2021-07-19 15:07:54.062+00	f
jochen.hartmann@uni-hamburg.de	2021-07-21 09:24:25.594447+00	t
hello@arnoldasux.com	2021-07-27 09:27:47.131+00	f
gregorwbr@gmail.com	2021-07-27 16:26:50.907+00	f
daniel@dance.co	2021-07-28 08:55:36.437473+00	t
adam@pietrasiak.com	2021-07-30 08:01:46.835+00	f
me@christophwitzko.com	2021-07-16 08:47:22.124+00	t
\.


--
-- PostgreSQL database dump complete
--

