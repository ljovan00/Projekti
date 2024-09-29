# Projekti

# Project Repository

This repository contains several projects that I have been working on. Each project focuses on different topics and utilizes various techniques and tools for analysis. Here are the highlights of each project:

## Analiza_podataka_burza

Analiza_podataka_burza is a collaborative project that explores stock market data and its correlation with tweets from influential individuals such as Elon Musk. 
The goal is to analyze the rise and fall of stocks based on these tweets and identify any patterns or periodicities in the data. 
The project also investigates whether specific periods of the year have an impact on the value of shares.

## Jovanović_analiza_mreža_football_transfers

Jovanović_analiza_mreža_football_transfers is a project that combines my passion for football with my knowledge of network analysis. 
The objective of this project is to analyze football transfer networks from 2000 to 2018 and uncover any hidden patterns in the data. 
The project employs various centrality metrics to examine the relationships between leagues, the dynamics of the leagues themselves, and the transfer activities among them.

## STROJNO_projekt

STROJNO_projekt focuses on convolutional neural networks (CNNs). 
It involves training a model on two distinct datasets: 
one consisting of images of fires in nature and the other containing images of nature without fires. 
The project demonstrates how CNNs can be employed for image recognition tasks. 
Additionally, it showcases the concept of "transfer learning," where pre-trained models are utilized to recognize images based on prior experience.

## Projekt_prva_godina
Projekt_prva_godina aims to compare the performance of One Stage and Two Stage algorithms. The project focuses on evaluating different architectural approaches and their impact on performance. Two different datasets with varying image qualities were used for the experiment. Several metrics were obtained, including frames per second (fps), average number of objects detected in each image, and average time per image.

## Visualization
Dataset link: https://www.kaggle.com/datasets/uciml/electric-power-consumption-data-set

Description of the selected problem:


The project deals with the analysis and visualization of data on electricity consumption with the aim of identifying consumption patterns during the day and year. The problem we are solving is understanding how electricity is used at different times of the day and during different years, which can help optimize energy use and reduce costs.

Visualization goal:
The goal of this visualization is to enable users to easily understand electricity consumption patterns through interactive graphs and diagrams. The visualization provides an insight into the average consumption per hour during the day for the selected years. Using d3.js library.

Technical implementation:
The visualization is implemented using D3.js. The data was first parsed from CSV format and grouped by hours. Scaling and axes were used for the bar chart to show consumption by hours. The line chart shows consumption trends through the hours, while the pie chart shows the distribution of consumption as a percentage of the total daily consumption.

Application possibilities:

• Planning and optimization of energy consumption

• Identification of periods of high and low consumption

• Making data-driven decisions to reduce energy costs

## Named entity recognition (NER) project

This is a project focused on implementing a Named Entity Recognition (NER) system using machine learning techniques. The goal is to classify and label entities within sentences, such as persons (PER), organizations (ORG), locations (LOC), and miscellaneous entities (MISC). The project utilizes a pre-trained model, makes predictions on test data, and evaluates the model's performance using precision, recall, and F1-score.
Features

Data preprocessing using the conllu library.

Model prediction using a pre-trained NER model.

Evaluation of model performance using scikit-learn metrics.

Handles various entity types like persons (PER), organizations (ORG), locations (LOC), and miscellaneous (MISC).

Future Improvements

While the current model achieves reasonable performance, there are several ways to improve the project:

Fine-tuning the Pre-trained Model: The model could benefit from fine-tuning on the specific dataset.

Handling Class Imbalance: The model struggles with some entity types (I-loc, I-misc). Applying techniques such as class weighting or oversampling may improve results.

Error Analysis: Perform detailed error analysis to understand where the model misclassifies entities.

Switch to Transformer Models: Consider using transformer-based models like BERT for improved accuracy, especially on more complex entity types.

Hyperparameter Tuning: Experiment with different hyperparameters to optimize the model’s performance.

⚠️ Note: The dataset is not included in this repository due to licensing restrictions. However, you can use any NER dataset in CoNLL-U format. Popular options include the CoNLL-2003 dataset or other publicly available datasets.

Feel free to explore each project for more details, including source code and datasets.

